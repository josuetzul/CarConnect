// Configuración base de la API
const API_BASE_URL = "https://localhost:7056/api/";

// Función para construir URLs de la API
function buildApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}

const DEFAULT_FETCH_OPTIONS = {
    headers: {
        "Content-Type": "application/json",
    },
};

async function fetchApi(endpoint, options = {}) {
    const url = buildApiUrl(endpoint);

    // Combinar encabezados predeterminados y específicos
    const config = {
        ...DEFAULT_FETCH_OPTIONS,
        ...options,
        headers: {
            ...DEFAULT_FETCH_OPTIONS.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error en fetchApi(${url}):`, error);
        throw error;
    }
}

// Esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
    // Elementos específicos del DOM

    // Elementos de carros
    const editCarsButton = document.getElementById("editCarsButton");

    // Crear carro
    const carsContent = document.getElementById("carsContent");
    const createCarButton = document.getElementById("createCarButton");
    const createCarFormContainer = document.getElementById("createCarFormContainer");
    const createCarForm = document.getElementById("createCarForm");

    // Editar carro
    const editCarFormContainer = document.getElementById("editCarFormContainer");

    // Buscar carro
    const searchCarContainer = document.getElementById("searchCarContainer");
    const searchCarInput = document.getElementById("searchCar");
    const searchCarButton = document.getElementById("searchCarButton");
    const searchResults = document.getElementById("searchResults");

    //Elementos de usuarios
    const editUsersButton = document.getElementById("editUsersButton");

    // Crear usuario
    const usersContent = document.getElementById("usersContent");
    const createUserButton = document.getElementById("createUserButton");
    const createUserFormContainer = document.getElementById("createUserFormContainer");
    const createUserForm = document.getElementById("createUserForm");

    // Editar usuario
    const editUserFormContainer = document.getElementById("editUserFormContainer");

    // Lista de usuarios
    const usersListContainer = document.getElementById("usersListContainer");
    const usersList = document.getElementById("usersList");

    // Ocultar botón de contacto ya que no será necesario
    const contactButton = document.getElementById("Contact-btn");
    contactButton.style.display = "none";
});
    // Mostrar contenido de carros y ocultar usuarios
    editCarsButton.addEventListener("click", () => {
        createCarButton.style.display = "block";
        createCarFormContainer.style.display = "none";
        searchCarContainer.style.display = "block";
        searchResults.style.display = "none";
        searchCarInput.value = "";
        editCarFormContainer.style.display = "none";
        usersContent.style.display = "none";
    });

    // Mostrar formulario de creación de carro
    createCarButton.addEventListener("click", () => {
        createCarFormContainer.style.display = "block";
        searchCarContainer.style.display = "none";
        createCarButton.style.display = "none";
    });

    // Enviar formulario para crear un carro
    createCarForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newCar = {
            name: createCarForm.name.value,
            description: createCarForm.description.value,
            color: createCarForm.color.value,
            type: createCarForm.type.value,
            tier: createCarForm.tier.value,
            state: createCarForm.state.value,
        };

        try {
            const fullUrl = buildApiUrl(`cars`);
            const response = await fetch(fullUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCar),
            });

            if (response.ok) {
                alert("Carro creado con éxito.");
                createCarFormContainer.style.display = "none";
                searchCarInput.value = "";
                searchResults.innerHTML = ""; // Limpia la lista de resultados
            } else {
                alert("Error al crear el carro.");
            }
        } catch (error) {
            console.error("Error en la creación:", error);
            alert("Ocurrió un problema al intentar crear el carro.");
        }
        createCarForm.name.value = "";
        createCarForm.description.value = "";
        createCarForm.color.value = "";
        createCarForm.type.value = "";
        createCarForm.tier.value = "";
        createCarForm.state.value = "";
        createCarButton.style.display = "block";
        searchCarContainer.style.display = "block";
    });

    // Buscar carros
    searchCarButton.addEventListener("click", async () => {
        const query = searchCarInput.value.trim();
        if (!query) {
            alert("Ingrese un término de búsqueda.");
            return;
        }

        await searchCars(query, searchResults);
        searchCarInput.value = "";
    });

    // Manejar acciones de edición/eliminación
    searchResults.addEventListener("click", async (event) => {
        await handleCarActions(event, searchResults);
    });

    // Buscar carros
    async function searchCars(query, searchResults) {
        searchResults.style.display = "block";
        const endpoint = `cars/Search?CarType=&CarTier=&CarState=&query=${encodeURIComponent(query)}`;
        try {
            const cars = await fetchApi(endpoint);
            if (cars.length > 0) {
                searchResults.innerHTML = cars
                    .map(
                        (car) => `
                    <div class="car-item">
                        <p><strong>${car.name}</strong> - ID: ${car.id}</p>
                        <p>Tipo: ${car.type} | Tier: ${car.tier} | Estado: ${car.state}</p>
                        <button class="btn btn-sm btn-warning edit-car" data-id="${car.id}" data-car='${JSON.stringify(car)}'>Editar</button>
                        <button class="btn btn-sm btn-danger delete-car" data-id="${car.id}">Eliminar</button>
                    </div>
                `
                    )
                    .join("");
            } else {
                searchResults.innerHTML = "<p>No se encontraron carros.</p>";
            }
        } catch (error) {
            console.error("Error al buscar carros:", error);
            searchResults.innerHTML = "<p>Error al buscar carros.</p>";
        }
    }

    // Manejar acciones de carros (editar/eliminar)
    async function handleCarActions(event, searchResults) {
        const target = event.target;

        if (target.classList.contains("delete-car")) {
            const carId = target.getAttribute("data-id");
            if (confirm(`¿Estás seguro de que deseas eliminar el carro con ID ${carId}?`)) {
                try {
                    const fullUrl = buildApiUrl(`cars/${carId}`);
                    const response = await fetch(fullUrl, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" }
                    });
                    if (response.ok) {
                        alert("Carro eliminado con éxito.");
                        target.closest(".car-item").remove();
                    }
                    else {
                        alert("Error al eliminar el carro.");
                    }
                } catch (error) {
                    alert("Error al eliminar el carro.");
                }
            }
        }

        if (target.classList.contains("edit-car")) {
            searchCarContainer.style.display = "none";
            createCarButton.style.display = "none";
            editCarFormContainer.style.display = "block";

            const carData = JSON.parse(target.getAttribute("data-car"));
            editCarFormContainer.innerHTML = createCarEditForm(carData);
            const editCarForm = document.getElementById("editCarForm");
            editCarForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                await updateCar(editCarForm, carData.id, editCarFormContainer, searchResults);
            });
        }
    }

    // Crear formulario de edición de carro dinámico
    function createCarEditForm(carData) {
        return `
        <h3>Editar Carro</h3>
        <form id="editCarForm">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" value="${carData.name}" required>
            <label for="description">Descripción:</label>
            <input type="text" id="description" name="description" value="${carData.description}" required>
            <label for="color">Color:</label>
            <input type="text" id="color" name="color" value="${carData.color}" required>
            <label for="type">Tipo:</label>
            <input type="text" id="type" name="type" value="${carData.type}" required>
            <label for="tier">Tier:</label>
            <input type="text" id="tier" name="tier" value="${carData.tier}" required>
            <label for="state">Estado:</label>
            <input type="text" id="state" name="state" value="${carData.state}" required>
            <button type="submit" class="btn btn-success">Guardar Cambios</button>
        </form>
    `;
    }

    // Actualizar carro
    async function updateCar(form, carId, editCarFormContainer, searchResults) {
        const updatedCar = {
            id: carId,
            name: form.name.value,
            description: form.description.value,
            color: form.color.value,
            type: form.type.value,
            tier: form.tier.value,
            state: form.state.value,
        };

        try {
            const fullUrl = buildApiUrl(`cars/${carId}`);
            const response = await fetch(fullUrl, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updatedCar),
            });
            if (response.ok) {
                alert("Vehículo actualizado con éxito.");
                editCarFormContainer.innerHTML = "";
                editCarFormContainer.style.display = "none";
                searchCarContainer.style.display = "block";
                createCarButton.style.display = "block";
                searchResults.innerHTML = "";
                searchResults.style.display = "none";
            }
            else {
                alert("Error al crear el carro.");
            }
        } catch (error) {
            alert("Error al actualizar el vehículo.");
        }
    }

    // Mostrar contenido de usuarios y ocultar carros
    editUsersButton.addEventListener("click", () => {
        createUserButton.style.display = "block";
        createUserFormContainer.style.display = "none";
        usersListContainer.style.display = "block";
        editUserFormContainer.style.display = "none";
        carsContent.style.display = "none";
        loadUsers();
    });

    // Mostrar formulario de creación de usuario
    createUserButton.addEventListener("click", () => {
        createUserFormContainer.style.display = "block";
        createUserButton.style.display = "none";
        usersListContainer.style.display = "none";
    });

    // Enviar formulario para crear un usuario
    createUserForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newUser = {
            username: createUserForm.username.value,
            password: createUserForm.password.value,
            role: createUserForm.role.value,
        };

        try {
            const fullUrl = buildApiUrl(`users`);
            const response = await fetch(fullUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                alert("Usuario creado con éxito.");
                createUserFormContainer.style.display = "none";
                loadUsers();
            } else {
                alert("Error al crear el usuario.");
            }
        } catch (error) {
            console.error("Error en la creación:", error);
            alert("Ocurrió un problema al intentar crear el usuario.");
        }
        createUserForm.username.value = "";
        createUserForm.password.value = "";
        createUserForm.role.value = "";
        createUserButton.style.display = "block";
        usersListContainer.style.display = "block";
    });

    // Manejar acciones de edición/eliminación
    usersList.addEventListener("click", async (event) => {
        await handleUserActions(event, usersList);
    });

    // Función para cargar la lista de usuarios
    const loadUsers = async () => {
        usersList.style.display = "block";
        usersList.innerHTML = "<p>Cargando usuarios...</p>";
        try {
            const users = await fetchApi(`users`);
            if (users.length > 0) {
                usersList.innerHTML = users.map(user => `
                <div class="user-item">
                    <p><strong>${user.username}</strong> - Rol: ${user.role}<strong> - Password:</strong> ${user.password}</p>
                    <button class="btn btn-sm btn-warning edit-user" data-id="${user.id}" data-user='${JSON.stringify(user)}'>Editar</button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">Eliminar</button>
                </div>
            `).join('');
            } else {
                usersList.innerHTML = "<p>No se encontraron usuarios.</p>";
            }
        }
        catch (error) {
            console.error("Error al buscar usuarios:", error);
            usersList.innerHTML = "<p>Error al cargar usuarios.</p>";
        }
    };

    // Manejar acciones de usuarios (editar/eliminar)
    async function handleUserActions(event, usersList) {
        const target = event.target;

        if (target.classList.contains("delete-user")) {
            const userId = target.getAttribute("data-id");

            if (confirm(`¿Estás seguro de que deseas eliminar el usuario con ID ${userId}?`)) {
                try {
                    const fullUrl = buildApiUrl(`users/${userId}`);
                    const response = await fetch(fullUrl, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" }
                    });

                    if (response.ok) {
                        alert("Usuario eliminado con éxito.");
                        target.closest(".user-item").remove();
                    } else {
                        alert("Error al eliminar el usuario.");
                    }
                } catch (error) {
                    alert("Ocurrió un problema al intentar eliminar el usuario.");
                }
            }
        }

        // Manejo del botón Editar
        if (target.classList.contains("edit-user")) {
            createUserButton.style.display = "none";
            usersListContainer.style.display = "none";
            editUserFormContainer.style.display = "block";

            const userData = JSON.parse(target.getAttribute("data-user"));
            editUserFormContainer.innerHTML = createUserEditForm(userData);
            const editUserForm = document.getElementById("editUserForm");
            editUserForm.addEventListener("submit", async (e) => {
                event.preventDefault();
                await updateUser(editUserForm, userData.id, userData.password,editUserFormContainer)
            });
        }
    }

    // Crear formulario de edición de usuario dinámico
    function createUserEditForm(userData) {
        return `
        <h3>Editar Usuario</h3>
                <form id="editUserForm">
                    <label for="username">Nombre de Usuario:</label>
                    <input type="text" id="username" name="username" value="${userData.username}" required>

                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" placeholder="Dejar en blanco para mantener la contraseña actual">

                    <label for="role">Rol:</label>
                    <input type="text" id="role" name="role" value="${userData.role}" required>

                    <button type="submit" class="btn btn-success">Guardar Cambios</button>
                </form>
    `;
    }

    // Actualizar usuario
    async function updateUser(editUserForm, userId, userPassword,editUserFormContainer) {
        const updatedUser = {
            id: userId,
            username: editUserForm.username.value,
            password: editUserForm.password.value == "" ? userPassword : editUserForm.password.value,
            role: editUserForm.role.value,
        };
        console.log("Password:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ",userPassword);
        try {
            const fullUrl = buildApiUrl(`users/${userId}`);
            console.log(JSON.stringify(updatedUser))
            alert(fullUrl);
            const response = await fetch(fullUrl, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updatedUser)
            });
            if (response.ok) {
                alert("Usuario actualizado con éxito.");
                editUserFormContainer.innerHTML = "";
                editUserFormContainer.style.display = "none";
                usersListContainer.style.display = "block";
                createUserButton.style.display = "block";
                editUserFormContainer.style.display = "none";
                loadUsers();
            } else {
                alert("Error al actualizar el usuario.");
            }
        } catch (error) {
            console.log("Estado:", response.status);
            console.log("Texto:", await response.text());
            console.error("Error en la actualización:", error);
            alert("Ocurrió un problema al intentar actualizar el usuario.");
        }
    }