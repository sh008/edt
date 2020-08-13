import * as request from 'request';
import * as moment from 'jalali-moment';
import Nokhbegan from './nokhbegan';
import DaroPakhsh from './daroPakhsh';
import Shafa from './shafa';
import * as captcha from 'async-captcha'

class ScrapService {

    public constructor() {

        this.antiCaptcha = new captcha("b7620a21bad27627d4ddef6f62c6c72a", 2, 10);

    }

    antiCaptcha:any;

    private async checkIsHoliday() {

        return new Promise((resolve, reject) => {

            try {

                const today = moment().format("jYYYY-jMM-jDD");
                const requestUrl = `https://pholiday.herokuapp.com/date/${today}`;

                request(requestUrl, (error, response, body) => {

                    if (error) {

                        reject(false);

                    } else {

                        const obj = JSON.parse(body);
                        const isHoliday = obj.isHoliday;

                        resolve(isHoliday);

                    }
                })

            } catch{

                reject(false);

            }

        })

    }

    public async startScrap() {

        try {

            const isHoliday = await this.checkIsHoliday();
            if(!isHoliday){

                //await Nokhbegan.getReport(this.antiCaptcha);
                await Shafa.getReport();
                
            }

        } catch (e) {

            console.log('error:', e);
            setTimeout(() => {
                
                this.startScrap();

            }, 5 * 60 *1000);
        }

    }


}

export default new ScrapService();