import * as puppeteer from 'puppeteer';
import * as moment from 'jalali-moment';
import { sleep } from './utilService';
import { parse } from 'node-html-parser';

class DaroPakhsh {

    constructor() { }

    public async getReport(antiCaptcha: any) {

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome'
        });
        try {

            const page = await browser.newPage();
            const pageResponce = await page.goto("http://report.dpdcir.com/");
            await sleep(1);

            await page.waitFor('#captcha');
            const elementHandler = await page.$(".normalText");
            const base64String = await page.screenshot({ encoding: "base64" });

            //const captchaCode = await antiCaptcha.getResult(base64String);

            await page.$eval('#LoginUserName', el => el.value = '');
            await page.$eval('#LoginPassword', el => el.value = '');
            //await page.$eval('input[name="answer"]', (el, code) => el.value = code, captchaCode);

            const loginButton = await page.$("input[name='submit']");
            await loginButton.click();

            await page.waitForNavigation();
            await sleep(10);

            await page.goto("http://report.dpdcir.com/main/report_02.php");
            await sleep(10);

            await page.$eval("#CompanyCode", (el) => el.value == 264);

            const startDate = moment().format('jYYYYjMM1');
            const endDate = moment().format('jYYYYjMMjDD');
            await page.$eval("#AzTarikh", (el, date) => el.value = date, startDate);
            await page.$eval("#TaTarikh", (el, date) => el.value = date, endDate);
            const generateReportBtn = await page.$("input[name='submit_f']");
            await generateReportBtn.click();

            await sleep(1 * 60);

            const html = await page.$eval('.subBox', e => e.innerHTML);
            const obj = parse(html)

            const allrows = obj.querySelectorAll('tr');
            for (let i = 0; i < allrows.length; i++) {

                const allcol = i ? allrows[i].querySelectorAll('td') : allrows[i].querySelectorAll('th');
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

export default new DaroPakhsh();