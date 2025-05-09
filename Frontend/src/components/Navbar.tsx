import { useState } from "react";
import { BookCheck, BookPlus } from "lucide-react";
import { Link } from "react-router";
import UserDropdown from "./UserDropdown";
import BookSearchModal from "./BookSearchModal";

function Navbar() {
    const [showBookSearch, setShowBookSearch] = useState(false);

    const toggleShowBookSearch = () => setShowBookSearch((prev) => !prev);

    const navLinks = [
        { to: "/", label: "Start" },
        { to: "/freunde", label: "Freunde" },
        { to: "/buecher", label: "Bücher" },
    ];

    return (
        <>
            <nav className="navbar bg-base-100 drop-shadow w-full">
                <div className="mr-4 flex-none">
                    <BookCheck size={36} />
                </div>

                {navLinks.map((link) => (
                    <div
                        key={link.to}
                        className="flex-none p-3 text-xl font-medium"
                    >
                        <Link
                            className="hover:underline hover:underline-offset-4"
                            to={link.to}
                        >
                            {link.label}
                        </Link>
                    </div>
                ))}

                <div className="flex-1"></div>

                <button
                    className="btn mr-3 border-blue-600 bg-blue-600 pr-3 pl-2 text-white"
                    onClick={toggleShowBookSearch}
                >
                    <BookPlus />
                    <p>Entdecken</p>
                </button>
                <UserDropdown />
            </nav>
            {showBookSearch && (
                <BookSearchModal onClose={toggleShowBookSearch} />
            )}
        </>
    );
}

export default Navbar;
