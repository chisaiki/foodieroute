
  // import "../styles/tailwindStyle.css"
  // import MapErrorView from "./MapError";
  import "../styles/tailwindStyle.css";
  import { useEffect, useRef, useState } from "react";
  import { Places } from "../../../types/types";


  interface MapViewProps {
    mapRef: React.RefObject<HTMLDivElement | null>;
  }

  export default function MapView({mapRef }: MapViewProps) {
    // const [error, setError] = useState<string | null>(null);
    
    // if (error) {
    //   return (
    //     <div className="text-red-500 text-center p-4 bg-gray-100">
    //       <h2>⚠️ Google Maps Error</h2>
    //       <p>{error}</p>
    //     </div>
    //   );
    // }

    return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
  }