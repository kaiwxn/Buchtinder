export async function registerUser(username: string, password: string) {
	const response = await fetch("http://127.0.0.1:5000/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: username, password: password }),
	});

	const data = await response.json();
	return data;
}

export async function loginUser(username: string, password: string) {
	try {
		const response = await fetch("http://127.0.0.1:5000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: username,
				password: password,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;

	} catch (error) {
		console.error("Failed to fetch:", error);
		throw error;
	}
}