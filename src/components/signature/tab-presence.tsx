"use client";

import { useEffect } from "react";

const AWAY_TITLE = "Still resolving… — Nirmal Kumar";
const BACK_TITLE = "Welcome back — Nirmal Kumar";

let signed = false;

/**
 * Two small courtesies. The tab title notices when the visitor leaves and
 * greets them on return, then hands back the page's own title. And anyone who
 * opens devtools finds a signed note instead of an empty console.
 */
export function TabPresence() {
  useEffect(() => {
    if (!signed) {
      signed = true;
      console.log(
        "%cNirmal Kumar%c\nData engineer — Fabric, Databricks, entity resolution.\nYou read consoles; we should talk → https://www.linkedin.com/in/nirmalkumar6/",
        "font: 300 28px/1.1 Georgia, serif; color: #9a5637; letter-spacing: -0.02em;",
        "font: 12px/1.6 ui-monospace, monospace; color: #74685a;"
      );
    }

    let ownTitle = document.title;
    let restore: number | undefined;

    const onVisibility = () => {
      window.clearTimeout(restore);

      if (document.hidden) {
        ownTitle = document.title === BACK_TITLE ? ownTitle : document.title;
        document.title = AWAY_TITLE;
        return;
      }

      if (document.title === AWAY_TITLE) {
        document.title = BACK_TITLE;
        restore = window.setTimeout(() => {
          if (document.title === BACK_TITLE) {
            document.title = ownTitle;
          }
        }, 1800);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(restore);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
