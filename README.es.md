# Academlo Auth API

Un servicio de autenticación robusto construido con Node.js, Express, TypeScript y Sequelize ORM. Esta API proporciona características completas de autenticación de usuarios incluyendo registro, verificación de email, inicio de sesión, restablecimiento de contraseña y gestión de usuarios.

## 🚀 Características

- **Registro de Usuarios** - Crear nuevas cuentas con verificación de email
- **Verificación de Email** - Verificación segura de email usando códigos únicos
- **Inicio de Sesión** - Sistema de autenticación basado en JWT
- **Restablecimiento de Contraseña** - Solicitar y restablecer contraseñas vía email
- **Gestión de Usuarios** - Operaciones CRUD completas para perfiles de usuario
- **Rutas Protegidas** - Protección de rutas mediante middleware con JWT
- **Servicio de Email** - Integración con Nodemailer para notificaciones por email
- **Base de Datos PostgreSQL** - Persistencia de datos confiable con Sequelize ORM
- **Seguridad de Tipos** - Implementación completa en TypeScript para mejor calidad de código

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v16 o superior)
- [pnpm](https://pnpm.io/) (v10.22.0 o superior)
- [PostgreSQL](https://www.postgresql.org/) (v15 o superior)
- [Docker](https://www.docker.com/) (opcional, para base de datos en contenedor)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd academlo-auth
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en el directorio raíz:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de Base de Datos (Desarrollo Local)
DB_NAME=auth_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Configuración de Base de Datos (Producción)
# DATABASE_URL=postgresql://usuario:contraseña@host:puerto/basedatos

# Configuración JWT
JWT_SECRET=tu-clave-secreta-jwt-super-segura-cambiar-en-produccion

# Configuración de Cookies
COOKIE_SECRET=tu-clave-secreta-de-cookies

# Configuración de Email
GOOGLE_APP_PASSWORD=tu-contraseña-de-aplicacion-google

# URL del Frontend (para enlaces en emails)
FRONTEND_URL=http://localhost:3000
```

### 4. Iniciar la Base de Datos PostgreSQL

**Opción A: Usando Docker (Recomendado)**

```bash
docker-compose up -d
```

**Opción B: PostgreSQL Local**

Asegúrate de que tu servicio PostgreSQL esté ejecutándose y crea la base de datos:

```sql
CREATE DATABASE auth_db;
```

### 5. Ejecutar el servidor de desarrollo

```bash
pnpm dev
```

La API estará disponible en `http://localhost:3000`

## 📚 Endpoints de la API

### Endpoints de Autenticación

#### Registrar un Nuevo Usuario
```http
POST /users
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseñaSegura123",
  "country": "México",
  "image": "https://ejemplo.com/avatar.jpg"
}
```

#### Verificar Email
```http
GET /users/verify/:code
```

#### Iniciar Sesión
```http
POST /users/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "contraseñaSegura123"
}
```

**Respuesta:**
```json
{
  "user": {
    "id": 1,
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com",
    "isVerify": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Obtener Perfil (Protegido)
```http
GET /users/me
Authorization: Bearer <tu-token-jwt>
```

#### Solicitar Restablecimiento de Contraseña
```http
POST /users/reset_password
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "frontBaseUrl": "http://localhost:3000/reset-password"
}
```

#### Restablecer Contraseña
```http
POST /users/reset_password/:code
Content-Type: application/json

{
  "password": "nuevaContraseñaSegura123"
}
```

### Endpoints de Gestión de Usuarios (Protegidos)

Todos estos endpoints requieren autenticación JWT mediante el header `Authorization: Bearer <token>`.

#### Obtener Todos los Usuarios
```http
GET /users
Authorization: Bearer <tu-token-jwt>
```

#### Obtener Usuario por ID
```http
GET /users/:id
Authorization: Bearer <tu-token-jwt>
```

#### Actualizar Usuario
```http
PUT /users/:id
Authorization: Bearer <tu-token-jwt>
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez Actualizado",
  "country": "España",
  "image": "https://ejemplo.com/nuevo-avatar.jpg"
}
```

#### Eliminar Usuario
```http
DELETE /users/:id
Authorization: Bearer <tu-token-jwt>
```

## 🏗️ Estructura del Proyecto

```
academlo-auth/
├── src/
│   ├── config/          # Archivos de configuración
│   │   ├── database.ts  # Conexión a la base de datos con Sequelize
│   │   └── smtp.ts      # Configuración del transporte de email
│   ├── controllers/     # Manejadores de peticiones
│   │   ├── authController.ts    # Lógica de autenticación
│   │   └── usersController.ts   # Operaciones CRUD de usuarios
│   ├── middlewares/     # Middleware personalizados
│   │   └── guardMiddleware.ts   # Guardia de autenticación JWT
│   ├── models/          # Modelos de Sequelize
│   │   ├── User.ts      # Modelo de Usuario
│   │   ├── EmailCode.ts # Modelo de código de verificación de email
│   │   └── index.ts     # Asociaciones de modelos
│   ├── routes/          # Rutas de la API
│   │   ├── index.ts     # Router principal
│   │   └── usersRoutes.ts # Rutas de usuarios
│   ├── utils/           # Funciones de utilidad
│   │   ├── jwt.ts       # Generación y verificación de JWT
│   │   └── password.ts  # Utilidades de hash de contraseñas
│   ├── app.ts           # Configuración de la aplicación Express
│   └── index.ts         # Punto de entrada de la aplicación
├── docker-compose.yml   # Configuración de Docker para PostgreSQL
├── package.json         # Dependencias y scripts del proyecto
├── tsconfig.json        # Configuración de TypeScript
└── README.md            # Documentación del proyecto
```

## 🔐 Características de Seguridad

- **Hash de Contraseñas**: Usa bcrypt con 10 rondas de salt para almacenamiento seguro de contraseñas
- **Autenticación JWT**: Autenticación segura basada en tokens con expiración de 5 minutos
- **Verificación de Email**: Previene acceso no autorizado hasta que el email sea verificado
- **Rutas Protegidas**: Guardias de middleware para proteger endpoints sensibles
- **Configuración CORS**: CORS configurable para peticiones de origen cruzado
- **Seguridad de Cookies**: Cookies firmadas para mayor seguridad

## 🗄️ Esquema de Base de Datos

### Tabla User (Usuario)
| Campo        | Tipo      | Descripción                    |
|--------------|-----------|--------------------------------|
| id           | INTEGER   | Clave primaria, auto-incremento |
| first_name   | STRING    | Nombre del usuario             |
| last_name    | STRING    | Apellido del usuario           |
| email        | STRING    | Dirección de email única       |
| password     | STRING    | Contraseña hasheada            |
| country      | STRING    | País del usuario               |
| image        | STRING    | URL de imagen de perfil        |
| isVerify     | BOOLEAN   | Estado de verificación de email|
| createdAt    | TIMESTAMP | Fecha de creación del registro |
| updatedAt    | TIMESTAMP | Fecha de última actualización  |

### Tabla EmailCode (Código de Email)
| Campo      | Tipo      | Descripción                      |
|------------|-----------|----------------------------------|
| id         | INTEGER   | Clave primaria, auto-incremento  |
| code       | STRING    | Código de verificación/restablecimiento |
| user_id    | INTEGER   | Clave foránea a User             |
| createdAt  | TIMESTAMP | Fecha de creación del registro   |
| updatedAt  | TIMESTAMP | Fecha de última actualización    |

## 📦 Scripts

```bash
# Modo desarrollo con recarga automática
pnpm dev

# Compilar TypeScript a JavaScript
pnpm build

# Iniciar servidor de producción
pnpm start

# Sincronizar base de datos (crea/actualiza tablas)
pnpm db:sync

# Poblar base de datos con datos iniciales
pnpm db:seed
```

## 🚀 Despliegue

### Configuración del Entorno

1. Establecer `NODE_ENV=production`
2. Configurar `DATABASE_URL` para tu base de datos de producción
3. Establecer valores fuertes para `JWT_SECRET` y `COOKIE_SECRET`
4. Configurar credenciales SMTP para el servicio de email
5. Actualizar `FRONTEND_URL` a la URL de tu frontend en producción

### Plataformas de Despliegue

#### Render.com (Recomendado)

1. Conecta tu repositorio de GitHub
2. Establece las variables de entorno en el panel de Render
3. Despliega automáticamente al hacer push a la rama principal

#### Heroku

```bash
heroku create nombre-de-tu-app
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

## 🧪 Pruebas

Prueba la API usando herramientas como:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (extensión de VS Code)

## 🛡️ Referencia de Variables de Entorno

| Variable              | Requerida | Descripción                                    |
|-----------------------|-----------|------------------------------------------------|
| PORT                  | No        | Puerto del servidor (por defecto: 3000)        |
| NODE_ENV              | No        | Modo de entorno (development/production)       |
| DB_NAME               | Sí*       | Nombre de la base de datos PostgreSQL          |
| DB_USER               | Sí*       | Nombre de usuario de PostgreSQL                |
| DB_PASSWORD           | Sí*       | Contraseña de PostgreSQL                       |
| DB_HOST               | Sí*       | Host de PostgreSQL                             |
| DB_PORT               | Sí*       | Puerto de PostgreSQL                           |
| DATABASE_URL          | Sí**      | Cadena de conexión completa a la BD (producción)|
| JWT_SECRET            | Sí        | Clave secreta para firmar JWT                  |
| COOKIE_SECRET         | Sí        | Clave secreta para firmar cookies              |
| GOOGLE_APP_PASSWORD   | Sí        | Contraseña de aplicación de Gmail              |
| FRONTEND_URL          | Sí        | URL de la aplicación frontend para enlaces     |

\* Requerida para desarrollo local  
\** Requerida para despliegue en producción

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/CaracteristicaIncreible`)
3. Haz commit de tus cambios (`git commit -m 'Agregar alguna CaracteristicaIncreible'`)
4. Haz push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado por el Equipo de Desarrollo Artiyx

## 📧 Soporte

Para soporte o preguntas, por favor contacta: artisandevx@gmail.com

---

**Nota**: Recuerda nunca hacer commit de tu archivo `.env` o exponer credenciales sensibles en tu repositorio. Siempre usa variables de entorno para configuración sensible.
