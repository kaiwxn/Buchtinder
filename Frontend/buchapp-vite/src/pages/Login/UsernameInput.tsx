import { User } from "lucide-react";

function UsernameInput() {
	return (
		<label className="input validator mt-6 w-full">
			<User color="#6a7282" size={15} />

			<input
				type="input"
				required
				placeholder="Username"
				pattern="[A-Za-z][A-Za-z0-9\-]*"
				minLength={3}
				maxLength={30}
				title="Username input field"
				className="w-full"
			/>
		</label>
	);
}

export default UsernameInput;
