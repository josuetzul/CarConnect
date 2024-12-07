using CarConnect.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CarConnect.Pages
{
    public class MainModel : PageModel
    {
        private readonly ApiService _apiService;

        public MainModel(ApiService apiService)
        {
            _apiService = apiService;
        }
        
    }
}
