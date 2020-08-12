import * as request from 'request';
import * as moment from 'jalali-moment';
import daroPakhsh from './daroPakhsh';

class ScrapService {

    public constructor() { }

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

                await daroPakhsh.test();
                
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