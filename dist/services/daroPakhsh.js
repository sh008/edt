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
class DaroPakhsh {
    constructor() { }
    getReport(antiCaptcha) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer.launch({
                headless: false,
                executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome'
            });
            try {
                const page = yield browser.newPage();
                const pageResponce = yield page.goto("http://report.dpdcir.com/");
                yield utilService_1.sleep(1);
                yield page.waitFor('#captcha');
                const elementHandler = yield page.$(".normalText");
                const base64String = yield page.screenshot({ encoding: "base64" });
                //const captchaCode = await antiCaptcha.getResult(base64String);
                yield page.$eval('#LoginUserName', el => el.value = '');
                yield page.$eval('#LoginPassword', el => el.value = '');
                //await page.$eval('input[name="answer"]', (el, code) => el.value = code, captchaCode);
                const loginButton = yield page.$("input[name='submit']");
                yield loginButton.click();
                yield page.waitForNavigation();
                yield utilService_1.sleep(10);
                yield page.goto("http://report.dpdcir.com/main/report_02.php");
                yield utilService_1.sleep(10);
                yield page.$eval("#CompanyCode", (el) => el.value == 264);
                const startDate = moment().format('jYYYYjMM1');
                const endDate = moment().format('jYYYYjMMjDD');
                yield page.$eval("#AzTarikh", (el, date) => el.value = date, startDate);
                yield page.$eval("#TaTarikh", (el, date) => el.value = date, endDate);
                const generateReportBtn = yield page.$("input[name='submit_f']");
                yield generateReportBtn.click();
                yield utilService_1.sleep(1 * 60);
                const html = yield page.$eval('.subBox', e => e.innerHTML);
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
exports.default = new DaroPakhsh();
//# sourceMappingURL=daroPakhsh.js.map