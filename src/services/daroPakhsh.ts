import * as puppeteer from 'puppeteer';
import * as captcha from 'async-captcha'
import * as moment from 'jalali-moment';
import { sleep } from './utilService';
import { parse } from 'node-html-parser';

class DaroPakhsh {

    constructor() {

        this.antiCaptcha = new captcha("b7620a21bad27627d4ddef6f62c6c72a", 2, 10);

    }

    antiCaptcha: any;

    public async getReport() {

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome'
        });
        try {

            const page = await browser.newPage();
            const pageResponce = await page.goto("http://panel.nokhbegandc.com/");
            await sleep(1);

            await page.waitFor('#imgCaptchaLogin');
            const elementHandler = await page.$("#imgCaptchaLogin");
            const base64String = await elementHandler.screenshot({ encoding: "base64" });

            const captchaCode = await this.antiCaptcha.getResult(base64String);

            await page.$eval('#LoginUserName', el => el.value = '');
            await page.$eval('#LoginPassword', el => el.value = '');
            await page.$eval('#LoginCaptchaText', (el, code) => el.value = code, captchaCode);
            const rememberMe = await page.$("#RememberMe");
            await rememberMe.click();

            const loginButton = await page.$("#login-user");
            await loginButton.click();

            await page.waitForNavigation();
            await sleep(10);

            const startDate = moment().format('jYYYY/jMM/1');
            const endDate = moment().format('jYYYY/jMM/jDD');
            await page.$eval("#ReportStartDate", (el, date) => el.value = date, startDate);
            await page.$eval("#ReportEndDate", (el, date) => el.value = date, endDate);
            await page.evaluate((i) => {

                document.getElementById('SearchBtn').click();

            })

            await sleep(5 * 60);

            const html = await page.$eval('#tblReport', e => e.innerHTML);
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