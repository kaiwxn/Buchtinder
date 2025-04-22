import { Link } from "react-router";

function Navbar() {
	return (
		<>
			<div className="navbar bg-base-100 drop-shadow">
				<div className="flex-none">
					<button className="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="inline-block h-5 w-5 stroke-current"
						>
							{" "}
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>{" "}
						</svg>
					</button>
				</div>

				<div className="btn btn-ghost flex-none p-3">
					<Link to="/">Home</Link>
				</div>
				<div className="btn btn-ghost flex-none p-3">
					<Link to="/freunde">Freunde</Link>
				</div>
				<div className="btn btn-ghost flex-none p-3">
					<Link to="/buecher">Bücher</Link>
				</div>
                <div className="flex-1">

                </div>
                <div className="btn btn-outline mr-3 ">
                    <p> Abmelden </p>
                </div>
				<div className="dropdown dropdown-end flex-">
					<div
						tabIndex={0}
						role="button"
						className="btn btn-ghost btn-circle avatar"
					>
						<div className="w-10 rounded-full">
							<img
								alt="Tailwind CSS Navbar component"
								src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;
