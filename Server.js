const express = require("express");
const dotenv = require("dotenv");
const router = require("./routers/index");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middleware/error/customErrorHandler");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config({
    path : "./config/env/config.env"
});

const PORT = process.env.PORT;

connectDatabase();

const app = express();

app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());
app.use(express.json());
app.use("/api",router);
app.use(customErrorHandler);

app.listen(PORT,()=>{
    console.log("başarıyla servere bağlandı PORT = "+PORT);
})
