import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const BACKUP_PROFILE_IMAGE_SRC =
    "https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg";

function UserDropdown() {
    const [showConfirm, setShowConfirm] = useState(false);

    const [avatar, setAvatar] = useState(BACKUP_PROFILE_IMAGE_SRC);

    useEffect(() => {
        const storedAvatar = localStorage.getItem("profile_avatar");
        if (storedAvatar) {
            setAvatar(storedAvatar);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        window.location.href = "/";
    };

    const handleConfirmLogout = () => {
        setShowConfirm(true);
    };

    const cancelLogout = () => {
        setShowConfirm(false);
    };

    const modal = (
        <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <div className="w-80 rounded-lg bg-white p-6 shadow-2xl">
                <h2 className="text-black-600 mb-4 text-center text-2xl font-bold">
                    Abmeldung bestätigen
                </h2>
                <p className="mb-4 text-center">
                    Möchtest du dich wirklich abmelden?
                </p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={cancelLogout}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        Nein, bleiben
                    </button>
                    <button
                        onClick={handleLogout}
                        className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                    >
                        Ja, abmelden
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="dropdown dropdown-end mr-3">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                >
                    <div className="w-10 rounded-full">
                        <img alt="User avatar" src={avatar} />
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu dropdown-content rounded-box mt-4 w-52 p-2 shadow-sm"
                >
                    <li>
                        <a href="/Profile">Profil</a>
                    </li>
                    <li>
                        <a href="/Settings">Einstellungen</a>
                    </li>
                    <li>
                        <button onClick={handleConfirmLogout}>Abmelden</button>
                    </li>
                </ul>
            </div>
            {showConfirm && ReactDOM.createPortal(modal, document.body)}
        </>
    );
}

export default UserDropdown;
