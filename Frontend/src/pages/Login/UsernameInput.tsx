import { User } from "lucide-react";

type Props = {
    value: string;
    onChange: (val: string) => void;
    handleLogin: () => void;
};

function UsernameInput({ value, onChange, handleLogin }: Props) {
    return (
        <label className="input validator input-ghost mt-6 w-full border-gray-300">
            <User color="#6a7282" size={15} />

            <input
                type="input"
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength={3}
                maxLength={30}
                title="Username input field"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                }}
            />
        </label>
    );
}

export default UsernameInput;
