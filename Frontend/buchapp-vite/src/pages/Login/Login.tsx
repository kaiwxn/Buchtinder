import { useState } from "react";
import { BookCheck } from "lucide-react";
import PasswordInput from "./PasswordInput";
import UsernameInput from "./UsernameInput";

import { loginUser, registerUser } from "./requests";
import { useNavigate } from "react-router";

type LoginProps = {
	setToken: (token: string) => void;
};

function Login({ setToken }: LoginProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	async function handleLogin() {
		const token = "";
		setToken(token);

		const data = await loginUser(username, password);
		alert(data.message)
		
	}

	async function handleRegister() {
		const data = await registerUser(username, password);
		console.log(data);
	}

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
					<UsernameInput value={username} onChange={setUsername} />
					<PasswordInput value={password} onChange={setPassword} />

					<div className="flex mt-6 w-full justify-between">
						<button className="btn w-45" onClick={handleLogin}>
							Login
						</button>
						<button className="btn w-45 bg-blue-500 text-white" onClick={handleRegister}>
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