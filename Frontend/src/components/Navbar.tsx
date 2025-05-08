import { BookCheck, BookPlus, User } from "lucide-react";
import { Link } from "react-router";

function Navbar() {
	async function handleLogout() {
		sessionStorage.removeItem("token");
		location.reload(); // Reload page
	}

	const navLinks = [
		{ to: "/", label: "Start" },
		{ to: "/freunde", label: "Freunde" },
		{ to: "/buecher", label: "Bücher" },
	];

	return (
		<div className="navbar bg-base-100 drop-shadow">
			<div className="flex-none mr-4">
				<BookCheck size={36} />
			</div>

			{navLinks.map((link) => (
				<div key={link.to} className="flex-none p-3 text-xl font-medium">
					<Link
						className="hover:underline hover:underline-offset-4"
						to={link.to}
					>
						{link.label}
					</Link>
				</div>
			))}

			<div className="flex-1"></div>

			<button className="btn bg-blue-600 border-blue-600 text-white pl-2 pr-3 mr-3">
				<BookPlus />
				<p>Entdecken</p>
			</button>
			{/* <button className="btn btn-outline mr-3 " onClick={handleLogout}>
				<p>Abmelden</p>
			</button> */}

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
		</div>
	);
}

export default Navbar;
