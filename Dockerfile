
# Etapa de Desarrollo:
FROM node:19-alpine3.15 as dev
# cd app ---> nos movemos a este directorio
WORKDIR /app
# copìar ---> copia los archivos de mi proyecto al destino deseado (WORKDIR)
COPY package.json ./
# Instalar las dependencias
RUN yarn install
CMD [ "yarn","start:dev" ]

# Etapa 1: Dependencias de desarrollo
FROM node:19-alpine3.15 as dev-dependencies
# cd app ---> nos movemos a este directorio
WORKDIR /app
# copìar ---> copia los archivos de mi proyecto al destino deseado (WORKDIR)
COPY package.json ./
# Instalar las dependencias
RUN yarn install --frozen-lockfile


# Etapa 2: Build y Test
FROM node:19-alpine3.15 as builder
# cd app ---> nos movemos a este directorio
WORKDIR /app
# copiar modulos de node del stage anterior
COPY --from=dev-dependencies /app/node_modules ./node_modules
# copìar ---> copia todo el directorio
COPY . .
# Realizar testing
# RUN npm run test
# Realizar build de la aplicación
RUN yarn build


# Etapa 3: Dependencias de producción
FROM node:19-alpine3.15 as prod-dependencies
# cd app ---> nos movemos a este directorio
WORKDIR /app
# Copia del package.json
COPY package.json ./
# Únicamente las dependencias de prod
RUN yarn install --prod --frozen-lockfile


# Etapa 4: Ejecución de la app
FROM node:19-alpine3.15 as prod
# Se expone el puerto de la ejecución del programa
EXPOSE 3000
# cd app ---> nos movemos a este directorio
WORKDIR /app
# Creación de variable para definir versión de la aplicación correspondiente
ENV APP_VERSION=${APP_VERSION}
# copiar modulos de node del stage anterior
COPY --from=prod-dependencies /app/node_modules ./node_modules
# copiar archivos necesarios para la ejecución de la app en la imagen
COPY --from=builder /app/dist ./dist
# Comando run de la imagen
CMD [ "node","dist/main.js" ]