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
class Shafa {
    constructor() { }
    getReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer.launch({
                headless: false,
                executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome',
                defaultViewport: false
            });
            try {
                const page = yield browser.newPage();
                const pageResponce = yield page.goto("http://shafaarad.com:8082/");
                yield utilService_1.sleep(1);
                yield page.waitFor('#txtUserName');
                yield page.$eval('#txtUserName', el => el.value = 'ideh');
                yield page.$eval('#txtPassword', el => el.value = 'dt@9012');
                const loginButton = yield page.$(".btn-auth");
                yield loginButton.click();
                yield page.waitForNavigation();
                yield page.goto('http://shafaarad.com:8082/ReportSaleAndRemainByProduct/Index');
                // await page.evaluate(() => {
                //     (document as any).querySelector("a[data-link-text='فروش و موجودی کالا']").click()
                // });
                yield utilService_1.sleep(20);
                const startDate = moment().format('jYYYY/jMM/1');
                yield page.evaluate((startDate) => {
                    // let iframe = (document as any).getElementsByTagName('iframe')[1];
                    // let iframeContent = iframe.contentDocument || iframe.contentWindow.document;
                    document.querySelector("input[name='FromDate']").value = startDate;
                    document.querySelector("button").click();
                }, startDate);
                yield utilService_1.sleep(1 * 60);
                const html = yield page.$eval('#mainTbody', e => e.innerHTML);
                // const html = await page.evaluate((startDate) => {
                //     let iframe = (document as any).getElementsByTagName('iframe')[1];
                //     let iframeContent = iframe.contentDocument || iframe.contentWindow.document;
                //     const html = iframeContent.querySelector("#mainTbody");
                //     return html;
                // }, startDate)
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
exports.default = new Shafa();
//# sourceMappingURL=shafa.js.map