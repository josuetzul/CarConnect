using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using CarConnect.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace CarConnect.Pages
{
    public class LoginModel : PageModel
    {
        private readonly ApiService _apiService;

        public LoginModel(ApiService apiService)
        {
            _apiService = apiService;
        }

        [BindProperty]
        public string Username { get; set; } = string.Empty;

        [BindProperty]
        public string Password { get; set; } = string.Empty;
        [BindProperty]
        public string Role { get; set; } = string.Empty;

        public string? ErrorMessage { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
            {
                ErrorMessage = "Por favor, ingresa tanto el usuario como la contraseña.";
                return Page();
            }

            try
            {
                var loginEndpoint = "Users/login"; // Endpoint de login

                // Se asume que solo existe un admin, y por lo tanto los demás usuarios serán asesores
                Role = (Username == "admin") ? "admin" : "ventas"; 

                var credentials = new { Username, Password , Role};

                // Llama a la API para validar las credenciales
                var response = await _apiService.PostToApiAsync<User>(loginEndpoint, credentials);

                if (response.Data != null) // Login exitoso
                {
                    var user = response.Data;

                    // Crear las claims del usuario
                    var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role) // Rol del usuario
            };

                    // Crear la identidad y principal del usuario
                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    // Inicia sesión con cookies
                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity));


                    // Redirige según el rol
                    switch (user.Role)
                    {
                        case "admin":
                            return RedirectToPage("/Main");
                        case "ventas":
                            return RedirectToPage("/Dashboard");
                        default:
                            ErrorMessage = "Rol no reconocido.";
                            break;
                    }
                }
                else // Login fallido
                {
                    ErrorMessage = "Usuario o contraseña incorrectos.";
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = "Error al conectar con el servidor. Inténtalo nuevamente más tarde.";
                Console.WriteLine($"Error: {ex.Message}");
            }

            return Page();
        }

        public class User
        {
            public int Id { get; set; }
            public string Username { get; set; }
            public string Password { get; set; }
            public string Role { get; set; }
        }
    }
}
