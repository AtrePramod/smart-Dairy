const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Route Imports
const user = require("./Routes/UserRoutes");
const milk = require("./Routes/MilkRoutes");
const cust = require("./Routes/CustomerRoutes");
const emp = require("./Routes/EmpRoutes");
const purchase = require("./Routes/PurchaseRoutes");
const dairy = require("./Routes/DairyRoutes");
const notify = require("./Routes/fireBaseRoutes");
const sale = require("./Routes/SaleRoutes");
const item = require("./Routes/ItemRoutes");
const stock = require("./Routes/ItemStockMaster");

//Common api starting

app.use("/smartdairy/api", user);
app.use("/smartdairy/api", milk);
app.use("/smartdairy/api", cust);
app.use("/smartdairy/api", emp);
app.use("/smartdairy/api", purchase);
app.use("/smartdairy/api", dairy);
app.use("/smartdairy/api", notify);
app.use("/smartdairy/api", sale);
app.use("/smartdairy/api", item);
app.use("/smartdairy/api", stock);

module.exports = app;
