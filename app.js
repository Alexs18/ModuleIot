let Express = require('express');
let app = Express();
let Axios = require('axios').default;
let Pool = require('./app/database/index');
let Cors = require('cors');

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
//setInterval(Getdata, 60000);

app.use(Express.json());
app.use(Cors())

async function login(req, res){
    debugger
    let {user, password} = req.body;
    debugger
    try {
        
        let {rows} = await Pool.query(`select * from iot.user 
        where usuario = '${user}'
            and
        contrasena = '${password}'`);

        if (rows.length <= 0) {
            res.send(false);
        }
        res.send(true)

    } catch (error) {
        console.log('el error del servicio');
        console.log(error);
        return {
            message:'ocurrio un error en el servidor'
        }
    }

}

app.post('/login', login); 

app.get('/get/mediciones/grupo3', async(req, res)=>{
    let {rows, rowCount} = await Pool.query('select * from iot.AguaSensor');
    res.json({
        cantidad:rowCount,
        data:rows,
        status:200
    })
})

app.listen(4001, ()=>{
    console.log('estamos corriendo en el 4001')
})