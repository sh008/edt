"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const express = require("express");
const bodyparser = require("body-parser");
class App {
    constructor() {
        this.app = express();
        this.server = new http.Server(this.app);
        this.config();
    }
    config() {
        //set access
        this.app.use((req, res, next) => {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            // Pass to next layer of middleware
            next();
        });
        //set body parser for active form data use multer
        this.app.use(bodyparser.json());
        this.app.use(bodyparser.urlencoded({ extended: true }));
        //set router here
        this.app.use((err, req, res, next) => {
            //error handeling
        });
    }
}
exports.default = new App().server;
//# sourceMappingURL=app.js.map