
import "../styles/tailwindStyle.css"
import { useEffect, useRef, useState } from "react";
import { Place } from "../../../types/types";


type ListViewProps = {
  places: Place[];

};


export default function ListView({ 
  places }
  :ListViewProps )

{

  useEffect(() => {

  },[places])


  const renderPlaces = () => {
    if (places.length === 0) {
      return <p className="text-gray-500">No places found yet.</p>;
    }

    return places.map((place, index) => (
      <div
        key={index}
        className="border rounded-lg p-3 shadow hover:shadow-md transition"
      >
        <h3 className="text-lg font-semibold">
          {place.displayName?.text ?? "Unnamed Place"}
        </h3>
        <p className="text-sm text-gray-700">
           {place.formattedAddress ?? "Address not available"}
        </p>
        <p className="text-sm">
           {place.rating ?? "N/A"} | {" "}
          {place.priceLevel
            .replace("PRICE_LEVEL_", "")
            .toLowerCase()
            .replace("_", " ")}
        </p>
      </div>
    ));
  };

  return(
  <div>

    <div> Restaurant List Here</div>
    {renderPlaces()}

  </div>

);
}