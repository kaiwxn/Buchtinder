import { useState } from "react";
import { BookCheck } from "lucide-react";
import PasswordInput from "./PasswordInput";
import UsernameInput from "./UsernameInput";
import { login, register } from "./requests";

type LoginProps = {
	setToken: (token: string) => void;
};

function Login({ setToken }: LoginProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleLogin() {
		setLoading(true);
		try {
			const data = await login(username, password);
			setToken("irgendwas"); // TODO: change token
		} catch (error: any) {
			console.error("Fehler bei Login:", error);
			alert(
				error.message ||
					"Verbindungsfehler. Bitte versuche es später noch einmal."
			);
		} finally {
			setLoading(false);
		}
	}

	async function handleRegister() {
		setLoading(true);
		try {
			const data = await register(username, password);
			setToken("irgendwas");
		} catch (error: any) {
			console.error("Fehler bei Registrierung:", error);
			alert(
				error.message ||
					"Verbindungsfehler. Bitte versuche es später noch einmal."
			);
		} finally {
			setLoading(false);
		}
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
						<button
							className="btn w-45"
							onClick={handleLogin}
							disabled={loading}
						>
							Login
						</button>
						<button
							className="btn w-45 bg-blue-500 text-white"
							onClick={handleRegister}
							disabled={loading}
						>
							Registrieren
						</button>
					</div>
					<div className="flex mt-6 justify-center text-center mx-20">
						<a className="text-xs">
							Indem du fortfährst, erklärst du, dass du{" "}
							<a
								className="underline"
								href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
								target="_blank"
							>
								diesen Bedingungen
							</a>{" "}
							zustimmst.
						</a>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
