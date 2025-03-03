import NavigationButtons from "./NavigationButtons";
import "../styles/tailwindStyle.css"

// Intresting way I found out after asking chatgpt
interface SettingsViewProps {
  veg: boolean;
  toggleVeg: () => void; // Function to toggle veg status
}

export default function SettingsView({ veg, toggleVeg }: SettingsViewProps)
{



  return(
  <div>
    <div className="temp-nav-bar">
        <NavigationButtons></NavigationButtons>
    </div>
    <div className="p-4">
        <h1>Settings</h1>
          <button
          onClick={toggleVeg}
          className={`px-4 py-2 rounded-md text-white ${
            veg ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          {veg ? "Vegetarian: YES" : "Vegetarian: NO"}
        </button>
      </div>

    

  </div>

);
}