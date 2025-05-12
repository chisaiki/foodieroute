// NavigationButtons – top bar with branding and page links

import { Link } from "react-router-dom";
import { AuthView } from "../../config/auth"; // Displays login/logout widget

export default function NavigationButtons() {
    return (
        // Top header with logo on the left and links on the right
        <header className="h-14 w-full bg-white shadow flex items-center px-6 justify-between">

            {/* App name where clicking it goes to the home page */}
            <Link
                to="/"
                className="text-lg font-semibold text-indigo-600 whitespace-nowrap"
            >
                FoodRoute
            </Link>

            {/* Navigation links aligned to the right */}
            <nav className="flex items-center gap-8 text-sm font-medium">
                <Link to="/" className="hover:text-indigo-600">Home</Link>
                <Link to="/Settings" className="hover:text-indigo-600">Settings</Link>
                <Link
                    to="/banana"
                    className="hover:text-indigo-600 flex items-center gap-1"
                >
                    Bananas <span>🍌</span>
                </Link>

                {/* User account section that shows login/logout */}
                <AuthView />
            </nav>
        </header>
    );
}
