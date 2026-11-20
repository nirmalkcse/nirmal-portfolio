"use client";

import { type MouseEvent } from "react";

export function SkipToContentLink() {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("main-content");

    if (!target) {
      return;
    }

    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
    window.history.replaceState(null, "", "#main-content");
  };

  return (
    <a
      className="skip-to-content-link"
      href="#main-content"
      id="skip-to-content"
      onClick={handleClick}
    >
      Skip to main content
    </a>
  );
}
