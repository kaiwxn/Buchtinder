import { BookCheck } from "lucide-react";
import PasswordInput from "./PasswordInput";
import UsernameInput from "./UsernameInput";

type LoginProps = {
	setToken: (token: string) => void;
};

function Login({ setToken }: LoginProps) { 

	async function handleLogin() {
		const token = "yourUserToken";
		setToken(token); // This updates App state and sessionStorage
	};

	return (
		<>
			<div className="mt-3 mx-4 mb-5">
				<div className="flex-none mr-4">
					<BookCheck size={36} />
				</div>
			</div>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-96">
					<h1 className="mt-10 text-[33px]/8 w-full">
						Dein nächstes Buch wartet schon.
					</h1>
					<p className="mt-3 text-2xl text-gray-600">Melde dich zuerst an.</p>
				</div>

				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<UsernameInput />

					<PasswordInput />

					<div className="flex mt-6 w-full justify-between">
						<button className="btn w-45" onClick={handleLogin}>
							Login
						</button>
						<button className="btn w-45 bg-blue-500 text-white">
							Registrieren
						</button>
					</div>
					<div className="flex mt-6 justify-center text-center mx-20">
						<p className="text-xs">
							Indem du fortfährst, erklärst du, dass du{" "}
							<span className="underline">diesen Bedingungen</span> zustimmst.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
