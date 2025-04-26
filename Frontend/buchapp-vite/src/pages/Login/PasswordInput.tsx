import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";

type Props = {
	value: string;
	onChange: (val: string) => void;
};

function PasswordInput({ value, onChange }: Props) {
	const [hidden, setHidden] = useState(true);

	return (
		<label className="input validator input-accent mt-6 w-full">
			<KeyRound color="#6a7282" size={15} />
			<div className="relative w-full">
				<input
					type={hidden ? "password" : "text"}
					required
					placeholder="Passwort"
					minLength={6}
					maxLength={30}
					value={value}
					pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,30}$" // 6-30 chars, must include at least one letter, number and special character
					onChange={(e) => onChange(e.target.value)}
					className="w-full pr-10"
				/>
				<button
					type="button"
					onClick={() => setHidden(!hidden)}
					className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
				>
					{hidden ? (
						<Eye color="#6a7282" size={20} />
					) : (
						<EyeOff color="#6a7282" size={20} />
					)}
				</button>
			</div>
		</label>
	);
}

export default PasswordInput;
