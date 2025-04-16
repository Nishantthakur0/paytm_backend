import express from "express"

import { Accountmodel, Usermodel } from "../db";
import { JWT_PASSWORD } from "../config";
import { Authmiddleware } from "../middleware";
const jwt = require("jsonwebtoken")
const zod = require("zod");
const userRouter = express.Router()
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
})
userRouter.post('/signup', async (req,res)=>{
    const {success} = signupSchema.safeParse(req.body);
    if (!success) {
        res.json({
            message: "User already exist / incorrect syntx"
        })
    }
    const existinguser = await Usermodel.findOne({
        username: req.body.username
    })
    if (existinguser){
        res.json({
            message: "User Already exist"
        })
    }
    const user = await Usermodel.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    })
   

    await Accountmodel.create({
        userId: user._id,
        balance: 1 + Math.random()* 10000

    })
})
const signinschema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})


const updateuser = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
})
userRouter.put("/",Authmiddleware,async (req,res) => {
    const {success} = updateuser.safeParse(req.body);
    if (! success) {
        res.json({
            message: "Error while updating information"
        })
    }
    try{
        await Usermodel.updateOne(
            //@ts-ignore
            {userId: req.userId},
            {$set:req.body}
        )
        res.json({
            message: "user Information Updated!"
        })

    }catch(e){
        res.json({
            message: "Server error while updating"
        })
    }
    
})
userRouter.get("/bulk",async (req,res) => {
    const filter = req.query.filter || "";
    const users = await Usermodel.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        },{
            lastname: {
                "$regex": filter
            }
        }]
        
    })
    res.json({
        user: users ? users.map((user) => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
           
        })) : []
    })
})

export {userRouter};