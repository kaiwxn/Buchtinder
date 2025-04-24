import { BookCheck } from "lucide-react";
import { Link } from "react-router";

	
function Navbar() {
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
					<Link className="hover:underline hover:underline-offset-4" to={link.to}>
						{link.label}
					</Link>
				</div>
			))}

			<div className="flex-1"></div>

			<div className="btn btn-outline mr-3">
				<p>Abmelden</p>
			</div>

			<div className="dropdown dropdown-end mr-3">
				<div
					tabIndex={0}
					role="button"
					className="btn btn-ghost btn-circle avatar"
				>
					<div className="w-10 rounded-full">
						<img
							alt="User avatar"
							src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
