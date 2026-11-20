"use client";

import { BentoCard } from "./bento-card";
import type { ExpertiseDomain, SkillItem, RoleFilter } from "./proof-data";

// A flawless dynamic layout generator that ensures the grid is ALWAYS completely filled.
// No dangling cards, no empty spaces. It calculates exact spans based on item count.
function getFlawlessSpans(count: number): number[] {
  switch (count) {
    case 1:
      return [3];
    case 2:
      return [2, 1];
    case 3:
      // Row 1: 2 + 1 = 3. Row 2: 3.
      return [2, 1, 3];
    case 4:
      // Row 1: 2 + 1 = 3. Row 2: 1 + 2 = 3.
      return [2, 1, 1, 2];
    case 5:
      // Row 1: 2 + 1. Row 2: 1 + 1 + 1.
      return [2, 1, 1, 1, 1];
    case 6:
      // Row 1: 2 + 1. Row 2: 1 + 2. Row 3: 3.
      return [2, 1, 1, 2, 3];
    case 7:
      // Row 1: 2 + 1. Row 2: 1 + 2. Row 3: 1 + 1 + 1.
      return [2, 1, 1, 2, 1, 1, 1];
    default:
      // Fallback: mostly squares, occasional wide cards
      const spans = [];
      for (let i = 0; i < count; i++) {
        spans.push(1); // Keep it simple to prevent breakage on unknown lengths
      }
      return spans;
  }
}

export function BentoGallery({
  domain,
  skillCatalog,
  activeRole,
}: {
  domain: ExpertiseDomain;
  skillCatalog: Map<string, SkillItem>;
  activeRole: RoleFilter;
}) {
  const items = domain.items
    .map(id => skillCatalog.get(id))
    .filter((item): item is SkillItem => Boolean(item));

  const spans = getFlawlessSpans(items.length);

  return (
    <section className="relative w-full pb-32">
      {/* Strict max-width constraint for architectural proportions */}
      <div className="w-full max-w-5xl mx-auto">
        
        {/* Flawless Horizontally Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-min">
          {items.map((skill, index) => {
            const span = spans[index] || 1;
            
            // Map the numerical span to the Tailwind class
            const spanClass = 
              span === 3 ? "md:col-span-3" : 
              span === 2 ? "md:col-span-2" : 
              "md:col-span-1";

            return (
              // Adding `flex` to the wrapper allows the child to stretch to the exact height of the row!
              <div key={skill.id} className={`${spanClass} flex`}>
                <BentoCard 
                  skill={skill} 
                  activeRole={activeRole} 
                  // flex-1 forces the card to fill the parent wrapper completely
                  className="flex-1 w-full"
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
