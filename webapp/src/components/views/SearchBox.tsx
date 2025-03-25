
import "../styles/tailwindStyle.css"

type SearchBoxViewProps = {
  origin: { lat: number; lng: number };
  setOrigin: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
};

export default function SearchBoxView({ origin, setOrigin }: SearchBoxViewProps) {

  // Error handling
  if (!origin) return <div>Loading origin...</div>;

  const handleOriginChange = (coord: "lat" | "lng", value: number) => {
    setOrigin((prev) => ({ ...prev, [coord]: value }));
  };

  return (
    <div>
      <div>Search Settings here...</div>
      <p>Origin:</p>
      <br/>
      {/* <p>Lat: {origin.lat}</p>
      <p>Lng: {origin.lng}</p> */}
      <div>
      <div>Lat</div>
      <input
        style={{ backgroundColor: 'lightgreen' }}
        type="number"
        value={origin.lat}
        onChange={(e) => handleOriginChange("lat", parseFloat(e.target.value))}
      />
      </div>
      <div>
        <div>long</div>
        <input
        style={{ backgroundColor: 'lightgreen' }}
        type="number"
        value={origin.lng}
        onChange={(e) => handleOriginChange("lng", parseFloat(e.target.value))}
      />
      </div>




      <button> "Search here (not active yet)" </button>
    </div>
  );
}