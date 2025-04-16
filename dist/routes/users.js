"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const config_1 = require("../config");
const middleware_1 = require("../middleware");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
});
userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        res.json({
            message: "User already exist / incorrect syntx"
        });
    }
    const existinguser = yield db_1.Usermodel.findOne({
        username: req.body.username
    });
    if (existinguser) {
        res.json({
            message: "User Already exist"
        });
    }
    const user = yield db_1.Usermodel.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });
    yield db_1.Accountmodel.create({
        userId: user._id,
        balance: 1 + Math.random() * 10000
    });
}));
const signinschema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sucess } = signinschema.safeParse(req.body);
    if (!sucess) {
        res.json({
            message: "Email already exist"
        });
    }
    const user = yield db_1.Usermodel.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, config_1.JWT_PASSWORD);
        res.json({
            token: token
        });
    }
    res.json({
        message: "Error while SignIn in!"
    });
}));
const updateuser = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
});
userRouter.put("/", middleware_1.Authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = updateuser.safeParse(req.body);
    if (!success) {
        res.json({
            message: "Error while updating information"
        });
    }
    try {
        yield db_1.Usermodel.updateOne(
        //@ts-ignore
        { userId: req.userId }, { $set: req.body });
        res.json({
            message: "user Information Updated!"
        });
    }
    catch (e) {
        res.json({
            message: "Server error while updating"
        });
    }
}));
userRouter.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    const users = yield db_1.Usermodel.find({
        $or: [{
                firstname: {
                    "$regex": filter
                }
            }, {
                lastname: {
                    "$regex": filter
                }
            }]
    });
    res.json({
        user: users ? users.map((user) => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        })) : []
    });
}));
