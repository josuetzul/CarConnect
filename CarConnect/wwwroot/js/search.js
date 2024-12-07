// Configuración base de la API
const API_BASE_URL = "https://localhost:7056/api/";

// Función para construir URLs de la API
function buildApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}

document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar todos los elementos de la lista
    const carItems = document.querySelectorAll(".car-item");
    const carInfoContainer = document.getElementById("carInfoContainer");
    const carInfoContent = document.getElementById("carInfoContent");

    const createAppointmentButton = document.getElementById("createAppointmentButton");
    const createAppointmentFormContainer = document.getElementById("createAppointmentFormContainer");
    const createAppointmentForm = document.getElementById("createAppointmentForm");

    const fechaCita = document.getElementById("fechaCita");

    let selectedCar = {}; // Objeto para almacenar el carro seleccionado
    carItems.forEach(item => {
    item.addEventListener("click", () => {
        selectedCar = {
            id: item.dataset.id,
            name: item.dataset.name,
            description: item.dataset.description,
            color: item.dataset.color,
            type: item.dataset.type,
            tier: item.dataset.tier,
            state: item.dataset.state,
        };

        // Actualizar el contenedor con la información del carro
        carInfoContent.innerHTML = `
                    <strong>Nombre:</strong> ${selectedCar.name}<br>
                    <strong>ID:</strong> ${selectedCar.id}<br>
                    <strong>Descripción:</strong> ${selectedCar.description}<br>
                    <strong>Color:</strong> ${selectedCar.color}<br>
                    <strong>Tipo:</strong> ${selectedCar.type}<br>
                    <strong>Tier:</strong> ${selectedCar.tier}<br>
                    <strong>Estado:</strong> ${selectedCar.state}
                `;

        // Mostrar el contenedor
        carInfoContainer.style.display = "block";
    });
});
});

createAppointmentButton.addEventListener("click", () => {
    createAppointmentFormContainer.style.display = "block";
});

fechaCita.addEventListener("change", () => {
    const selectedDate = new Date(fechaCita.value);
    const today = new Date();
    if (selectedDate < today) {
        alert("No puedes seleccionar una fecha anterior a la actual.");
        fechaCita.value = ""; // Resetea el valor
    }
});

// Enviar formulario para crear un carro
createAppointmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newAppointment = {
        carId: selectedCar.id,
        nameComprador: createAppointmentForm.nameComprador.value,
        phoneComprador: createAppointmentForm.phoneComprador.value,
        fechaCita: createAppointmentForm.fechaCita.value,
    };

    try {
        
        const fullUrl = buildApiUrl(`appointments`);
        const response = await fetch(fullUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAppointment),
        });

        if (response.ok) {
            alert("Cita creada con éxito.");
            createAppointmentFormContainer.style.display = "none";
        } else {
            alert("Error al crear la cita.");
        }
    } catch (error) {
        console.error("Error en la creación:", error);
        alert("Ocurrió un problema al intentar crear la cita.");
    }
    createAppointmentForm.nameComprador.value = "";
    createAppointmentForm.phoneComprador.value = "";
    createAppointmentForm.fechaCita.value = "";
});