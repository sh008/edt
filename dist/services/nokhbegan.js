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
const puppeteer = require("puppeteer");
const moment = require("jalali-moment");
const utilService_1 = require("./utilService");
const node_html_parser_1 = require("node-html-parser");
class Nokhbegan {
    constructor() { }
    getReport(antiCaptcha) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer.launch({
                headless: false,
                executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome'
            });
            try {
                const page = yield browser.newPage();
                const pageResponce = yield page.goto("http://panel.nokhbegandc.com/");
                yield utilService_1.sleep(1);
                yield page.waitFor('#imgCaptchaLogin');
                const elementHandler = yield page.$("#imgCaptchaLogin");
                const base64String = yield elementHandler.screenshot({ encoding: "base64" });
                const captchaCode = yield antiCaptcha.getResult(base64String);
                yield page.$eval('#LoginUserName', el => el.value = '');
                yield page.$eval('#LoginPassword', el => el.value = '');
                yield page.$eval('#LoginCaptchaText', (el, code) => el.value = code, captchaCode);
                const rememberMe = yield page.$("#RememberMe");
                yield rememberMe.click();
                const loginButton = yield page.$("#login-user");
                yield loginButton.click();
                yield page.waitForNavigation();
                yield utilService_1.sleep(10);
                const startDate = moment().format('jYYYY/jMM/1');
                const endDate = moment().format('jYYYY/jMM/jDD');
                yield page.$eval("#ReportStartDate", (el, date) => el.value = date, startDate);
                yield page.$eval("#ReportEndDate", (el, date) => el.value = date, endDate);
                yield page.evaluate(() => {
                    document.getElementById('SearchBtn').click();
                });
                yield utilService_1.sleep(5 * 60);
                const html = yield page.$eval('#tblReport', e => e.innerHTML);
                const obj = node_html_parser_1.parse(html);
                const allrows = obj.querySelectorAll('tr');
                for (let i = 0; i < allrows.length; i++) {
                    const allcol = i ? allrows[i].querySelectorAll('td') : allrows[i].querySelectorAll('th');
                    for (let col of allcol) {
                        console.log(col.text);
                    }
                }
                //save Data;
                yield browser.close();
            }
            catch (error) {
                yield browser.close();
                throw (error);
            }
        });
    }
}
exports.default = new Nokhbegan();
//# sourceMappingURL=nokhbegan.js.map