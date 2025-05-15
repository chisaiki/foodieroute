// ListView – shows a clickable list of places with optional extra details

import React, { useState, useEffect } from "react";
import { Place, PriceLevel } from "../../../types/types";

// Converts price level enums into readable dollar signs
const priceLevelMap: Record<PriceLevel, string> = {
  PRICE_LEVEL_FREE: "$0",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
  PRICE_LEVEL_UNSPECIFIED: "—",
};

type ListViewProps = {
  places?: Place[];
  selectedPlaceName?: string | null;
  onSelect?: (name: string | null) => void;
};

export default function ListView({
  places = [],
  selectedPlaceName,
  onSelect,
}: ListViewProps) {
  // If there are no results, show a helpful message
  if (!places.length) {
    return (
      <p className="text-center text-sm text-gray-500 py-2">
        No places found. Run a search 😎
      </p>
    );
  }

  // Lazy way to fix the layout on mobile
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderList = () => {
    return (
      <ul className="space-y-1 p-1">
      {places.map((p) => {
        // Fallback name if none provided
        const name = p.displayName?.text ?? "Unnamed place";

        // Check if this place is the one currently selected
        const isActive = name === selectedPlaceName;

        return (
          <li
            key={name}
            onClick={() => onSelect?.(isActive ? null : name)}
            className={`cursor-pointer rounded px-2 py-1
              ${isActive ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}
            `}
          >
            {/* Always show the place name */}
            {name}

            {/* Show more info if this item is selected */}
            {isActive && (
              <div className="mt-1 text-xs font-normal text-gray-700 space-y-0.5">
                {p.formattedAddress && <div>{p.formattedAddress}</div>}

                <div className="flex items-center gap-2">
                  {/* Show rating if available */}
                  {p.rating !== undefined && (
                    <span>
                      ⭐ {p.rating.toFixed(1)}
                      {p.userRatingCount
                        ? ` (${p.userRatingCount.toLocaleString()})`
                        : ""}
                    </span>
                  )}

                  {/* Show price level if available */}
                  {p.priceLevel && (
                    <span className="pl-2 border-l border-gray-300">
                      {priceLevelMap[p.priceLevel]}
                    </span>
                  )}
                </div>
              </div>
            )}
          </li>
        );
      })}
      </ul>
    )
  }

  // Mobile Layout
  if (windowWidth <= 800) {
    return ( 
      <div>{renderList()}</div>
      // {renderList()}
    )
  }

  // Desktop Layout
  return (
    <div className="overflow-auto max-h-[calc(100vh-90px)]">
      {renderList()}
    </div>

  );
}
