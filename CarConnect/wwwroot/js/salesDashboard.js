// Configuración base de la API
const API_BASE_URL = "https://localhost:7056/api/";

// Función para construir URLs de la API
function buildApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}

document.addEventListener("DOMContentLoaded", () => {
    // Elementos HTML donde se mostrarán las citas
    const citasHoySection = document.getElementById("citasHoy");
    const citasManianaSection = document.getElementById("citasManiana");

    const contentWithButtons = document.getElementById("contentWithButtons");

    // Ocultar botón de Contacto ya que no será necesario
    const contactButton = document.getElementById("Contact-btn");
    contactButton.style.display = "none";

    // Botones y sus eventos
    document.getElementById("buttonPast").addEventListener("click", () => {
        fetchCitas("pasadas", "Citas Pasadas");
    });

    document.getElementById("buttonFuture").addEventListener("click", () => {
        fetchCitas("futuras", "Citas Futuras");
    });

    // Función para cargar citas de hoy y mañana automáticamente al inicio
    loadCitas("hoy", citasHoySection, "No hay citas registradas para hoy.");
    loadCitas("maniana", citasManianaSection, "No hay citas registradas para mañana.");
});

// Función genérica para cargar y mostrar citas
function loadCitas(tipo, section, emptyMessage) {
    const fullUrl = buildApiUrl(`Appointments/filter?tipo=${tipo}`);
    fetch(fullUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener citas: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                section.innerHTML = `<h2>Citas ${capitalize(tipo)}</h2><p>${emptyMessage}</p>`;
            } else {
                section.innerHTML = `
                    <h2>Citas ${capitalize(tipo)}</h2>
                    <ul>
                        ${data.map(cita => `
                            <li>
                                <p><b>Nombre:</b> ${cita.nameComprador}</p>
                                <p><b>Teléfono:</b> ${cita.phoneComprador}</p>
                                <p><b>Fecha:</b> ${formatDate(cita.fechaCita)}</p>
                                <div id="car-${cita.carId}" class="car-info-summary" data-car-id="${cita.carId}">
                                    <b>Carro:</b> <span class="car-name">Cargando...</span>
                                </div>
                            </li>
                        `).join("")}
                    </ul>
                `;
                // Reutilizar la función para cargar datos y asignar eventos
                loadCarDetails(data, "#car", displayCarDetails);
            }
        })
        .catch(error => {
            section.innerHTML = `<h2>Citas ${capitalize(tipo)}</h2><p>Error al cargar citas: ${error.message}</p>`;
        });
}

// Modificar `fetchCitas` para usar las funciones reutilizables
function fetchCitas(tipo, titulo) {
    contentWithButtons.innerHTML = ``;
    const fullUrl = buildApiUrl(`appointments/filter?tipo=${tipo}`);
    fetch(fullUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener citas: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                contentWithButtons.innerHTML = `<h2>${titulo}</h2><p>No se encontraron citas</p>`;
            } else {
                contentWithButtons.innerHTML = `
                    <h2>${titulo}</h2>
                    <ul>
                        ${data.map(cita => `
                            <li>
                                <p><b>Nombre:</b> ${cita.nameComprador}</p>
                                <p><b>Teléfono:</b> ${cita.phoneComprador}</p>
                                <p><b>Fecha:</b> ${formatDate(cita.fechaCita)}</p>
                                <div id="car-${cita.carId}" class="car-info-summary" data-car-id="${cita.carId}">
                                    <b>Carro:</b> <span class="car-name">Cargando...</span>
                                </div>
                            </li>
                        `).join("")}
                    </ul>
                `;
                // Reutilizar la función para cargar datos y asignar eventos
                loadCarDetails(data, "#car", displayCarDetails);
            }
        })
        .catch(error => {
            contentWithButtons.innerHTML = `<h2>${titulo}</h2><p>Error al cargar citas: ${error.message}</p>`;
        });
}

// Función para cargar la información completa de los carros
function loadCarDetails(citaData, containerSelector, callback) {
    const carDetailsMap = {};

    // Iterar sobre las citas para cargar información de los carros
    citaData.forEach(cita => {
        const carContainer = document.querySelector(`${containerSelector}-${cita.carId}`);

        fetch(buildApiUrl(`Cars/${cita.carId}`))
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener datos del carro: ${response.statusText}`);
                }
                return response.json();
            })
            .then(carData => {
                // Guardar datos del carro en el mapa
                carDetailsMap[cita.carId] = carData;

                // Actualizar el nombre en el contenedor
                if (carContainer) {
                    const carNameElement = carContainer.querySelector(".car-name");
                    if (carNameElement) {
                        carNameElement.textContent = carData.name;
                    }
                }
            })
            .catch(error => {
                if (carContainer) {
                    const carNameElement = carContainer.querySelector(".car-name");
                    if (carNameElement) {
                        carNameElement.textContent = "Error al cargar";
                    }
                }
            });

        // Asignar evento de clic para mostrar detalles del carro
        if (carContainer) {
            carContainer.addEventListener("click", () => {
                const carId = carContainer.dataset.carId;
                const carData = carDetailsMap[carId];

                if (carData) {
                    // Callback para actualizar el contenedor con la información completa
                    callback(carContainer, carData);
                }
            });
        }
    });
}

// Función de callback para mostrar los detalles del carro
function displayCarDetails(container, carData) {
    container.innerHTML = `
        <div class="car-details">
        <h4>Informacion del carro que le interesa </h4>
            <p><b>Nombre:</b> ${carData.name}</p>
            <p><b>Descripción:</b> ${carData.description}</p>
            <p><b>Color:</b> ${carData.color}</p>
            <p><b>Tipo:</b> ${carData.type}</p>
            <p><b>Tier:</b> ${carData.tier}</p>
            <p><b>Estado:</b> ${carData.state}</p>
        </div>
    `;
}

// Función para capitalizar la primera letra
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}
