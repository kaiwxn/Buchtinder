import { useState } from "react";
import { BookCheck } from "lucide-react";
import PasswordInput from "./PasswordInput";
import UsernameInput from "./UsernameInput";
import { login, register } from "./requests";

type LoginProps = {
    setToken: (token: string) => void;
};

export let USER_ID = 1;

function Login({ setToken }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        try {
            const data = await login(username, password);
            USER_ID = data.user_id;
            setToken("irgendwas"); // TODO: change token
        } catch (error: any) {
            console.error("Fehler bei Login:", error);
            alert(
                error.message ||
                    "Verbindungsfehler. Bitte versuche es später noch einmal.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister() {
        setLoading(true);
        try {
            const data = await register(username, password);
            USER_ID = data.user_id; 
            setToken("irgendwas");
        } catch (error: any) {
            console.error("Fehler bei Registrierung:", error);
            alert(
                error.message ||
                    "Verbindungsfehler. Bitte versuche es später noch einmal.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="mx-4 mt-3 mb-5">
                <div className="mr-4 flex-none">
                    <BookCheck size={36} />
                </div>
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-96">
                    <h1 className="mt-10 w-full text-[33px]/8">
                        Dein nächstes Buch wartet schon.
                    </h1>
                    <p className="mt-3 text-2xl text-gray-600">
                        Melde dich zuerst an.
                    </p>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <UsernameInput
                        value={username}
                        onChange={setUsername}
                        handleLogin={handleLogin}
                    />
                    <PasswordInput
                        value={password}
                        onChange={setPassword}
                        handleLogin={handleLogin}
                    />

                    <div className="mt-6 flex w-full justify-between">
                        <button
                            className="btn w-45"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            Login
                        </button>
                        <button
                            className="btn w-45 border-0 bg-blue-500 text-white"
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            Registrieren
                        </button>
                    </div>
                    <div className="mx-20 mt-6 flex justify-center text-center">
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
