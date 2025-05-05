import NavigationButtons from "./NavigationButtons";
import "../styles/tailwindStyle.css"
import { UserHistory } from "../../config/AuthUser";

// Intresting way I found out after asking chatgpt
interface SettingsViewProps {
  veg: boolean;
  toggleVeg: () => void; // Function to toggle veg status
  history: UserHistory[];
  onHistoryClick: (historyItem: UserHistory) => void;
}

export default function SettingsView({ veg, toggleVeg, history, onHistoryClick } : SettingsViewProps)
{

  function UserHistory() {
    if (history.length === 0) {
      return (
        <div>
          <h1 className="text-xl font-semibold mb-2">History</h1>
          <p className="text-gray-500">No search history yet.</p>
        </div>
      );
    } else {
      return (
        // <div></div>

        <div className="flex flex-col items-start justify-around w-full">
          <h1 className="text-xl font-semibold mb-2">History</h1>
          <div className="overflow-y-auto max-h-full w-full">
            {history.map((item: UserHistory, index: number) => (
              <div 
                key={index} 
                className="border p-2 rounded shadow-sm hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => onHistoryClick(item)}
              >
                <p className="text-sm font-medium">From: {item.origin_string}</p>
                <p className="text-sm font-medium">To: {item.destination_string}</p>
                <p className="text-xs text-gray-500">Mode: {item.travelMode}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  function UserSettings() {
    return (
      <div>          
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
    )
  }

  


  return(
  <div>
    <div className="temp-nav-bar">
        <NavigationButtons></NavigationButtons>
    </div>
      <div className="p-4">
        {/* <div className="flex flex-col items-start justify-between"> */}
        <div className="grid grid-cols-2 gap-4 w-full">
            <UserHistory />

            {/* The settings div */}
            <UserSettings />

        </div>
      </div>

    </div>

);
}