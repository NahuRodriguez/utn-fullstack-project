# Plataforma de E-Commerce para Equipos Informáticos - Back-end

## Pre-requisitos
[Node.js](https://nodejs.org/en) instalado globalmente

Alojamiento de [MongoDB](https://www.mongodb.com/)

Registro en API de [Cloudinary](https://cloudinary.com/)

## Configuración Inicial
1. Clonar repositorio

2. Instalar dependencias en subdirectorio backend/ <br/>
```npm install```

3. Correr el script de despliegue o el de desarrollo (refresco automático al modificar archivos) <br/>
```npm run start``` o ```npm run dev```

### Creación de un .ENV
Variables esperadas


```MONGO_URI```: String de conexión a MongoDB, de la forma ```mongodb+srv://<USUARIO_MONGODB>:<CONTRASEÑA>@<HOST_MONGODB>```. Especificado en la [documentación de MongoDB](https://www.mongodb.com/docs/manual/reference/connection-string/)

```CLOUDINARY_CLOUD_NAME```, ```CLOUDINARY_API_KEY```, ```CLOUDINARY_API_SECRET```: Como se especifican en la [documentación de Cloudinary](https://cloudinary.com/documentation/image_upload_api_reference#basic_authentication)

```PORT``` (<u>opcional</u>): Puerto en el que correr el servidor. De no especificarse, se corre en el puerto 3000.


## Testing
En el subdirectorio testing/ se encuentra una colección de [Bruno](https://www.usebruno.com/) que contiene todos los endpoints a los que responde el servidor. Se pueden modificar los cuerpos JSON para endpoints que requieran un body para la request.

## Evidencia de funcionamiento
<table>
    <tr>
        <td>
            GET Product
        </td>
        <td>
            <img alt="GET Product" src="../assets/img/Evidencia de funcionamiento de endpoints/GET Product.png"/>
        </td>
    </tr>
    <tr>
        <td>
            GET Product by id
        </td>
        <td>
            <img alt="GET Product by id" src="../assets/img/Evidencia de funcionamiento de endpoints/GET Product by id.png"/>
        </td>
    </tr>
    <tr>
        <td>
            POST OrderItem
        </td>
        <td>
            <img alt="POST OrderItem" src="../assets/img/Evidencia de funcionamiento de endpoints/POST OrderItem.png"/>
        </td>
    </tr>
    <tr>
        <td>
            PUT User by id
        </td>
        <td>
            <img alt="PUT User by id" src="../assets/img/Evidencia de funcionamiento de endpoints/PUT User by id.png"/>
        </td>
    </tr>
    <tr>
        <td>
            DELETE Order by id
        </td>
        <td>
            <img alt="DELETE Order by id" src="../assets/img/Evidencia de funcionamiento de endpoints/DELETE Order by id.png"/>
        </td>
    </tr>
</table>