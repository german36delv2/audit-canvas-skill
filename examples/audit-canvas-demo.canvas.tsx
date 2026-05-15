// Demo-only: fictional "Acme Shop" API audit. Copy this file to:
//   ~/.cursor/projects/<your-workspace>/canvases/acme-demo.canvas.tsx
// to open it as a live Canvas in Cursor. Only imports from "cursor/canvas".

import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

export default function AcmeShopDemoAudit() {
  return (
    <Stack gap={24}>
      <Stack gap={8}>
        <H1>Security audit — acme-shop-api</H1>
        <Text tone="secondary">
          Scope: REST API and admin surface for a B2B storefront (Laravel 10,
          PHP 8.2, MySQL 8, Redis sessions). Reviewed HTTP routes, form
          requests, policies, file uploads, dependency lockfiles, and staging
          deployment config. Mobile clients and third-party webhooks were out
          of scope.
        </Text>
      </Stack>

      <Grid columns={5} gap={12}>
        <Stat value="1" label="Critical" tone="danger" />
        <Stat value="2" label="High" tone="warning" />
        <Stat value="3" label="Medium" tone="info" />
        <Stat value="2" label="Low" />
        <Stat value="8" label="Total findings" />
      </Grid>

      <Callout tone="warning" title="Deploy verdict">
        Do not promote the current main branch to production until C1 is fixed
        and verified. The worst issue is unguarded mass assignment on the
        profile endpoint, which allows role escalation for any authenticated
        user. After C1, schedule H1 and H2 before the next public marketing
        push.
      </Callout>

      <Divider />

      <H2>Stack maturity</H2>
      <Table
        headers={["Component", "Version", "Status", "Notes"]}
        columnAlign={["left", "left", "left", "left"]}
        rowTone={[undefined, "warning", "info", undefined]}
        rows={[
          ["PHP", "8.2.x", "Supported", "Patch within 30 days of security releases."],
          ["laravel/framework", "^10.48", "Supported", "Plan 10.x → 11.x after Q3 freeze."],
          ["guzzlehttp/guzzle", "7.8.x", "Monitor", "No known CVEs on this lock; re-run composer audit weekly."],
          ["spatie/laravel-permission", "6.x", "OK", "Policies align with package defaults; custom gates reviewed."],
        ]}
      />

      <Divider />

      <H2>Critical findings</H2>

      <Card>
        <CardHeader trailing={<Pill tone="deleted" active size="sm">CRITICAL</Pill>}>
          C1 · Mass assignment allows promoting any user to admin
        </CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              <Code>app/Http/Controllers/Api/ProfileController.php:42</Code> —
              The update action passes the full request body into{" "}
              <Code>$user-&gt;update(...)</Code> without a Form Request or
              explicit fillable guard for <Code>role_id</Code>.
            </Text>

            <H3>Impact</H3>
            <Text>
              Any logged-in user can set <Code>role_id</Code> to the
              administrator role and obtain full platform access, including
              supplier payouts and PII export.
            </Text>

            <H3>Reproduction</H3>
            <Code block>
              {`curl -X PATCH https://api.example.com/v1/me \\
  -H "Authorization: Bearer <normal_user_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"pwned","role_id":1}'`}
            </Code>

            <H3>Before / after</H3>
            <Code block>
              {`// Before
$user->update($request->all());

// After (illustrative)
$user->update($request->validated());`}
            </Code>

            <Text tone="secondary">
              Patch: <Code>audit-canvas/patches/C1-profile-mass-assignment.patch</Code>
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <H2>High findings</H2>

      <Card>
        <CardHeader trailing={<Pill tone="warning" active size="sm">HIGH</Pill>}>
          H1 · IDOR on invoice PDF download
        </CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              <Code>routes/api.php:118</Code> — Invoice download resolves the
              model by numeric id only; organization scoping is missing on the
              route middleware.
            </Text>
            <H3>Impact</H3>
            <Text>
              Authenticated users can enumerate invoice ids and retrieve other
              customers&apos; PDFs (financial data disclosure).
            </Text>
            <H3>Fix</H3>
            <Text>
              Authorize with a policy that binds <Code>invoice.organization_id</Code>{" "}
              to the current user&apos;s organization; add a regression test.
              Patch: <Code>audit-canvas/patches/H1-invoice-idor.patch</Code>
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={<Pill tone="warning" active size="sm">HIGH</Pill>}>
          H2 · Debug route reachable in staging behind the same hostname as prod
        </CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              <Code>routes/web.php:24</Code> — Telescope is registered when{" "}
              <Code>APP_ENV=staging</Code>; DNS for staging currently points at
              the production load balancer in error.
            </Text>
            <H3>Impact</H3>
            <Text>
              Attackers who discover the path can replay queued jobs and read
              request metadata (tokens in headers, email parameters).
            </Text>
            <H3>Fix</H3>
            <Text>
              Split hostnames, gate Telescope by IP allowlist, and disable in
              any environment reachable from the public internet. Patch:{" "}
              <Code>audit-canvas/patches/H2-telescope-exposure.patch</Code>
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <H2>Medium and low findings</H2>
      <Table
        headers={["Id", "Severity", "Location", "Issue", "Fix"]}
        columnAlign={["left", "left", "left", "left", "left"]}
        rowTone={["info", "info", "neutral", "neutral", undefined]}
        rows={[
          [
            "M1",
            "Medium",
            "config/session.php:34",
            "SameSite=Lax on session cookie for admin",
            "Use strict + confirm payment flows still work",
          ],
          [
            "M2",
            "Medium",
            "app/Http/Middleware/TrustProxies.php",
            "Trusted proxy list is overly broad",
            "Enumerate Cloudflare / LB egress IPs only",
          ],
          [
            "M3",
            "Medium",
            "public/.user.ini",
            "expose_php=On",
            "Set Off and verify hosting provider template",
          ],
          [
            "L1",
            "Low",
            "nginx (site config)",
            "No Content-Security-Policy",
            "Start with report-only CSP, tighten iteratively",
          ],
          [
            "L2",
            "Low",
            "README.md",
            "Sample .env lists real-looking bucket names",
            "Replace with obvious placeholders",
          ],
        ]}
      />

      <Divider />

      <H2>Production readiness</H2>
      <Table
        headers={["Check", "Status", "Notes"]}
        columnAlign={["left", "left", "left"]}
        rowTone={["warning", undefined, "warning", undefined, undefined]}
        rows={[
          ["APP_DEBUG=false in production", "Fail", "true in last Terraform preview; fix before apply."],
          ["Rate limit on auth endpoints", "Pass", "100 req / min / IP on /login and /token."],
          ["Backups outside primary account", "Fail", "Snapshots only in same AWS account; replicate offsite."],
          ["HTTPS enforced (HSTS)", "Pass", "max-age=31536000 on apex and api subdomains."],
          ["Error tracking with PII scrubbing", "Pass", "Sentry scrubbers for email and card fields."],
        ]}
      />

      <Divider />

      <H2>Recommendations</H2>
      <Stack gap={16}>
        <Stack gap={6}>
          <H3>Now (before any new deploy)</H3>
          <Text>
            Ship C1 immediately; rotate admin sessions and audit{" "}
            <Code>role_id</Code> changes in the last 90 days. Block deploys
            until <Code>APP_DEBUG</Code> is false in the prod plan.
          </Text>
        </Stack>
        <Stack gap={6}>
          <H3>This week</H3>
          <Text>
            Merge H1 and H2 patches; verify invoice policy tests in CI.
            Separate staging DNS and disable Telescope externally.
          </Text>
        </Stack>
        <Stack gap={6}>
          <H3>This quarter</H3>
          <Text>
            Upgrade path to Laravel 11, add global query scopes for
            multi-tenant models, and run a focused pen test on the webhook
            ingestion path.
          </Text>
        </Stack>
      </Stack>

      <Text tone="secondary" size="small">
        Demo report only — illustrative data for audit-canvas. Not a real
        engagement.
      </Text>
    </Stack>
  );
}
