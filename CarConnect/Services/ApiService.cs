namespace CarConnect.Services
{
    using System.Net.Http;
    using System.Net.Http.Json;
    using System.Threading.Tasks;
    using System;

    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<(T? Data, string? Error)> GetFromApiAsync<T>(string endpoint)
        {
            try
            {
                var data = await _httpClient.GetFromJsonAsync<T>(endpoint);
                return (data, null);
            }
            catch (HttpRequestException httpEx)
            {
                // Mensaje de error específico
                return (default, $"Error de conexión: {httpEx.Message}");
            }
            catch (Exception ex)
            {
                // Mensaje de error genérico
                return (default, $"Error inesperado: {ex.Message}");
            }
        }
        public async Task<(T? Data, string? Error)> PostToApiAsync<T>(string endpoint, object body)
         {
            try
            {
                var response = await _httpClient.PostAsJsonAsync(endpoint, body);

                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<T>();
                    return (data, null);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(error);
                    return (default, error);
                }
            }
            catch (Exception ex)
            {
                return (default, $"Error al conectar con la API: {ex.Message}");
            }
        }
    }
}
