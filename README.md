
# Backend 2°Parte - Proyecto Final - Cordoba Ezequiel

El proyecto que se presenta simula ser una página E-Commerce de un hipermercado. La finalidad del proyecto es demostrar los conocimientos de BackEnd y FrontEnd que se tienen y se adquirieron en el curso de Programación Backend II: Diseño y Arquitectura Backend de CODERHOUSE, con el profesor Omar Jesús Maniás. 

## Apéndice
1. [Instalación](#Instalación)
3. [Servidor](#Servidor)
4. [Rutas](#Rutas)
5. [Endpoints](#Endpoints)
6. [Autenticacion y autorización](#Autenticacion)
7. [Estructura del Proyecto](#estructura)
8. [Recursos utilizados](#Recursos-utilizados)
9. [Comentarios](#Comentarios)
## Instalación
### Requisitos previos
- Node.js v14.17.0
### Instrucciones de instalación
Para clonar el repositorio:

```bash
git clone https://github.com/Ezecordoba14/Preentrega1Cordoba.git
cd Preentrega1Cordoba
```
Instalar las dependencias
```bash
npm install
```
Iniciar la aplicación
```bash
npm start
```

## Servidor
El servidor está configurado para ejecutarse en localhost en el puerto 8080. Una vez que la aplicación esté inicializada con el comando npm start, se puede visualizar el proyecto en un navegador con el siguiente link:

http://localhost:8080/
## Rutas
Esta aplicacion utiliza cuatros rutas para funcionar:
- Products: Contiene los métodos GET, POST, PUT y DELETE para la gestión de productos.
- Carts: Incluye los métodos GET, POST, PUT y DELETE para la gestión de carritos.
- Sessions: Permite el registro, inicio de sesión y autentificación del usuario dentro del sitio. Incluye los métodos GET y POST.
- Views: Permite renderizar la información en pantalla usando Handlebars mediante el método GET.
## Endpoints
### Products
- GET: El endpoint trae el listado completo de los productos con todo su detalle. Si se especifica un id, /api/products/id, el método mostrará el producto con dicho id si existe tal. Asimismo, al especificar un límite como pedido con /api/products/?limit=X&sort=X&category=X, se devuelve el listado de productos limitados en cantidad X, ordenado de precio o nombres en ascendente o descendente (nameDesc, nameAsc, priceAsc, priceDesc), y tambiendo se puede filtrar el listado por la categorias de los productos.

- POST: El endpoint permite agregar un nuevo producto. El id del nuevo producto se define solo, de manera que no se repita con ninguno de los anteriores por medio de mongoDB. El método también toma como obligatorios los campos de título, código, descripción, stock y categoría, así como también el tipo de dato que se ingresa. Una vez realizado el método, se actualiza la base de datos. El método debe ejecutarse en la raíz de la api, /api/products/. A este endpoint solo puede ser utilizado por quien tenga rol de admin.

- PUT: Este endpoint permite modificar cualquiera de los productos que se encuentran en la base de datos especificando el id del mismo mediante /api/products/id. El método buscará los datos a cambiar y solo cambiará los mismos, sin necesidad de volver a escribir todo el producto, o lo que se desea dejar igual. En caso de que el producto no exista, devolverá un error 404. A este endpoint solo puede ser utilizado por quien tenga rol de admin.

- DELETE: El endpoint busca el producto mediante la especificación del id /api/products/id, y elimina el producto del array, actualizando la base de datos al hacerlo. A este endpoint solo puede ser utilizado por quien tenga rol de admin.

### Cart
- GET:  El endpoint trae el listado completo de los carritos con el detalle de id. Si se especifica un id, /api/carts/id, el método mostrará el carrito con dicho id si existe, los productos que se seleccionaron y las cantidades desadas.

- POST: El endpoint debe ejecutarse en la raíz /api/carts, y generará un nuevo carrito con un id asignado automáticamente. El mismo se guardará en la base de datos y generará el array de productos vacíos para luego ser añadidos. En la raiz "/api/carts/cid/product/pid" podremos agregar un producto especifico a un carrito deseado, ambos por medio de sus ids respectivamente.

- PUT: Encontraremos la ruta "/api/carts/:cid" que por medio de un id de un carrito podremos modificar la existencia del mismo.

- DELETE: El endpoint permite el distintas combinaciones de parámetros para resolver la consulta. Si se pasa /api/carts/cid/product/pid, se elimina dicho producto del carrito, devolviendo así el stock original a la base de datos de producto. Por otro lado, si se pasa /api/carts/cid, se eliminarán todos los productos dentro del carrito seleccionado, no así el carrito, permitiendo la persistencia y continuar con la compra si así se desea.

### Sessions
- GET: El endpoint de GET de Sessions permite obtener los datos del usuario autenticado.

    - /current: Envía los datos del usuario logeado una vez que se autentica la sesión del mismo al frontend.
    - /github: Permite al usuario poder logearse mediante github.

- POST: Los siguientes endpoints habilitan el registro, logueo y autentificación del usuario a través de inserciones en la base de datos y verificaciones en la misma.

    - /register: Permite el registro del usuario verificando que el correo electrónico no se encuentre ya en la base de datos. Una vez que se crea el registro, el usuario tendrá un rol de user podiendo crear los carritos que desee.

    - /login: Permite el inicio de sesión siempre que se haya registrado el usuario previamente, si el inicio de sesión es exitoso, se genera un token que se almacena en las cookies.

    - /logout: Permite la finalización de la sesión, eliminando la cookie del navegador.

### Views
- GET: Los endpoints de GET permiten la visualización y renderización de las vistas utilizando Handlebars. A continuación se describen las vistas principales:

    - /api/createproduct: permite al administrador crear productos, agregandolo a la base de datos.

    - /login: Redirecciona al usuario a la página de login, siempre y cuando este no esté logueado.

    - /register: Redirecciona al usuario a la página de registro, siempre y cuando no esté loguado.

    - /profile: Redirecciona al usuario a su perfil, si está logueado y autenticado mediante passport.
    - /postPurchase: Redirecciona al usuario a un mensaje de éxito al realizar la comprar e invitandolo a seguir explorando la web. 


## Autenticacion

Se utiliza express-session para mantener la sesión en MongoStore. Adicionalmente se utiliza passport y JsonWebToken como estatregia de autenticación y autorización a lo largo de la navegación del sitio, teniendo como objetivo principal no autorizar ciertos accesos y proteger la sesión del usuario así como también sus datos sensibles. Se utiliza cookie-parser para poder extraer los tokens generados en los inicios de sesión, y permite la navegación durante una hora sin cerrar la sesión de manera automática.
## Estructura
```
src
 ┣ config
 ┃ ┣ database.js
 ┃ ┣ dotenv.config.js
 ┃ ┗ passport.config.js
 ┣ controllers
 ┃ ┣ cart.controller.js
 ┃ ┣ product.controller.js
 ┃ ┗ users.controller.js
 ┣ dao
 ┃ ┣ classes
 ┃ ┃ ┣ cart.dao.js
 ┃ ┃ ┣ product.dao.js
 ┃ ┃ ┗ users.dao.js
 ┃ ┗ models
 ┃ ┃ ┣ cart.model.js
 ┃ ┃ ┣ product.model.js
 ┃ ┃ ┗ users.js
 ┣ middleware
 ┃ ┗ auth.js
 ┣ public
 ┃ ┣ css
 ┃ ┃ ┗ basic.css
 ┃ ┗ js
 ┃ ┃ ┣ cart.js
 ┃ ┃ ┣ Home&Carts.js
 ┃ ┃ ┗ index.js
 ┣ routes
 ┃ ┣ api
 ┃ ┃ ┗ sessions.js
 ┃ ┣ carts.router.js
 ┃ ┣ products.router.js
 ┃ ┗ views.router.js
 ┣ views
 ┃ ┣ layouts
 ┃ ┃ ┗ main.hbs
 ┃ ┣ cart.hbs
 ┃ ┣ carts.hbs
 ┃ ┣ createProduct.hbs
 ┃ ┣ detailProd.hbs
 ┃ ┣ formPurchase.hbs
 ┃ ┣ home.hbs
 ┃ ┣ login.hbs
 ┃ ┣ postPurchase.hbs
 ┃ ┣ profile.hbs
 ┃ ┗ register.hbs
 ┣ app.js
 ┗ utils.js
```
## Recursos-utilizados
- Express: Un marco web para Node.js, utilizado para construir el backend.
`Versión`: ^4.19.2
- Express Handlebars: Motor de plantillas para generar vistas HTML dinámicas.
`Versión`: ^7.1.3
- Socket.io: Biblioteca para la comunicación en tiempo real entre el servidor y el cliente.
`Versión`: ^4.7.5
- Mongoose: Biblioteca para la modelación de datos en MongoDB y la interacción con la base de datos.
`Versión`: ^8.5.1
- Mongoose Paginate v2: Plugin de Mongoose para agregar paginación a los esquemas de MongoDB.
`Versión`: ^1.8.3
- Toastify: Biblioteca para mostrar notificaciones de estilo "toast".
`Versión`: ^1.12.0
- Sweetalert2: 
`Versión`: ^2.1.2
- Passport: Middleware de autenticación para Node.js.
`Versión`: ^0.7.0
- Passport local: Estrategia de autenticación de nombre de usuario y contraseña local para Passport.
`Versión`: ^1.0.0
- Passport JWT: Estrategia de Passport para autenticación con JSON Web Tokens (JWT).
`Versión`: ^4.0.1
- Passport Github2: Permite autenticarse mediante GitHub en la aplicación Node.js.
`Versión`: ^0.1.12
- bcrypt: Biblioteca para el hash y la verificación de contraseñas.
`Versión`: ^5.1.1
- Connect-Mongo: Adaptador para almacenar sesiones en MongoDB.
`Versión`: ^5.1.0
- Cookie-Parser: Middleware para analizar cookies en las solicitudes HTTP.
`Versión`: ^1.4.6
- dotenv: Carga variables de entorno desde un archivo .env.
`Versión`: ^16.4.5
- jsonwebtoken: Biblioteca para trabajar con JSON Web Tokens (JWT).
`Versión`: ^9.0.2
- uuid: Permite crear ids unicos y aleatorios.
`Versión`: ^10.0.0

## Comentarios
Para poder acceder como administrador el email utilizado es `admin@ex.com` y la contraseña es `admin`.
Desde ya aproveche para agredecerles por la interes en este proyecto y sobre todo a los profesores que me compartieron sus conocimientos para realizar este proyecto.
