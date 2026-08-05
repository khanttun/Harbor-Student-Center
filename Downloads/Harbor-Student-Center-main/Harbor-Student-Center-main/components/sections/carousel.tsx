import { useMemo } from "react";

export function MemoryCarousel() {
  const allMemories = useMemo(() => {
    return Object.entries(memoriesByYear).flatMap(([year, items]) =>
      items.map((item) => ({ ...item, year }))
    );
  }, []);

const loopedMemories = [...allMemories, ...allMemories];

  return (
    <div>
      {/* use allMemories here */}
    </div>
  );
}