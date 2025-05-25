# Imagen base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copiar archivos de definición
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir TypeScript (si usas TS)
RUN npm run build

# Añadir variable para Firebase
ARG GOOGLE_CREDENTIALS_B64
ENV GOOGLE_APPLICATION_CREDENTIALS=/config/serviceAccountKey.json

# Decodificar la clave desde Base64
RUN echo "$GOOGLE_CREDENTIALS_B64" | base64 -d > /config/serviceAccountKey.json

# Exponer el puerto (ajusta si usas otro)
EXPOSE 3000

# Comando para ejecutar el backend
CMD ["npm", "start"]
