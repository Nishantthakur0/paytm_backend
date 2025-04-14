import express, { Request, Response,NextFunction } from "express";
import { JWT_PASSWORD } from "./config";
const jwt = require("jsonwebtoken");
export const Authmiddleware = (req: Request,res: Response,next: NextFunction) => {
    const header = req.header("Authorization");
    const decoded = jwt.verify(header as string , JWT_PASSWORD)
    if (decoded){
        //@ts-ignore
        req.userId = decoded.id;
    }else{
        res.json({
            message: "User does not exist"
        })
    }
}