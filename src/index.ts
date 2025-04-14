import { Usermodel } from "./db";
import express, { Request, Response } from "express";
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const router = express.Router()

const mainrouter = require("./routes/index")


app.use("api/v1",mainrouter);
module.exports = router;



app.listen(3000);