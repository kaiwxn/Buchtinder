import { BookCheck } from "lucide-react";

function Login() {
	return (
		<>
			<div className="mt-3 mx-4 mb-5">
				<div className="flex-none mr-4">
					<BookCheck size={36} />
				</div>
			</div>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-96">
					<h1 className="mt-10 text-[33px]/8 w-full">Dein nächstes Buch wartet schon.</h1>
					<p className="mt-3 text-2xl text-gray-600">Melde dich zuerst an.</p>
				</div>

				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<label className="input validator mt-6 w-full">
						<svg
							className="h-[1em] opacity-50"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<g
								strokeLinejoin="round"
								strokeLinecap="round"
								strokeWidth="2.5"
								fill="none"
								stroke="currentColor"
							>
								<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
								<circle cx="12" cy="7" r="4"></circle>
							</g>
						</svg>
						<input
							type="input"
							required
							placeholder="Username"
							pattern="[A-Za-z][A-Za-z0-9\-]*"
							minLength={3}
							maxlength="30"
							title="Only letters, numbers or dash"
							className="w-full"
						/>
					</label>
					
					<label className="input validator mt-6 w-full">
						<svg
							className="h-[1em] opacity-50"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<g
								strokeLinejoin="round"
								strokeLinecap="round"
								strokeWidth="2.5"
								fill="none"
								stroke="currentColor"
							>
								<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
								<circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
							</g>
						</svg>
						<input
							type="password"
							required
							placeholder="Password"
							minLength={8}
							pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
							title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
							className="w-full"
						/>
					</label>
					
					<div className="flex mt-6 w-full justify-between">
						<button className="btn w-45">Login</button>
						<button className="btn w-45 bg-blue-500 text-white">Registrieren</button>
					</div>
					<div className="flex mt-6 justify-center text-center mx-20">
						<p className="text-xs">Indem du fortfährst, erklärst du, dass du <span className="underline">diesen Bedingungen</span> zustimmst.</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
