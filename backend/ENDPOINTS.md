### Overview
You are expected to set your own Destructive and Non-Destructive ID Environment Variables. They are meant to help you keep track of which Documents you're modifying and/or requesting (non-destructive) and deleting (destructive)

### Models
- Address --- A delivery address of several a User can have.
- Category --- A Category for the Products - a many to many relation.
- Product --- An item to be sold on the front-end store.
- User --- A User that will be able to place Orders for Products.
- Order --- A collection of Products with a linked Address and User, that tracks a sale's status.
- Order Item --- An entry for a Product in the corresponding Order. A Product's ID is unique in each Order. Embedded in the Order model.
- Payment --- The log of a transaction meant to cover part or the entirety of an Order's total price. If a Payment doesn't meet the Order's price, it is expected for the remaining debt to be sated by other Payments.

<table>
    <tr>
    <th>
        Model
    </th>
    <th>
        Fields
    </th>
    </tr>
    <tr>
    <td>
        Address
    </td>
    <td>
        <br/>
        userId: Reference to User, <u>required</u> <hr/>
        province, city, streetName: String, <u>required</u>, only allows alphanumeric with hispanic symbols & spaces (Ñ, tildes) <hr/>
        postalCode: String, <u>required</u>, only allows XXXX and X0000XXX formats (X for uppercase letter, 0 for number) <hr/>
        buildingNumber: Number, <u>required</u> <hr/>
        addressDetails: String, meant for a short user-made description <br/><br/>
    </td>
    </tr>
    <tr>
    <td>
        Category
    </td>
    <td>
        <br/>
        name: String, <u>required</u>, <u>unique</u> <hr/>
        description: String <br/><br/>
    </td>
    </tr>
    <tr>
    <td>
        Product
    </td>
    <td>
        <br/>
        name: String, <u>required</u> <hr/>
        price, stock: Number, <u>required</u>, don't allow negative values <hr/>
        description: String <hr/>
        imgUrl: String, expects a Cloudinary image upload URL <hr/>
        categories: String[], references to Category <hr/>
        createdBy: Reference to User, to be automated when authentication is added <br/><br/>
    </td>
    </tr>
    <tr>
    <td>
        User
    </td>
    <td>
        <br/>
        firstName, lastName: String, <u>required</u>, only allows alphanumeric with hispanic symbols & spaces (Ñ, tildes) <hr/>
        email: String, <u>required</u>, <u>unique</u>, expects an e-mail address complying with [user]@[host].[TLD] (TLD is 2 to 4 characters long, every field only allows alphanumeric & dashes, with the exception of user, which also allows periods) <hr/>
        password: String, <u>required</u>, can be PUT'd and POST'd but won't be in GET responses, expects an unhashed password (it gets hashed by the server) <hr/>
        phone: String, only allows Numbers & a leading +, no spaces or hyphens <hr/>
        isActive: Boolean, defaults to true <hr/>
        role: String, either "USER" or "ADMIN", defaults to "USER" <br/><br/>
    </td>
    </tr>
    <tr>
    <td>
        Order
    </td>
    <td>
        <br/>
        userId: Reference to User, <u>required</u> <hr/>
        addressId: Reference to Address, <u>required</u> <hr/>
        total: Number, <u>required</u>, doesn't allow negative values <hr/>
        items: Object[], expects: <br/>
        <li> productId: Reference to Product, <u>required</u> </li>
        <li> quantity, priceAtPurchase: Number, <u>required</u>, don't allow negative values </li> <hr/>
        status: String, either "PENDING", "SHIPPED" or "CANCELLED", defaults to "PENDING" <br/><br/>
    </td>
    </tr>
    <tr>
    <td>
        Order Item
    </td>
    <td>
        <br/>
        productId: Reference to Product, <u>required</u>, <u>unique</u> <hr/>
        quantity, priceAtPurchase: Number, <u>required</u>, don't allow negative values <br/><br/>
    </td>
    </tr>
    <tr>
    <td>
        Payment
    </td>
    <td>
        <br/>
        orderId: Reference to Order, <u>required</u> <hr/>
        amount: Number, <u>required</u>, doesn't allow negative values <br/><br/>
    </td>
    </tr>
</table>

### Endpoints
Every Model except for Order Item has 5 endpoints:
- **GET /** --- returns whole collection
- **GET /:id** --- returns Document with matching ID in collection
- **POST /** --- creates Document using JSON request body
- **PUT /:id** --- modifies Document with matching ID using JSON request body
- **DELETE /:id** --- deletes Document with matching ID

#### Order Item endpoints
- **POST /:orderId** --- creates Item in specified Order using JSON request body
- **PUT /:orderId/:productId** --- modifies Item with matching ID in specified Order using JSON request body
- **DELETE /:orderId/:productId** --- deletes Item with matching ID in specified Order

POST & PUT expect request bodies with the explained fields in Models section

### Routes
<table>
    <tr>
    <th>
        Model
    </th>
    <th>
        Route
    </th>
    </tr>
    <tr>
    <td>
        Address
    </td>
    <td>
        /api/addresses
    </td>
    </tr>
    <tr>
    <td>
        Category
    </td>
    <td>
        /api/categories
    </td>
    </tr>
    <tr>
    <td>
        Product
    </td>
    <td>
        /api/products
    </td>
    </tr>
    <tr>
    <td>
        User
    </td>
    <td>
        /api/users
    </td>
    </tr>
    <tr>
    <td>
        Order
    </td>
    <td>
        /api/orders
    </td>
    </tr>
    <tr>
    <td>
        Order Item
    </td>
    <td>
        /api/orders/items
    </td>
    </tr>
    <tr>
    <td>
        Payment
    </td>
    <td>
        /api/payments
    </td>
    </tr>
</table>

### Possible HTTP error codes
<table>
    <tr>
    <th>
        HTTP Method
    </th>
    <th>
        200 - On successful request
    </th>
    <th>
        400 - On invalid request
    </th>
    <th>
        404 - On document non-existence
    </th>
    <th>
        500 - On Internal Server Error
    </th>
    </tr>
    <tr>
    <th>
        GET /
    </th>
    <td>
        ✔
    </td>
    <td>
        ✖
    </td>
    <td>
        ✖
    </td>
    <td>
        ✔
    </td>
    </tr>
    <tr>
    <th>
        GET /:id
    </th>
    <td>
        ✔
    </td>
    <td>
        ✖
    </td>
    <td>
        ✔
    </td>
    <td>
        ✔
    </td>
    </tr>
    <tr>
    <th>
        POST /
    </th>
    <td>
        201
    </td>
    <td>
        ✔
    </td>
    <td>
        ✖
    </td>
    <td>
        ✔
    </td>
    </tr>
    <tr>
    <th>
        PUT /:id
    </th>
    <td>
        ✔
    </td>
    <td>
        ✔
    </td>
    <td>
        ✔
    </td>
    <td>
        ✔
    </td>
    </tr>
    <tr>
    <th>
        DELETE /:id
    </th>
    <td>
        ✔
    </td>
    <td>
        ✖
    </td>
    <td>
        ✔
    </td>
    <td>
        ✔
    </td>
    </tr>
</table>