import { Request, Response, Router } from "express";
import express from "express";
import { Accountmodel } from "../db"
import { Authmiddleware } from "../middleware"
import mongoose, { mongo } from "mongoose";
const accountRouter = express.Router()
interface CustomRequest extends Request {
    userId?: string;
}
accountRouter.get("/balance", Authmiddleware, async (req: Request, res: Response) => {
    const account = await Accountmodel.findOne({
        //@ts-ignore
        userId: req.userId,

    });

    res.json({
        balance: account ? account.balance : 0
    })
});  

accountRouter.post("/transfer", Authmiddleware, async (req: CustomRequest, res: Response) => {
    const session = await mongoose.startSession()
    session.startTransaction();
    
    const {to,amount} = req.body;
    const account = await Accountmodel.findOne({
        //@ts-ignore
        userId: req.userId
    }).session(session)
    if (!account || account.balance === undefined || account.balance === null || account.balance < amount ){
        await session.abortTransaction()
        res.json({
            message: "Insufficient Balance"
        });
        return;
    }
    const toaccount = await Accountmodel.findOne ({
        userId: to
    }).session(session)
    if(!toaccount){
        res.json({
            message: "Invalid Account"
        });
        return;
    }
        //@ts-ignore
        await Accountmodel.updateOne({userId: req.userId},{$inc: {balance: -amount}}).session(session)
        res.json({
            message: "Amount Transferred"
        });
        return;
    

   
    
})
export {accountRouter};