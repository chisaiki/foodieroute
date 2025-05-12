// SearchBoxView – search form for origin, destination, place query, mode, and sort

import React from "react";
import "../styles/tailwindStyle.css";

// Main form component containing all search controls
export default function SearchBoxView(
  props: SearchBoxViewProps & { className?: string }
) {
  const { className = "" } = props;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.triggerSearch();
      }}
      // Responsive layout: 1 column on mobile, 3 columns on large screens
      className={`grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {/* Input for starting location */}
      <Input label="Origin" placeholder="Start…" ref={props.originRef} />

      {/* Input for destination */}
      <Input label="Destination" placeholder="End…" ref={props.destRef} />

      {/* Text input for keyword search (e.g. "pizza") */}
      <InputText
        label="Search"
        value={props.searchQuery}
        onChange={(v) => props.setSearchQuery(v)}
        placeholder="e.g. pizza"
      />

      {/* Dropdown for selecting travel mode */}
      <Select
        label="Travel"
        value={props.travelMode}
        onChange={(v) => props.setTravelMode(v as google.maps.TravelMode)}
        options={["DRIVING", "WALKING", "TRANSIT", "BICYCLING"]}
      />

      {/* Dropdown for selecting how to sort results */}
      <Select
        label="Sort by"
        value={props.sortMethod}
        onChange={(v) => props.setSortMethod(v as "Rating" | "Price" | "Count")}
        options={[
          ["Rating", "Rating"],
          ["Price", "Price lvl"],
          ["Count", "Reviews"],
        ]}
      />

      {/* Submit button (spans 2 columns on small screens) */}
      <button
        type="submit"
        className="sm:col-span-2 lg:col-span-1 h-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        Search
      </button>
    </form>
  );
}

// input component helps render a labeled input field using a forwarded ref (for origin/destination fields)
const Input = React.forwardRef<
  HTMLInputElement,
  { label: string; placeholder: string }
>((p, ref) => (
  <label className="text-xs font-medium space-y-1">
    {p.label}
    <input
      ref={ref}
      placeholder={p.placeholder}
      className="mt-1 w-full rounded border border-slate-300 p-2"
    />
  </label>
));

// InputText component helps to render a controlled input field that is used for search query input
function InputText({ label, value, onChange, placeholder }: any) {
  return (
    <label className="text-xs font-medium space-y-1">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded border border-slate-300 p-2"
      />
    </label>
  );
}

// Select component renders a labeled dropdown with either string or [value, label] pairs
function Select({ label, value, onChange, options }: any) {
  return (
    <label className="text-xs font-medium space-y-1">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-slate-300 p-2"
      >
        {options.map((o: any) =>
          Array.isArray(o) ? (
            <option key={o[0]} value={o[0]}>
              {o[1]}
            </option>
          ) : (
            <option key={o} value={o}>
              {o}
            </option>
          )
        )}
      </select>
    </label>
  );
}