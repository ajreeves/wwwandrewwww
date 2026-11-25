export const contentAnchor = (kind: string, title: string) =>
  `${kind}-${title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

export const eventAnchor = (watchUrl: string) => `event-${new URL(watchUrl).searchParams.get("v")}`;
