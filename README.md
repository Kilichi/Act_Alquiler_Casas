# Alquiler-Casas (1º DAW)

Proyecto sencillo de **frontend estático** + **API REST** para gestionar **usuarios** y **viviendas**.

## Estructura

- `backend/`: API en **Java (Spring Boot)** + **JPA**.
- `front/`: interfaz en **HTML/CSS/JavaScript** (sin framework).

## Requisitos

- **Java JDK 17** (importante: con un Java menor, el backend no compila).
- **Maven** (opcional, el proyecto incluye `./mvnw`).
- **MySQL o MariaDB**.
- Para el front: un servidor estático tipo **Live Server** (VSCode) o cualquier servidor HTTP simple.

## Configuración de base de datos

El backend lee la configuración desde:

- `backend/src/main/resources/application.properties`

Ahora mismo contiene valores “hardcodeados” (IP/usuario/contraseña). Debes ajustarlos a tu entorno:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`

## Cómo ejecutar

### 1) Backend (API)

Desde la raíz del repo:

```bash
cd backend
./mvnw spring-boot:run
```

La API arranca en `http://127.0.0.1:4050` (ver `server.port`).

Endpoints disponibles:

- `GET /users`
- `GET /users/{id}`
- `GET /viviendas`
- `GET /viviendas/{id}`

### 2) Front

Abre `front/index.html` con un servidor estático (por ejemplo Live Server).

Notas:

- El backend permite CORS para `http://localhost:5500` y `http://127.0.0.1:5500` (ver `backend/.../WebConfig.java`).
- Las peticiones del front apuntan a `http://127.0.0.1:4050`.

## Problemas típicos (y cómo solucionarlos)

- **El backend no compila**: revisa que estás usando **JDK 17** (`java -version`).
- **Error de conexión a BD**: revisa IP/puerto/credenciales en `application.properties` y que el servidor MySQL/MariaDB esté arrancado.
- **CORS / bloqueos del navegador**: abre el front con Live Server en el puerto 5500 (o ajusta los `allowedOrigins` del backend).

