// Indexing and analytics describe the deployment, not the appointment date.
export const resolveSiteEnvironment = (context = "local") => ({
  noIndex: context !== "production",
  analyticsEnabled: context === "production"
});

export const siteEnvironment = resolveSiteEnvironment(process.env.CONTEXT);
