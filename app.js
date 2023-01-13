let Express = require('express');
let app = Express();
let {createServer} = require('http')
let Axios = require('axios').default;
let Pool = require('./app/database/index');
let cors = require('cors');
let {Server} = require('socket.io')

let URI = 'https://industrial.api.ubidots.com/api/v1.6/devices/e8db84e11c61/tds/lv??token=BBFF-WQmASNccF8EgISIXtWYqOOeHa5UFq0'



app.use(Express.json());
app.use(cors());
let ServerHttp = createServer(app);
let io = new Server(ServerHttp, {
    cors: {
        // origin: "https://sparks-iot.com",
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});


io.on("connection", (socket)=>{

    socket.on('chat',(msg)=>{
        var cantidadanterior;
        console.log('cantidad');
        console.log(cantidadanterior);
        setInterval(async()=>{
            let {rows, rowCount} = await Pool.query('select * from iot.AguaSensor');
            console.log('la cantidad 2');
            console.log(rowCount);
            if (cantidadanterior === rowCount) {
                return
            }
            cantidadanterior = rowCount;
            io.emit('chat2', rows);
        }, 1000)
        console.log(`el mensaje ${msg}`);
        // while (true) {
        // }
        for (let index = 0; index <=100; index++) {
            // const element = array[index];
        }
    });
})

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
// setInterval(Getdata, 1000);

async function login(req, res){
    let {user, password} = req.body;
    try {
        
        let {rows} = await Pool.query(`select * from iot.user 
        where usuario = '${user}'
            and
        contrasena = '${password}'`);

        if (rows.length <= 0) {
            res.send(false);
        }else{
            res.send(true); 
        }

    } catch (error) {
        console.log('el error del servicio');
        console.log(error);
        return {
            message:'ocurrio un error en el servidor'
        }
    }

}

var IntervloID;
async function CorreroPararMediciones(req,res){

    let {boleano} = req.params;
    console.log('boleano');
    if (boleano === 'false') {
        clearInterval(IntervloID)
        return res.json({message:'acabamos de parar la medicion en tiempo real', icon:'warning'})
    }
    if (boleano === 'true') {
        
        IntervloID = setInterval(Getdata, 1000);
        res.json({message:'comenamos las mediones', icon:'success'})
        
    }
}

async function ObtenerDatos(req, res){
    let {rows, rowCount} = await Pool.query('select * from iot.AguaSensor');
    res.json({
        cantidad:rowCount,
        data:rows,
        status:200
    })
}
app.post('/login', login); 

app.get('/get/mediciones/grupo3', ObtenerDatos)

app.get('/mediciones/:boleano', CorreroPararMediciones);

ServerHttp.listen(4001, ()=>{
    console.log('estamos corriendo en el 4001')
})