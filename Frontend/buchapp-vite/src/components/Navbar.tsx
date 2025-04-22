import { BookCheck } from "lucide-react";
import { Link } from "react-router";

function Navbar() {
	return (
		<>
			<div className="navbar bg-base-100 drop-shadow">
				<div className="flex-none">
                    <BookCheck size={36}/>
				</div>

				<div className="btn btn-ghost flex-none p-3 text-xl">
					<Link to="/">Start</Link>
				</div>
				<div className="btn btn-ghost flex-none p-3 text-xl">
					<Link to="/freunde">Freunde</Link>
				</div>
				<div className="btn btn-ghost flex-none p-3 text-xl">
					<Link to="/buecher">Bücher</Link>
				</div>
                <div className="flex-1">

                </div>
                <div className="btn btn-outline mr-3 ">
                    <p> Abmelden </p>
                </div>
				<div className="dropdown dropdown-end mr-3">
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
