import * as puppeteer from 'puppeteer';
import * as moment from 'jalali-moment';
import { sleep } from './utilService';
import { parse } from 'node-html-parser';

class DaroPakhsh {

    constructor() { }

    public async getReport(antiCaptcha: any) {

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome',
            defaultViewport: null
        });
        try {

            const page = await browser.newPage();
            const pageResponce = await page.goto("http://report.dpdcir.com/");
            await sleep(1);

            await page.waitFor('#captcha');
            const elementHandler = await page.$("#captcha");
            const bounding_box = await elementHandler.boundingBox();
            const base64String = await elementHandler.screenshot(
                { 
                    encoding: "base64",
                    clip: {
                        x: bounding_box.x,
                        y: bounding_box.y,
                        width: bounding_box.width,
                        height: bounding_box.height,
                      },
                });
            
            const captchaCode = await antiCaptcha.getResult(base64String);

            await page.$eval('input[name="username"]', el => el.value = 'edt424');
            await page.$eval('input[name="password"]', el => el.value = 'EDT@424@1398');
            await page.$eval('input[name="answer"]', (el, code) => el.value = code, captchaCode);

            const loginButton = await page.$("input[name='submit']");
            await loginButton.click();

            await page.waitForNavigation();
            await sleep(10);

            await page.goto("http://report.dpdcir.com/main/report_02.php");
            await sleep(10);

            const startDate = moment().format('jYYYYjMM01');
            const endDate = moment().format('jYYYYjMMjDD');

            await page.evaluate((startDate,endDate)=>{

                (document as any).getElementById("CompanyCode").value = 264;
                (document as any).getElementById("AzTarikh").value = startDate;
                //(document as any).getElementById("TaTarikh").value = endDate;

            },startDate,endDate);
            await sleep(1);

            const generateReportBtn = await page.$("input[name='submit_f']");
            await generateReportBtn.click();

            await sleep(1 * 60);

            const html = await page.$eval('.subBox', e => e.innerHTML);
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

export default new DaroPakhsh();