import express from "express"
import { Usermodel } from "../db";
import { JWT_PASSWORD } from "../config";
const jwt = require("jsonwebtoken")
const zod = require("zod");
const router = express.Router()

const signupSchema = zod.object({
    username: zod.string,
    password: zod.string,
    firstname: zod.string,
    lastname: zod.string
})
router.post('/signup', async (req,res)=>{
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
    const userId = user._id

    const token = jwt.sign({
        userId
    },JWT_PASSWORD);
    res.json({
        message: "User craeted",
        token: token
    })


})

module.exports = router;