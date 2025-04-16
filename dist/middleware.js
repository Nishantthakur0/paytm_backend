"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authmiddleware = void 0;
const config_1 = require("./config");
const jwt = require("jsonwebtoken");
const Authmiddleware = (req, res, next) => {
    const header = req.header("Authorization");
    const decoded = jwt.verify(header, config_1.JWT_PASSWORD);
    if (decoded) {
        //@ts-ignore
        req.userId = decoded.id;
    }
    else {
        res.json({
            message: "User does not exist"
        });
    }
};
exports.Authmiddleware = Authmiddleware;
