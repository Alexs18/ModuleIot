const dotenv = require('dotenv').config()

module.exports = {
    SECRET_KEY:process.env.SECRET_KEY,
    PORT:process.env.PORT,
    USER:process.env.userdatabase,
    PASSWORD:process.env.passworddatabase,
    configDatabase:{
        port:process.env.PORT,
        database:process.env.DATABASE,
        host:process.env.HOST,
        user:process.env.USER,
        password:process.env.PASSWORD
    }
}
