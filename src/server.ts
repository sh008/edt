import app from './app';
import scrapService from './services/scrapService';

const port = process.env.PORT || 3500;

app.listen(port, ()=>{

    console.log(`express server running in port 3500`);
    scrapService.startScrap();

})