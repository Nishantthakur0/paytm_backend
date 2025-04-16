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
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const accountRouter = express_1.default.Router();
exports.accountRouter = accountRouter;
accountRouter.get("/balance", middleware_1.Authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield db_1.Accountmodel.findOne({
        //@ts-ignore
        userId: req.userId,
    });
    res.json({
        balance: account ? account.balance : 0
    });
}));
accountRouter.post("/transfer", middleware_1.Authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const { to, amount } = req.body;
    const account = yield db_1.Accountmodel.findOne({
        //@ts-ignore
        userId: req.userId
    }).session(session);
    if (!account || account.balance === undefined || account.balance === null || account.balance < amount) {
        yield session.abortTransaction();
        res.json({
            message: "Insufficient Balance"
        });
        return;
    }
    const toaccount = yield db_1.Accountmodel.findOne({
        userId: to
    }).session(session);
    if (!toaccount) {
        res.json({
            message: "Invalid Account"
        });
        return;
    }
    //@ts-ignore
    yield db_1.Accountmodel.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    res.json({
        message: "Amount Transferred"
    });
    return;
}));
