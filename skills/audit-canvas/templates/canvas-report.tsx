// Cursor canvas template for audit-canvas reports.
//
// HOW TO USE
// ----------
// 1. Copy this file to ~/.cursor/projects/<workspace>/canvases/<repo>-security-audit.canvas.tsx
//    (this is the only path Cursor's canvas server picks up).
// 2. Replace every "REPLACE:" placeholder with real content from the audit.
// 3. Drop sections that have no findings — never render empty cards.
// 4. Only import from "cursor/canvas". Do not add npm packages or relative imports.
// 5. Do not use gradients, emojis, or box-shadows. Flat surfaces only.

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

export default function SecurityAuditCanvas() {
  return (
    <Stack gap={24}>
      {/* HEADER ------------------------------------------------------------ */}
      <Stack gap={8}>
        <H1>Security audit — REPLACE: repo name</H1>
        <Text tone="secondary">
          REPLACE: one-paragraph scope description. Mention stack, languages,
          frameworks, and what was covered (routes, controllers, file uploads,
          dependencies, deployment).
        </Text>
      </Stack>

      {/* SEVERITY COUNTS --------------------------------------------------- */}
      <Grid columns={5} gap={12}>
        <Stat value="REPLACE" label="Critical" tone="danger" />
        <Stat value="REPLACE" label="High" tone="warning" />
        <Stat value="REPLACE" label="Medium" tone="info" />
        <Stat value="REPLACE" label="Low" />
        <Stat value="REPLACE" label="Total findings" />
      </Grid>

      {/* DEPLOY VERDICT ---------------------------------------------------- */}
      <Callout tone="danger" title="Deploy verdict">
        REPLACE: 2-3 sentences explaining the top-line risk and whether the
        project is safe to deploy. Be specific. Name the worst finding.
      </Callout>

      <Divider />

      {/* STACK MATURITY ---------------------------------------------------- */}
      <H2>Stack maturity</H2>
      <Table
        headers={["Component", "Version", "Status", "Notes"]}
        columnAlign={["left", "left", "left", "left"]}
        rowTone={[
          "danger" /* REPLACE per row, undefined when no concern */,
        ]}
        rows={[
          [
            "REPLACE: e.g. PHP",
            "REPLACE: e.g. ^7.3",
            "REPLACE: e.g. EOL since 2021-12",
            "REPLACE: actionable note",
          ],
        ]}
      />

      <Divider />

      {/* CRITICAL FINDINGS ------------------------------------------------- */}
      <H2>Critical findings</H2>

      <Card>
        <CardHeader trailing={<Pill tone="deleted" active size="sm">CRITICAL</Pill>}>
          C1 · REPLACE: short title naming the vulnerability
        </CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              <Code>REPLACE: path/to/file.ext:LINE</Code> — REPLACE: explain
              what the vulnerability is in plain language.
            </Text>

            <H3>Impact</H3>
            <Text>
              REPLACE: what an attacker can do, end-to-end. Be concrete: "any
              authenticated user can promote themselves to admin and access the
              whole platform".
            </Text>

            <H3>Reproduction</H3>
            <Code block>
              {`# REPLACE: copy-pasteable PoC. Curl, payload, or step list.
# Use SAFE PoCs only (SELECT version(), not DROP TABLE).
curl -X POST https://target.example/api/profile \\
  -H "Cookie: session=..." \\
  -d "name=alice&role_id=1"`}
            </Code>

            <H3>Before / after</H3>
            <Code block>
              {`// Before
public function update(Request $r) {
    auth()->user()->update($r->all());
}

// After
public function update(ProfileUpdateRequest $r) {
    auth()->user()->update($r->validated());
}`}
            </Code>

            <Text tone="secondary">
              Patch: <Code>audit-canvas/patches/C1-mass-assignment.patch</Code>
            </Text>
          </Stack>
        </CardBody>
      </Card>

      {/* Repeat the Card pattern for C2, C3, ... Drop the section if no Critical. */}

      <Divider />

      {/* HIGH FINDINGS ----------------------------------------------------- */}
      <H2>High findings</H2>

      <Card>
        <CardHeader trailing={<Pill tone="warning" active size="sm">HIGH</Pill>}>
          H1 · REPLACE
        </CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              <Code>REPLACE:path:LINE</Code> — REPLACE: description.
            </Text>
            <H3>Impact</H3>
            <Text>REPLACE</Text>
            <H3>Fix</H3>
            <Text>REPLACE: short remediation. Reference patch file.</Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      {/* MEDIUM / LOW (compact) -------------------------------------------- */}
      <H2>Medium and low findings</H2>
      <Table
        headers={["Id", "Severity", "Location", "Issue", "Fix"]}
        columnAlign={["left", "left", "left", "left", "left"]}
        rows={[
          [
            "REPLACE: M1",
            "Medium",
            "REPLACE:path:LINE",
            "REPLACE: short issue",
            "REPLACE: short fix",
          ],
        ]}
      />

      <Divider />

      {/* PRODUCTION READINESS --------------------------------------------- */}
      <H2>Production readiness</H2>
      <Table
        headers={["Check", "Status", "Notes"]}
        columnAlign={["left", "left", "left"]}
        rows={[
          ["APP_DEBUG=false in production", "REPLACE: pass / fail", "REPLACE"],
          ["Rate limit on auth endpoints", "REPLACE", "REPLACE"],
          ["Backups outside primary account", "REPLACE", "REPLACE"],
          ["HTTPS enforced (HSTS)", "REPLACE", "REPLACE"],
          ["Error tracking with PII scrubbing", "REPLACE", "REPLACE"],
        ]}
      />

      <Divider />

      {/* RECOMMENDATIONS --------------------------------------------------- */}
      <H2>Recommendations</H2>
      <Stack gap={12}>
        <Card>
          <CardHeader>Now (before any new deploy)</CardHeader>
          <CardBody>
            <Text>REPLACE: bullet list of Critical fixes.</Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>This week</CardHeader>
          <CardBody>
            <Text>REPLACE: High fixes.</Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>This quarter</CardHeader>
          <CardBody>
            <Text>REPLACE: structural items (framework upgrade, MFA, etc.)</Text>
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
