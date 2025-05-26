# 🚀 Backend de Gestión de Tareas (API)

Este es el backend de la aplicación de gestión de tareas, construido con **Node.js** y **Express**, y desplegado como **Firebase Cloud Functions**. Proporciona la API RESTful necesaria para gestionar tareas (crear, leer, actualizar, eliminar, etc.) y se comunica con la base de datos de Firebase.

---

## 💻 Tecnologías Utilizadas

* **Node.js**: Entorno de ejecución JavaScript.
* **Express.js**: Framework web para construir APIs RESTful.
* **TypeScript**: Lenguaje de programación que añade tipado estático a JavaScript.
* **Firebase Cloud Functions**: Plataforma serverless para desplegar la lógica del backend.
* **Firebase Admin SDK**: Para interactuar con los servicios de Firebase (Firestore, Authentication, etc.).
* **ESLint**: Para el linting de código y mantener la calidad.
* **TypeScript Compiler (TSC)**: Para compilar el código TypeScript a JavaScript.

---

## ✨ Características de la API

Este backend expone varios *endpoints* para la gestión de tareas:

* **`GET /api/tasks`**: Obtener todas las tareas.
* **`GET /api/tasks/:userId`**: Obtener todas las tareas por usuario.
* **`GET /api/tasks/:id`**: Obtener una tarea específica por ID.
* **`POST /api/tasks`**: Crear una nueva tarea.
* **`PUT /api/tasks/:id`**: Actualizar una tarea existente.
* **`DELETE /api/tasks/:id`**: Eliminar una tarea.
* **`POST /api/auth/register`**: Registro de usuario.
* **`POST /api/auth/login`**: Inicio de sesión.

---

## 🛠️ Configuración y Ejecución Local

Sigue estos pasos para tener el backend funcionando en tu máquina local.

### **Prerrequisitos**

Antes de empezar, asegúrate de tener instalado lo siguiente:

* **Node.js** (versión 18 o superior recomendada) y **npm**.
* **Firebase CLI**: Instálalo globalmente si no lo tienes:
    ```bash
    npm install -g firebase-tools
    ```
* **Una cuenta de Firebase/Google Cloud** y un proyecto configurado.

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/arimadrid2000/task-app-backend.git
cd task-app-backend/functions # Asegúrate de entrar a la carpeta 'functions' donde está el código de las funciones
```

### **2. Instalar Dependencias**

Desde la carpeta `functions`:

```bash
npm install
```

### **3. Configuración del Entorno Local**

Para que el backend se conecte con tus servicios de Firebase (Firestore, Auth, etc.) en desarrollo local, necesitas proporcionar las credenciales de tu proyecto.

* **Descarga tu clave de cuenta de servicio:**
    1.  Ve a la [Consola de Firebase](https://console.firebase.google.com/) -> `Configuración del proyecto` -> `Cuentas de servicio`.
    2.  Haz clic en **"Generar nueva clave privada"** y descarga el archivo JSON. Nómbralo `serviceAccountKey.json`.
* **Coloca el archivo `serviceAccountKey.json`:**
    * Idealmente, crea una carpeta `config` dentro de la carpeta `functions` (ej. `functions/config/`) y coloca `serviceAccountKey.json` ahí.
    * Asegúrate de que tu código esté configurado para cargar esta clave desde esa ruta (ej. `admin.initializeApp({ credential: admin.credential.cert(require('../config/serviceAccountKey.json')) });`).

### **4. Ejecutar Localmente**

Desde la carpeta `functions`:

```bash
npm run build # Compila el código TypeScript
firebase emulators:start --only functions # Inicia el emulador de Cloud Functions
```

Esto iniciará tu API localmente, generalmente en una dirección como `http://localhost:5001/tu-project-id/us-central1/api`.

---

## 🚀 Despliegue en Firebase Cloud Functions

Este backend está diseñado para ser desplegado en Firebase Cloud Functions. El proceso de despliegue se automatiza a través de **GitHub Actions**.

### **Configuración Necesaria en GitHub Actions:**

1.  **Secreto de GitHub:**
    * En tu repositorio de backend en GitHub, ve a **`Settings > Secrets and variables > Actions`**.
    * Añade un nuevo secreto llamado **`GOOGLE_APPLICATION_CREDENTIALS`**.
    * El valor de este secreto debe ser el **contenido JSON completo** de tu archivo `serviceAccountKey.json` (el que descargaste de Firebase). **Asegúrate de copiarlo sin errores ni truncamientos.**

2.  **Roles de la Cuenta de Servicio:**
    * La cuenta de servicio asociada a tu clave debe tener los permisos adecuados en tu proyecto de Google Cloud. Asegúrate de que tenga los siguientes roles:
        * `Firebase Admin`
        * `Cloud Functions Admin`
        * `Cloud Build Editor`
        * `Service Account User`
        * `Storage Admin`
        * `Artifact Registry Administrator`
        * `Service Usage Admin` (para habilitar APIs si es necesario, aunque es mejor habilitarlas manualmente una vez).
    * Puedes verificar y ajustar estos roles en la [consola de Google Cloud](https://console.cloud.google.com/) en `IAM & Admin > Cuentas de servicio`.

3.  **APIs Habilitadas:**
    * Asegúrate de que las siguientes APIs estén habilitadas en tu proyecto de Google Cloud. Si no lo están, habilítalas manualmente desde la [Biblioteca de APIs](https://console.cloud.google.com/apis/library) de Google Cloud:
        * `Cloud Functions API`
        * `Cloud Build API`
        * `Artifact Registry API`
        * `Service Usage API`

Una vez configurado, cada `git push` a la rama `main` de este repositorio activará el workflow de GitHub Actions (`.github/workflows/backend-deploy.yml`) y desplegará tus funciones automáticamente.

---

## 📁 Estructura del Proyecto

```
task-app-backend/
├── functions/               # Carpeta principal de las Cloud Functions
│   ├── src/                 # Código fuente TypeScript
│   │   ├── index.ts         # Punto de entrada de la API Express
│   │   ├── domains/         # Definiciones de tipos (interfaces) para entidades como tareas y usuarios
│   │   ├── repositories/    # Lógica para interactuar directamente con fuentes de datos (ej. funciones para búsqueda, escritura en Firestore)
│   │   ├── routes/          # Definición de las rutas de la API
│   │   └── services/        # Lógica de negocio principal. Estas funciones utilizan los 'repositories' y son llamadas por las rutas.
│   ├── lib/                 # Salida de la compilación JavaScript
│   ├── config/              # (Opcional) Para serviceAccountKey.json en local
│   ├── .eslintrc.js         # Configuración de ESLint
│   ├── package.json         # Dependencias y scripts
│   ├── tsconfig.json        # Configuración de TypeScript
│   └── firebase.json        # Configuración de Firebase para funciones
├── .github/                 # Workflows de GitHub Actions
│   └── workflows/
│       └── backend-deploy.yml # Workflow para el despliegue automático
└── README.md                # Este archivo
```

---

## 🤝 Contribución

Si deseas contribuir a este proyecto, por favor, haz un "fork" del repositorio, crea una nueva rama para tus cambios y envía un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT).

---