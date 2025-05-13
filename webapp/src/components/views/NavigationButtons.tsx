// NavigationButtons – top bar with branding and page links

import { Link } from "react-router-dom";
import { AuthView } from "../../config/auth"; // Displays login/logout widget

import { useAuth } from "../../config/AuthUser";

export default function NavigationButtons() {
    const { userData } = useAuth();
    const isLoggedIn = !!userData?.uid;


    const historyNav = isLoggedIn ? (

        <Link to="/Settings" className="hover:text-indigo-600">History</Link>
    ) : (
        <div></div>
    );
    return (
        // Top header with logo on the left and links on the right
        <header className="h-14 w-full bg-white shadow flex items-center px-6 justify-between">

            {/* App name where clicking it goes to the home page */}
            <Link
                to="/"
                className="text-lg font-semibold text-indigo-600 whitespace-nowrap"
            >
                BiteRoute
            </Link>
            <nav className="flex items-center gap-8 text-sm font-medium">
                {historyNav}

                <AuthView />
            </nav>

        </header>
    );
}
