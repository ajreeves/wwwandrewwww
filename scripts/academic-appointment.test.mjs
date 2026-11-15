import assert from "node:assert/strict";
import test from "node:test";
import {
  chairEffectiveAt,
  currentAcademicTitle,
  endowedChairTitle,
  resolveAcademicAppointment
} from "../src/data/academic-appointment.ts";

const release = Date.parse(chairEffectiveAt);

test("production retains the current title until midnight Chicago time", () => {
  assert.equal(release, Date.parse("2027-01-01T06:00:00Z"));
  for (const now of [Date.parse("2026-11-15T12:00:00Z"), release - 1]) {
    const appointment = resolveAcademicAppointment({ now, context: "production", preview: true });
    assert.equal(appointment.title, currentAcademicTitle);
    assert.equal(appointment.biographyRole, currentAcademicTitle);
    assert.equal(appointment.isEarlyPreview, false);
  }
});

test("production uses the endowed chair title at and after the effective date", () => {
  for (const now of [release, release + 86_400_000]) {
    const appointment = resolveAcademicAppointment({ now, context: "production" });
    assert.equal(appointment.title, endowedChairTitle);
    assert.equal(appointment.biographyRole, `the ${endowedChairTitle}`);
    assert.equal(appointment.isEarlyPreview, false);
  }
});

test("Netlify previews show the future title and are marked as previews", () => {
  for (const context of ["deploy-preview", "branch-deploy"]) {
    const appointment = resolveAcademicAppointment({ now: release - 1, context });
    assert.equal(appointment.title, endowedChairTitle);
    assert.equal(appointment.isEarlyPreview, true);
  }
});

test("local builds require an explicit preview opt-in before the release", () => {
  assert.equal(resolveAcademicAppointment({ now: release - 1, context: "local" }).title, currentAcademicTitle);
  const preview = resolveAcademicAppointment({ now: release - 1, context: "local", preview: true });
  assert.equal(preview.title, endowedChairTitle);
  assert.equal(preview.isEarlyPreview, true);
});
