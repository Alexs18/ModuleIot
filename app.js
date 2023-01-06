let Express = require('express');
let app = Express();
let Axios = require('axios').default;
let Pool = require('./app/database/index');

let URI = 'https://industrial.api.ubidots.com/api/v1.6/devices/e8db84e11c61/tds/lv??token=BBFF-WQmASNccF8EgISIXtWYqOOeHa5UFq0'

async function Getdata(){
    
    try {
        let {data} = await Axios.get(URI);
        let Insersion = await Pool.query(`insert into iot.AguaSensor (ppm) values (${data}) returning id, tiempo, ppm`);
        console.log(Insersion.rows);
    } catch (error) {
        console.log('el error ');
        console.log(error);
    }
   
}
setInterval(Getdata, 5000);


app.listen(4001, ()=>{
    console.log('estamos corriendo en el 3000')
})