#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import re

from bs4 import BeautifulSoup


SITE_DIR = Path("_site")


def _is_blank_text(tag) -> bool:
    # Treat icon-only links as blank even if they contain empty menu-text spans.
    text = " ".join(tag.stripped_strings).strip()
    return len(text) == 0


def _label_for_href(href: str) -> str | None:
    if re.search(r"^mailto:reeves@wustl\.edu", href, flags=re.I):
        return "Email Andrew Reeves"
    if re.search(r"linkedin\.com/in/areeves", href, flags=re.I):
        return "Andrew Reeves on LinkedIn"
    if re.search(r"scholar\.google\.com/citations", href, flags=re.I):
        return "Andrew Reeves on Google Scholar"
    return None


def patch_html(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    changed = False

    # Navbar icon links: ensure static accessible names.
    for link in soup.select("#quarto-header .navbar .nav-link[href]"):
        if not _is_blank_text(link):
            continue
        label = _label_for_href(link.get("href", ""))
        if not label:
            continue
        if not link.get("aria-label"):
            link["aria-label"] = label
            changed = True
        if not link.get("title"):
            link["title"] = label
            changed = True

    # Theme/search controls.
    for toggle in soup.select(".quarto-color-scheme-toggle"):
        if not toggle.get("aria-label"):
            toggle["aria-label"] = "Toggle color theme"
            changed = True
        if not toggle.get("title"):
            toggle["title"] = "Toggle color theme"
            changed = True

    search_root = soup.select_one("#quarto-search")
    if search_root is not None:
        if not search_root.get("aria-label"):
            search_root["aria-label"] = "Search site"
            changed = True
        if not search_root.get("title"):
            search_root["title"] = "Search"
            changed = True

    search_btn = soup.select_one("#quarto-search .aa-DetachedSearchButton")
    if search_btn is not None:
        if not search_btn.get("aria-label"):
            search_btn["aria-label"] = "Search site"
            changed = True
        if not search_btn.get("title"):
            search_btn["title"] = "Search"
            changed = True

    # Figure images: fill missing alt from figcaption.
    for figure in soup.find_all("figure"):
        figcaption = figure.find("figcaption")
        caption_text = figcaption.get_text(" ", strip=True) if figcaption else ""
        if not caption_text:
            continue
        for img in figure.find_all("img"):
            if not img.get("alt"):
                img["alt"] = caption_text
                changed = True

    # Research listing thumbnails: static alt from listing title.
    for post in soup.select("#listing-listing .quarto-post"):
        title_link = post.select_one(".listing-title a")
        title_text = title_link.get_text(" ", strip=True) if title_link else ""
        for img in post.select("img.thumbnail-image"):
            if img.get("alt"):
                continue
            img["alt"] = f"{title_text} thumbnail" if title_text else "Research publication thumbnail"
            changed = True

        # Some listing cards include image-only links; label them statically.
        for link in post.select("a[href]"):
            if not _is_blank_text(link):
                continue
            if not link.get("aria-label"):
                link["aria-label"] = title_text or "Research publication"
                changed = True
            if not link.get("title"):
                link["title"] = title_text or "Research publication"
                changed = True

    # Label empty pagination anchors if present.
    for link in soup.select("#listing-pagination a[href]"):
        if not _is_blank_text(link):
            continue
        if not link.get("aria-label"):
            link["aria-label"] = "Pagination link"
            changed = True
        if not link.get("title"):
            link["title"] = "Pagination link"
            changed = True

    if changed:
        path.write_text(str(soup), encoding="utf-8")
    return changed


def main() -> None:
    if not SITE_DIR.exists():
        return

    touched = 0
    for html_file in SITE_DIR.rglob("*.html"):
        if patch_html(html_file):
            touched += 1
    print(f"[post-render-a11y] patched {touched} HTML files")


if __name__ == "__main__":
    main()
