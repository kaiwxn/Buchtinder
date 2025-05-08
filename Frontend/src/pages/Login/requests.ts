

export async function login(name: string, password: string) {
	const response = await fetch("http://127.0.0.1:5000/users/login", { 
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify({ name, password }),
	});
  
	if (!response.ok) {
	  const errorData = await response.json();
	  throw new Error(errorData.message || "Ein unbekannter Fehler ist aufgetreten.");
	}
  
	const data = await response.json();
	return data;
  }
  
  export async function register(name: string, password: string) {
	const response = await fetch("http://127.0.0.1:5000/users/register", {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify({ name, password }),
	});
  
	if (!response.ok) {
	  const errorData = await response.json();
	  throw new Error(errorData.message || "Ein unbekannter Fehler ist aufgetreten.");
	}
  
	const data = await response.json();
	return data;
  }