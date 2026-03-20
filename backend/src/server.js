// Load ENV variables
require("dotenv").config();

// Connect to MongoDB
const connectDB = require("./config/database");
connectDB();

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
