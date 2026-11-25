export const currentAcademicTitle = "Professor of Political Science";
export const endowedChairTitle = "Edward Mallinckrodt Distinguished University Professor";

// Midnight on January 1 in America/Chicago (CST), expressed with an explicit offset.
export const chairEffectiveAt = "2027-01-01T00:00:00-06:00";

export function resolveAcademicAppointment({
  now = Date.now(),
  context = "production",
  preview = false
}: { now?: number; context?: string; preview?: boolean } = {}) {
  const effective = now >= Date.parse(chairEffectiveAt);
  const previewAllowed = context !== "production" &&
    (context === "deploy-preview" || context === "branch-deploy" || preview);
  const showChair = effective || previewAllowed;
  const title = showChair ? endowedChairTitle : currentAcademicTitle;

  return {
    title,
    biographyRole: showChair ? `the ${title}` : title,
    descriptionTitle: showChair ? title : title.toLowerCase(),
    isEarlyPreview: previewAllowed && !effective
  };
}

export const academicAppointment = resolveAcademicAppointment({
  context: process.env.CONTEXT || "local",
  preview: process.env.CHAIR_TITLE_PREVIEW === "true"
});
