// "/blog/" is current on "/blog/" and on every article under it; "/" only on the home page.
export function isCurrentPage(pathname: string, href: string): boolean {
  const trim = (path: string) => path.replace(/\/+$/, "") || "/";
  const current = trim(pathname);
  const target = trim(href);
  return target === "/"
    ? current === "/"
    : current === target || current.startsWith(`${target}/`);
}

/** aria-current for a menu link: "page" on the page itself, "true" inside its section (an article under Blog) */
export function ariaCurrent(pathname: string, href: string): "page" | "true" | undefined {
  if (!isCurrentPage(pathname, href)) return undefined;
  const trim = (path: string) => path.replace(/\/+$/, "") || "/";
  return trim(pathname) === trim(href) ? "page" : "true";
}
