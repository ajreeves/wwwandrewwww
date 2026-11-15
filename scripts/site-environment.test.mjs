import assert from "node:assert/strict";
import test from "node:test";
import { resolveSiteEnvironment } from "../src/data/site-environment.ts";
import { chairEffectiveAt, resolveAcademicAppointment } from "../src/data/academic-appointment.ts";

test("previews stay unindexed and untracked before, at, and after the appointment date", () => {
  const release = Date.parse(chairEffectiveAt);
  for (const context of ["deploy-preview", "branch-deploy", "local"]) {
    for (const now of [release - 1, release, release + 86_400_000]) {
      resolveAcademicAppointment({ now, context, preview: true });
      assert.deepEqual(resolveSiteEnvironment(context), { noIndex: true, analyticsEnabled: false });
    }
  }
});

test("only an explicit production context permits indexing and analytics", () => {
  assert.deepEqual(resolveSiteEnvironment("production"), { noIndex: false, analyticsEnabled: true });
  for (const context of [undefined, "", "development", "unknown"]) {
    assert.deepEqual(resolveSiteEnvironment(context), { noIndex: true, analyticsEnabled: false });
  }
});
