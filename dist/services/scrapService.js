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
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const moment = require("jalali-moment");
const daroPakhsh_1 = require("./daroPakhsh");
const captcha = require("async-captcha");
class ScrapService {
    constructor() {
        this.antiCaptcha = new captcha("b7620a21bad27627d4ddef6f62c6c72a", 2, 10);
    }
    checkIsHoliday() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const today = moment().format("jYYYY-jMM-jDD");
                    const requestUrl = `https://pholiday.herokuapp.com/date/${today}`;
                    request(requestUrl, (error, response, body) => {
                        if (error) {
                            reject(false);
                        }
                        else {
                            const obj = JSON.parse(body);
                            const isHoliday = obj.isHoliday;
                            resolve(isHoliday);
                        }
                    });
                }
                catch (_a) {
                    reject(false);
                }
            });
        });
    }
    startScrap() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isHoliday = yield this.checkIsHoliday();
                if (!isHoliday) {
                    //await Nokhbegan.getReport(this.antiCaptcha);
                    yield daroPakhsh_1.default.getReport(this.antiCaptcha);
                }
            }
            catch (e) {
                console.log('error:', e);
                setTimeout(() => {
                    this.startScrap();
                }, 5 * 60 * 1000);
            }
        });
    }
}
exports.default = new ScrapService();
//# sourceMappingURL=scrapService.js.map