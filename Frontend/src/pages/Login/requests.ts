
// API call functions for login process
async function postRequest(url: string, body: object) {
	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Ein unbekannter Fehler ist aufgetreten.");
	}

	return data;
}

export const login = (name: string, password: string) =>
	postRequest("http://127.0.0.1:5000/users/login", { name, password });

export const register = (name: string, password: string) =>
	postRequest("http://127.0.0.1:5000/users/register", { name, password });