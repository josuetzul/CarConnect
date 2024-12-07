using CarConnect.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace CarConnect.Pages
{
    public class SearchModel : PageModel
    {
        private readonly ApiService _apiService;

        public SearchModel(ApiService apiService)
        {
            _apiService = apiService;
        }

        [BindProperty(SupportsGet = true)]
        public string? Query { get; set; } = string.Empty; // Captura el valor del formulario
        public SelectList? Types { get; set; }
        
        [BindProperty(SupportsGet = true)]
        public string? CarType { get; set; }
        public SelectList? Tiers { get; set; }

        [BindProperty(SupportsGet = true)]
        public string? CarTier { get; set; }
        public SelectList? States { get; set; }

        [BindProperty(SupportsGet = true)]
        public string? CarState { get; set; }
        
        public List<Car> Cars { get; set; } = new(); // Almacena los resultados de búsqueda
        public string? ErrorMessage { get; set; } // Almacena el mensaje de error en caso de fallo

        public async Task<IActionResult> OnGetAsync()
        {
            // 1. Carga los filtros de autos desde la API al inicio
            var typesResult = await _apiService.GetFromApiAsync<List<string>>("cars/types");
            Types = new SelectList(typesResult.Data, ""); // Asigna los tipos al SelectList
            var tiersResult = await _apiService.GetFromApiAsync<List<string>>("cars/tiers");
            Tiers = new SelectList(tiersResult.Data, ""); // Asigna los tiers al SelectList
            var statesResult = await _apiService.GetFromApiAsync<List<string>>("cars/states");
            States = new SelectList(statesResult.Data, ""); // Asigna los states al SelectList


            // Validación: se requiere un query o al menos un filtro seleccionado
            if (string.IsNullOrEmpty(Query) && string.IsNullOrEmpty(CarType) && string.IsNullOrEmpty(CarTier) && string.IsNullOrEmpty(CarState))
            {
                Cars = new List<Car>();
                ErrorMessage = "Por favor, ingresa un término de búsqueda o selecciona al menos un filtro.";
                return Page();
            }

            // Construye la URL de la API con los filtros seleccionados
            var searchEndpoint = "cars/search";

            // Agrega el query y los filtros si están disponibles
            var queryParams = new List<string>();
            if (!string.IsNullOrEmpty(Query))
            {
                queryParams.Add($"query={Query}");
            }
            if (!string.IsNullOrEmpty(CarType))
            {
                queryParams.Add($"type={CarType}");
            }
            if (!string.IsNullOrEmpty(CarTier))
            {
                queryParams.Add($"tier={CarTier}");
            }
            if (!string.IsNullOrEmpty(CarState))
            {
                queryParams.Add($"state={CarState}");
            }

            // Une los parámetros con el carácter "&"
            if (queryParams.Count > 0)
            {
                searchEndpoint += "?" + string.Join("&", queryParams);
            }

            // Llama a la API y maneja la respuesta
            var result = await _apiService.GetFromApiAsync<List<Car>>(searchEndpoint);

            if (result.Data != null)
            {
                Cars = result.Data; // Éxito: guarda los resultados
                ErrorMessage = null; // Limpia cualquier mensaje de error previo
            }
            else
            {
                Cars = new List<Car>(); // No hay resultados si ocurre un error
                ErrorMessage = result.Error ?? "Ocurrió un error desconocido."; // Asigna el mensaje de error
            }

            return Page();

        }
    }

    public class Car
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public string Type { get; set; }
        public string Tier { get; set; }
        public string State { get; set; }
    }
}
