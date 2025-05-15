function UserDropdown() {
    async function handleLogout() {
        sessionStorage.removeItem("token");
        location.reload();
    }

    return (
        <div className="dropdown dropdown-end mr-3">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
            >
                <div className="w-10 rounded-full">
                    <img
                        alt="User avatar"
                        src="https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                    />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu dropdown-content rounded-box mt-4 w-52 p-2 shadow-sm"
            >
                <li>
                    <a>Profil</a>
                </li>
                <li>
                    <a>Einstellungen</a>
                </li>
                <li>
                    <a onClick={handleLogout}>Abmelden</a>
                </li>
            </ul>
        </div>
    );
}

export default UserDropdown;
