# CarConnect
Descripción del proyecto: 
El proyecto simula un portal web, basado en el contenido de un concesionario de vehículos. Ofrece a los clientes buscar vehículos disponibles en la agencia. Ofrece el acceso a los asesores de ventas y al administrador para tener funciones completas que simulan a baja escala un concesionario. 
El proyecto se trabajó en el entorno .NET, de modo que se usaron las razor pages para crear las páginas web, junto a HTML. Para la lógica de las páginas web se utilizó principalmente JavaScript. Se utilizó CSS para darle estética a las páginas. 

Funcionalidades:
Los clientes pueden buscar vehículos y si se encuentran interesados, agendar una cita para conocerlo en la agencia física. 
Los asesores de ventas pueden observar la información de las citas que han sido agendadas, de modo que se pueden preparar para concretar la venta del vehículo. 
El administrador, tiene la opción de crear, editar y eliminar vehículos y usuarios. De modo que solo el administrador puede controlar la información disponible en el concesionario. 

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
IMPORTANTES
El proyecto está desarrollado principalmente en el entorno .NET 9.0
Asegurarse que en los archivos: (program.cs, adminMain.js, salesDashboard.js, search.js) donde se conecta con la API, se agregue correctamente la URL donde se ejecuta la API, ya que esta puede variar y no ser encontrada por el portal del concesionario. 

NOTA: la API debe estar en ejecución para el funcionamiento del programa. 

NECESARIOS PARA LA EJECUCIÓN CORRECTA DEL PROYECTO

Instalar el paquete Microsoft.AspNetCore.Authorization para la autenticación de usuarios

