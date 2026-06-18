# Documentación de Endpoints — PECEI API

Base URL: `http://localhost:3000` (configurable via `PORT` env var)

Formato: **JSON** siempre, excepto `POST /api/products` que usa `multipart/form-data`.

Autenticación: **Bearer Token** en header `Authorization: Bearer <token>`.

> **Nota**: `USER` puede acceder a sus propios recursos. `ADMIN` puede acceder a todos.

[`Ver hoja de calculo con los detalles de cada enpoint`](https://docs.google.com/spreadsheets/d/1PfpXrSNQFMZg5lG5m0StAFqtWYPPLhrVSqKvpLcLDYY/edit?usp=sharing)
---

## Índice de Rutas

| Recurso        | Ruta Base              |
|----------------|------------------------|
| Auth           | `/api/auth`            |
| Productos      | `/api/products`        |
| Usuarios       | `/api/users`           |
| Órdenes        | `/api/orders`          |
| Categorías     | `/api/categories`      |
| Direcciones    | `/api/addresses`       |

---

## 1. Auth (`/api/auth`)

### 1.1 Registro

```
POST /api/auth/register
```

**Body (JSON):**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com",
  "password": "123456",
  "phone": "+541112345678"
}
```

> `phone` es opcional.

**Response `201`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores:**
- `400` — Validación fallida (campos obligatorios, formato email inválido, password < 6 caracteres)
- `409` — `{ "error": "El email ya está registrado" }`
- `500` — Error interno

### 1.2 Login

```
POST /api/auth/login
```

**Body (JSON):**
```json
{
  "email": "juan@email.com",
  "password": "123456"
}
```

**Response `200`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores:**
- `400` — Validación fallida
- `401` — `{ "error": "Credenciales inválidas" }`
- `403` — `{ "error": "Usuario inactivo" }`
- `500` — Error interno

### 1.3 Solicitar recuperación de contraseña

```
POST /api/auth/forgot-password
```

**Body (JSON):**
```json
{
  "email": "juan@email.com"
}
```

**Response `200`** (siempre el mismo mensaje por seguridad)
```json
{
  "message": "Si el correo existe, recibirás instrucciones para recuperar tu contraseña."
}
```

> Si el email existe y el usuario está activo, se envía un email con un link de recuperación (válido 15 minutos).

### 1.4 Restablecer contraseña

```
POST /api/auth/reset-password/:token
```

**Parámetros URL:**
| Parámetro | Tipo   | Descripción                           |
|-----------|--------|---------------------------------------|
| token     | string | Token recibido por email (32 bytes hex) |

**Body (JSON):**
```json
{
  "password": "nueva123"
}
```

**Response `200`**
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

**Errores:**
- `400` — `{ "error": "Token inválido o expirado" }`
- `400` — `{ "error": "La contraseña debe tener al menos 6 caracteres" }`

---

## 2. Productos (`/api/products`)

### 2.1 Obtener todos los productos

```
GET /api/products
```

**Query Parameters (opcionales):**

| Parámetro | Tipo   | Default     | Descripción                                     |
|-----------|--------|-------------|-------------------------------------------------|
| page      | number | 1           | Número de página                                |
| limit     | number | 10          | Resultados por página (máx 100)                 |
| sort      | string | (ninguno)   | Orden: `name-asc`, `name-desc`, `price-asc`, `price-desc`, `stock-desc` |
| category  | string | (ninguno)   | ID de categoría para filtrar                    |
| search    | string | (ninguno)   | Búsqueda case-insensitive por nombre            |

**Response `200`**
```json
{
  "data": [
    {
      "id": "abc123...",
      "name": "Teclado Mecánico",
      "description": "Teclado RGB switches Cherry MX",
      "price": 45000,
      "stock": 25,
      "imgUrl": "https://res.cloudinary.com/.../image/upload/v1/...",
      "categories": [
        {
          "id": "cat123...",
          "name": "Periféricos",
          "description": "Teclados, mouses, auriculares",
          "createdAt": "...",
          "updatedAt": "..."
        }
      ],
      "createdBy": "user123...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

### 2.2 Obtener producto por ID

```
GET /api/products/:id
```

**Response `200`** — Mismo formato que `data[0]` arriba (sin wrapper).

**Errores:**
- `404` — `{ "mensaje": "Producto no encontrado" }`

### 2.3 Crear producto

```
POST /api/products
```

**Auth:** `ADMIN` (Bearer token)

**Content-Type:** `multipart/form-data`

| Campo        | Tipo     | Obligatorio | Descripción                       |
|--------------|----------|:-----------:|-----------------------------------|
| name         | string   | Sí          | Nombre del producto               |
| price        | number   | Sí          | Precio (≥ 0)                      |
| stock        | number   | Sí          | Stock entero (≥ 0)                |
| categories[] | string[] | Sí          | Array de IDs de categoría         |
| description  | string   | No          | Descripción                       |
| image        | file     | Sí          | Archivo de imagen (máx 5MB)       |

> Los arrays se envían como `categories[]=id1&categories[]=id2` en form-data.

**Response `201`**
```json
{
  "mensaje": "Producto creado con éxito",
  "data": { "...formato producto..." }
}
```

### 2.4 Modificar producto

```
PUT /api/products/:id
```

**Auth:** `ADMIN` (Bearer token)

**Body (JSON):** cualquier campo del producto (todos opcionales).

**Response `200`**
```json
{
  "mensaje": "Producto actualizado",
  "data": { "...formato producto..." }
}
```

### 2.5 Eliminar producto (soft-delete)

```
DELETE /api/products/:id
```

**Auth:** `ADMIN` (Bearer token)

**Response `200`**
```json
{
  "mensaje": "Producto eliminado"
}
```

### 2.6 Restaurar producto

```
PATCH /api/products/restore/:id
```

**Auth:** `ADMIN` (Bearer token)

**Response `200`**
```json
{
  "mensaje": "Producto restaurado"
}
```

---

## 3. Usuarios (`/api/users`)

### 3.1 Obtener todos los usuarios

```
GET /api/users
```

**Auth:** `ADMIN`

**Response `200`**
```json
[
  {
    "id": "user123...",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@email.com",
    "phone": "+541112345678",
    "role": "USER",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

> `password` nunca se incluye en respuestas.

### 3.2 Obtener usuario por ID

```
GET /api/users/:id
```

**Auth:** `USER` (propio ID) o `ADMIN`

**Errores:**
- `403` — `{ "message": "Acceso denegado" }` (si no es su ID ni admin)

### 3.3 Crear usuario

```
POST /api/users
```

**Auth:** `ADMIN`

**Body (JSON):** mismo formato que register.

> El campo `role` se forza a `"USER"`.

### 3.4 Modificar usuario

```
PUT /api/users/:id
```

**Auth:** `USER` (propio ID) o `ADMIN`

> Solo `ADMIN` puede cambiar el campo `role`.

### 3.5 Eliminar usuario (soft-delete)

```
DELETE /api/users/:id
```

**Auth:** `ADMIN`

### 3.6 Restaurar usuario

```
PATCH /api/users/restore/:id
```

**Auth:** `ADMIN`

---

## 4. Órdenes (`/api/orders`)

### 4.1 Obtener todas las órdenes

```
GET /api/orders
```

**Auth:** `ADMIN`

**Response `200`**
```json
[
  {
    "id": "ord123...",
    "userId": "user123...",
    "addressId": { "...objeto dirección..." },
    "items": [
      {
        "productId": { "...objeto producto..." },
        "quantity": 2,
        "priceAtPurchase": 45000
      }
    ],
    "total": 90000,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### 4.2 Obtener orden por ID

```
GET /api/orders/:id
```

**Auth:** `USER` (propietario) o `ADMIN`

### 4.3 Obtener órdenes por usuario

```
GET /api/orders/user/:targetUserId
```

**Auth:** `USER` (propio ID) o `ADMIN`

### 4.4 Crear orden

```
POST /api/orders
```

**Auth:** `USER` (cualquier usuario autenticado)

**Body (JSON):**
```json
{
  "addressId": "addr123...",
  "items": [
    { "productId": "prod123...", "quantity": 2 },
    { "productId": "prod456...", "quantity": 1 }
  ]
}
```

> El backend calcula `priceAtPurchase` y `total` automáticamente con los precios actuales de los productos. También descuenta el stock.

**Response `201`**
```json
{
  "id": "ord123...",
  "userId": "user123...",
  "addressId": "addr123...",
  "items": [...],
  "total": 135000,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Errores:**
- `400` — `{ "error": "El producto X no tiene suficiente stock disponible" }`
- `404` — `{ "error": "Dirección no encontrada" }` o `{ "error": "Uno de los productos seleccionados no existe" }`

### 4.5 Eliminar orden (soft-delete)

```
DELETE /api/orders/:id
```

**Auth:** `ADMIN`

### 4.6 Restaurar orden

```
PATCH /api/orders/restore/:id
```

**Auth:** `ADMIN`

---

## 5. Categorías (`/api/categories`)

### 5.1 Obtener todas las categorías

```
GET /api/categories
```

**No requiere auth**

**Response `200`**
```json
[
  {
    "id": "cat123...",
    "name": "Periféricos",
    "description": "Teclados, mouses, auriculares",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### 5.2 Obtener categoría por ID

```
GET /api/categories/:id
```

### 5.3 Crear categoría

```
POST /api/categories
```

**Auth:** `ADMIN`

**Body (JSON):**
```json
{
  "name": "Monitores",
  "description": "Pantallas y monitores"
}
```

> `name` es único.

### 5.4 Modificar categoría

```
PUT /api/categories/:id
```

**Auth:** `ADMIN`

### 5.5 Eliminar categoría (soft-delete)

```
DELETE /api/categories/:id
```

**Auth:** `ADMIN`

> No se puede eliminar si hay productos que la referencian.

### 5.6 Restaurar categoría

```
PATCH /api/categories/restore/:id
```

**Auth:** `ADMIN`

---

## 6. Direcciones (`/api/addresses`)

### 6.1 Obtener todas las direcciones

```
GET /api/addresses
```

**Auth:** `ADMIN`

### 6.2 Obtener dirección por ID

```
GET /api/addresses/:id
```

**Auth:** `USER` (propietario) o `ADMIN`

### 6.3 Obtener direcciones por usuario

```
GET /api/addresses/user/:targetUserId
```

**Auth:** `USER` (propio ID) o `ADMIN`

### 6.4 Crear dirección

```
POST /api/addresses
```

**Auth:** `USER`

**Body (JSON):**
```json
{
  "province": "Buenos Aires",
  "city": "La Plata",
  "postalCode": "1900",
  "streetName": "Calle 50",
  "buildingNumber": 123,
  "addressDetails": "3° B"
}
```

> `addressDetails` es opcional. `userId` se obtiene del token automáticamente.

**Response `201`**
```json
{
  "id": "addr123...",
  "userId": "user123...",
  "province": "Buenos Aires",
  "city": "La Plata",
  "postalCode": "1900",
  "streetName": "Calle 50",
  "buildingNumber": 123,
  "addressDetails": "3° B",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 6.5 Eliminar dirección (soft-delete)

```
DELETE /api/addresses/:id
```

**Auth:** `USER` (propietario) o `ADMIN`

### 6.6 Restaurar dirección

```
PATCH /api/addresses/restore/:id
```

**Auth:** `ADMIN`

---

## Códigos de Error HTTP

| Código | Significado                    |
|--------|--------------------------------|
| 200    | Éxito (GET, PUT)               |
| 201    | Recurso creado (POST)          |
| 400    | Error de validación            |
| 401    | Token requerido o inválido     |
| 403    | Acceso denegado por rol/permiso |
| 404    | Recurso no encontrado          |
| 409    | Conflicto (email duplicado)    |
| 500    | Error interno del servidor     |

---

## Formato de Errores de Validación

```json
{
  "status": "error",
  "errors": [
    { "field": "email", "message": "El email ingresado no es válido" },
    { "field": "password", "message": "El campo password es obligatorio" }
  ]
}
```

Para errores de validación de Mongoose:
```json
{
  "errors": {
    "email": {
      "message": "Not a valid email",
      ...
    }
  }
}
```