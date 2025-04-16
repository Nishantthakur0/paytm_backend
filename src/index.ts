
import express, { Request, Response } from "express";
import mainrouter from "./routes/index";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

const router = express.Router()




app.use("/api/v1",mainrouter);
module.exports = router;



app.listen(3000);