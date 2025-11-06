# Dockerfile para FinanzApp - Vue + Vite
# Optimizado para Google Cloud Run

# Etapa 1: Build
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copia el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Servidor de producción
FROM nginx:alpine

# Crea la configuración de Nginx para SPA
RUN echo 'server {\n\
    listen 8080;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    # Configuración para SPA (Single Page Application)\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    # Cache para archivos estáticos\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
    \n\
    # Configuración de seguridad\n\
    add_header X-Frame-Options "SAMEORIGIN" always;\n\
    add_header X-Content-Type-Options "nosniff" always;\n\
    add_header X-XSS-Protection "1; mode=block" always;\n\
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;\n\
    \n\
    # Health check endpoint\n\
    location /health {\n\
        access_log off;\n\
        return 200 "healthy\\n";\n\
        add_header Content-Type text/plain;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Copia los archivos construidos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run usa el puerto 8080 por defecto
EXPOSE 8080

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]