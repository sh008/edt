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
                executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome',
                defaultViewport: null
            });
            try {
                const page = yield browser.newPage();
                const pageResponce = yield page.goto("http://report.dpdcir.com/");
                yield utilService_1.sleep(1);
                yield page.waitFor('#captcha');
                const elementHandler = yield page.$("#captcha");
                const bounding_box = yield elementHandler.boundingBox();
                const base64String = yield elementHandler.screenshot({
                    encoding: "base64",
                    clip: {
                        x: bounding_box.x,
                        y: bounding_box.y,
                        width: bounding_box.width,
                        height: bounding_box.height,
                    },
                });
                const captchaCode = yield antiCaptcha.getResult(base64String);
                yield page.$eval('input[name="username"]', el => el.value = 'edt424');
                yield page.$eval('input[name="password"]', el => el.value = 'EDT@424@1398');
                yield page.$eval('input[name="answer"]', (el, code) => el.value = code, captchaCode);
                const loginButton = yield page.$("input[name='submit']");
                yield loginButton.click();
                yield page.waitForNavigation();
                yield utilService_1.sleep(10);
                yield page.goto("http://report.dpdcir.com/main/report_02.php");
                yield utilService_1.sleep(10);
                const startDate = moment().format('jYYYYjMM01');
                const endDate = moment().format('jYYYYjMMjDD');
                yield page.evaluate((startDate, endDate) => {
                    document.getElementById("CompanyCode").value = 264;
                    document.getElementById("AzTarikh").value = startDate;
                    //(document as any).getElementById("TaTarikh").value = endDate;
                }, startDate, endDate);
                yield utilService_1.sleep(1);
                const generateReportBtn = yield page.$("input[name='submit_f']");
                yield generateReportBtn.click();
                yield utilService_1.sleep(1 * 60);
                const html = yield page.$eval('.subBox', e => e.innerHTML);
                const obj = node_html_parser_1.parse(html);
                const allrows = obj.querySelectorAll('tr');
                for (let i = 0; i < allrows.length; i++) {
                    const allcol = allrows[i].querySelectorAll('td');
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