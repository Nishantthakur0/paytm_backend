"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const account_1 = require("./account");
const router = express_1.default.Router();
router.use("/users", users_1.userRouter);
router.use("/account", account_1.accountRouter);
exports.default = router;
