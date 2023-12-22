# Backend

## URL de la api

* ```https://e10rm1jli6.execute-api.us-east-1.amazonaws.com/dev-wot-backend/```.

## Documentación de la api con Swagger

* ```https://e10rm1jli6.execute-api.us-east-1.amazonaws.com/dev-wot-backend/api-doc/```.

## Requisitos

* ```Node.js v16.14```
* ```npm v8.19```
* ```MySQL v8.0```

## Comandos

* ```npm install```: Para instalar las dependencias.
* ```npm start```: Para iniciar el servidor.
* ```npm run dev```: Para iniciar el servidor en modo desarrollo.
* ```npm test```: Para ejecutar los tests.
* ```npm run db-init```: Para crear, migrar y poblar la base de datos.
* ```npm run db-migrate```: Para migrar la base de datos.

# Consideraciones para correr en local

* El puerto que corre el backend por defecto es el ```3000```.
* Se requiere crear un archivo ```.env``` en la raiz del proyecto, que contenga las variables especificadas en el archivo de ```.env.example```.
