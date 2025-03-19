import HabitTracker from "../pages/habit-tracker";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token: null,
			user: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			notes: [],
			//estado julia 
			emotions: {
				currentEmotion: "neutral",
				counts: {
					happy: 0,
					love: 0,
					neutral: 0,
					mad: 0,
					sad: 0
				},

				lastDate:
					new Date().toDateString()
			},

			//maldit pomodoro estado:
			pomodoroTime: 1500, // 25 min en segundos
			started: false,
			completedCycles: Number(localStorage.getItem("cycles")) || 0,

			//estado compañero
			habitTracker: [],
			




		},
		actions: {

			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},


			login: async (email, password) => {

				//console.log(email, password);
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"email": email,
					"password": password
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw
				};

				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/login", requestOptions);
					const result = await response.json();
					console.log(response);

					console.log(result)

					if (!response.ok) {
						console.error("Error en el inicio de sesión:", result.message || "Respuesta no válida");
						return false
					}
					if (!result.access_token) {
						console.error("No se recibió un token válido:", result);
						return false;
					}
					// Guardar el token solo si el backend lo envió manejo de errores
					if (result.access_token) {
						localStorage.setItem("token", result.access_token)
						// Guarda el email del usuario autenticado
						localStorage.setItem("userEmail", email); // añadidonuevo
						setStore({ auth: true })

						console.log("Usuario autenticado correctamente");

						return true;
					}
				} catch (error) {
					console.error("Error durante el inicio de sesión:", error);
					return false;
				}
			},



			register: async (name, email, gender, password) => {
				console.log(name, email, gender, password);

				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"name": name,
					"email": email,
					"gender": gender,
					"password": password
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/register", requestOptions);
					const result = await response.json();
					console.log(result)
					// Guardar el token solo si el backend lo envió
					if (result.access_token) {
						localStorage.setItem("token", result.access_token);
						localStorage.setItem("userEmail", email);
						return true
					} else {
						console.warn("El servidor no devolvió un token.");
					}

					return false;

				} catch (error) {
					console.error(error);
				};
			},

			verifyToken: async () => {

				let token = localStorage.getItem("token")
				const myHeaders = new Headers();
				myHeaders.append("Authorization", `Bearer ${token}`);

				const requestOptions = {
					method: "GET",
					headers: myHeaders,
					redirect: "follow"
				};

				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/verify-token", requestOptions);
					const result = await response.json();
					//console.log(result)
					if (response.status !== 200) {
						setStore({ auth: result.valid })
					}
					setStore({ auth: result.valid })
				} catch (error) {
					console.error(error);
				};
			},

			notes: async () => {
				let token = localStorage.getItem("token")
				try {
					const requestOptions = {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`
						}
					};

					const response = await fetch(process.env.BACKEND_URL + "/api/notes", requestOptions);
					const result = await response.json();
					console.log(response);

					console.log(result)
					//setStore({ message: data.message })
				} catch (error) {
					console.error(error);
				};

			},







			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			//pomodoro: guardar ciclo completado
			addCompletedCycle: () => {
				const store = getStore();
				const newCycle = store.completedCycles + 1;
				setStore({ completedCycles: newCycle });
				localStorage.setItem("cycles", newCycle);
				console.log("Nuevo ciclo guardado:", newCycle);

			},

			//pom: reinicia estadística
			resetCycleCount: () => {
				setStore({ completedCycles: 0 });
				localStorage.setItem("cycles", 0);
			},

			//nos muestra la cuenta de ciclos (estadística)
			getCycleCount: () => {
				const store = getStore();
				console.log(`Completed sessions: ${store.completedCycles}`);

			},























































			PostHabits: async (title, category) => {
				console.log(title,category)
				let token = localStorage.getItem("token");

				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				myHeaders.append("Authorization", `Bearer ${token}`);
								
				const raw = JSON.stringify({
				  "title": title,
				  "category": category
				});
				
				const requestOptions = {
				  method: "POST",
				  headers: myHeaders,
				  body: raw,
				  redirect: "follow"
				};
				
				try {
				const response = await fetch(process.env.BACKEND_URL + "/api/habits", requestOptions);
				const result = await response.json();
				console.log(response)
				if (response.status==201) {
					getActions().getHabits()
					
				}

				  console.log(result)
				} catch (error) {
				  console.error(error);
				};

			},

			getHabits: async () => {
				let token = localStorage.getItem("token");

				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				myHeaders.append("Authorization", `Bearer ${token}`);

				const requestOptions = {
				  method: "GET",
				  headers: myHeaders,
				  redirect: "follow"
				};
				
				try {
				 const response = await fetch(process.env.BACKEND_URL + "/api/habits", requestOptions);
				  const result = await response.json();
				  console.log(result)
				  setStore({habitTracker:result})
				} catch (error) {
				  console.error(error);
				};

				// const myHeaders = new Headers();
				// myHeaders.append("Content-Type", "application/json");

				// const requestOptions = {
				// 	method: "GET",
				// 	headers: myHeaders,
				// 	redirect: "follow"
				// };

				// try {
				// 	const response = await fetch(process.env.BACKEND_URL + "/api/habits", requestOptions);
				// 	if (!response.ok) {
				// 		throw new Error(`HTTP error! status: ${response.status}`);
				// 	}
				// 	const result = await response.json();
				// 	console.log(result);
				// } catch (error) {
				// 	console.error("Error fetching habits:", error); // Manejo de errores si falla la solicitud
				// }
			},

			DeleteHabits: async () => {
				const myHeaders = new Headers();
				const raw = "";

				const requestOptions = {
					method: "DELETE",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/habits/<int:id>`, requestOptions);
					const result = await response.json();
					console.log(result)
				} catch (error) {
					console.error(error);
				};
			},

			AccountDelete: async () => {
				let token = localStorage.getItem("token");

				const myHeaders = new Headers();
				myHeaders.append("Authorization", `Bearer ${token}`);

				const requestOptions = {
					method: "DELETE",
					headers: myHeaders,
					redirect: "follow"
				};

				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/user/`, requestOptions);

					if (response.ok) {
						// Eliminar el token del localStorage
						localStorage.removeItem("token");

						// Redirigir al landing page
						window.location.href = "/";
					} else {
						console.error("Error al eliminar la cuenta");
					}
				} catch (error) {
					console.error("Error en la solicitud:", error);
				}
			},

































































































































			getProfile: async () => {
				const token = localStorage.getItem("token");
				if (token) {
					try {
						const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								"Authorization": `Bearer ${token}`,
							},
						});
						if (response.ok) {
							const data = await response.json();
							setStore({ user: data });
						} else {
							console.error("Error al obtener el perfil del usuario");
						}
					} catch (error) {
						console.error("Error al realizar la solicitud:", error);
					}
				} else {
					console.error("No se encontró el token de autenticación");
				}
			},

			passwordChange: async (currentPassword, newPassword) => {

				const token = localStorage.getItem("token");
				if (!token) {
					console.error("No token found");
					return;
				}

				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				myHeaders.append("Authorization", `Bearer ${token}`);

				// Prepara el cuerpo de la solicitud con las contraseñas proporcionadas dinámicamente
				const raw = JSON.stringify({
					current_password: currentPassword,
					new_password: newPassword
				});

				const requestOptions = {
					method: "PUT",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					// Realiza la solicitud PUT a la API para cambiar la contraseña
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/changepassword`, requestOptions);

					if (response.ok) {
						const result = await response.json();
						console.log(result); // Muestra la respuesta de la API
					} else {
						const error = await response.json();
						console.error("Error:", error); // Muestra el error si la respuesta no es exitosa
					}
				} catch (error) {
					console.error("Error en la solicitud:", error); // Manejo de errores
				}

			

		},



		getGender: () => {
			fetch(process.env.BACKEND_URL + "/api/user/me", {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				}
			})
				.then(response => {
					if (!response.ok) {
						throw new Error(`Error al obtener los datos: ${response.status}`);
					}
					return response.json();
				})
				.then(user => {
					console.log("Usuario autenticado desde el backend:", user);

					// Actualiza el estado global con los datos del usuario autenticado
					setStore({ userGender: user.gender || "prefer_not_to_say" });
				})
				.catch(error => console.error("Error al obtener el género:", error));
		},

		setEmotion: (emotion) => {
			const store = getStore();
			const userEmail = localStorage.getItem("userEmail");

			if (!userEmail) {
				console.error("No se encontró un email. Asegúrate de que el usuario haya iniciado sesión correctamente.");
				return;
			}
			const todayDate = new Date().toISOString().split('T')[0];
			const isNewDay = store.emotions.lastDate !== todayDate;
			const newCounts = isNewDay
				? { happy: 0, love: 0, neutral: 0, mad: 0, sad: 0 } // Reinicia si es un nuevo día
				: { ...store.emotions.counts };

			newCounts[emotion] += 1;

			const updatedEmotions = {
				currentEmotion: emotion,
				counts: newCounts,
				lastDate: todayDate,
			};

			setStore({ emotions: updatedEmotions });
			localStorage.setItem(`emotions_${userEmail}`, JSON.stringify(updatedEmotions)); // Guarda datos específicos usando el email
		},


		emotionFromLocalStorage: () => {
			const userEmail = localStorage.getItem("userEmail"); // Recuperar el email del usuario actual
			if (!userEmail) {
				console.error("No se encontró un email. Asegúrate de que el usuario haya iniciado sesión correctamente.");
				return;
			}

			const savedData = JSON.parse(localStorage.getItem(`emotions_${userEmail}`)); // Usa el email como clave
			const todayDate = new Date().toISOString().split('T')[0];

			// Inicializa si no hay datos guardados o si es un nuevo día
			if (!savedData || savedData.lastDate !== todayDate) {
				setStore({
					emotions: {
						currentEmotion: "neutral",
						counts: { happy: 0, love: 0, neutral: 0, mad: 0, sad: 0 },
						lastDate: todayDate,
					},
				});
			} else {
				console.log(`Cargando emociones para: ${userEmail}`);
				setStore({ emotions: savedData });

			}
		},







	},

	};
};

export default getState;
