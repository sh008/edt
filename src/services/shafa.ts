import * as puppeteer from 'puppeteer';
import * as moment from 'jalali-moment';
import { sleep } from './utilService';
import { parse } from 'node-html-parser';

class Shafa {

    constructor() { }

    public async getReport() {

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome',
            defaultViewport: false
        });
        try {

            const page = await browser.newPage();
            const pageResponce = await page.goto("http://shafaarad.com:8082/");

            await sleep(1);
            await page.waitFor('#txtUserName');

            await page.$eval('#txtUserName', el => el.value = '');
            await page.$eval('#txtPassword', el => el.value = '');

            const loginButton = await page.$(".btn-auth");
            await loginButton.click();

            await page.waitForNavigation();

            await page.goto('http://shafaarad.com:8082/ReportSaleAndRemainByProduct/Index');

            // await page.evaluate(() => {

            //     (document as any).querySelector("a[data-link-text='فروش و موجودی کالا']").click()

            // });
            await sleep(20);

            const startDate = moment().format('jYYYY/jMM/1');

            await page.evaluate((startDate) => {

                // let iframe = (document as any).getElementsByTagName('iframe')[1];
                // let iframeContent = iframe.contentDocument || iframe.contentWindow.document;
                (document as any).querySelector("input[name='FromDate']").value = startDate;

                document.querySelector("button").click();

            }, startDate)

            await sleep(1 * 60);

            const html = await page.$eval('#mainTbody', e => e.innerHTML);
            // const html = await page.evaluate((startDate) => {

            //     let iframe = (document as any).getElementsByTagName('iframe')[1];
            //     let iframeContent = iframe.contentDocument || iframe.contentWindow.document;
            //     const html = iframeContent.querySelector("#mainTbody");

            //     return html;

            // }, startDate)

            const obj = parse(html)

            const allrows = obj.querySelectorAll('tr');
            for (let i = 0; i < allrows.length; i++) {

                const allcol = allrows[i].querySelectorAll('td');
                for (let col of allcol) {

                    console.log(col.text);

                }
            }

            //save Data;
            await browser.close();

        } catch (error) {

            await browser.close();
            throw (error);

        }

    }


}

export default new Shafa();