const {Sequalize} = require('sequalize');
const dotenv = require('dontev');

dontev.config();

const sequalize = new Sequalize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host:process.env.DB_HOST, //El host que se va a usar
    dialect: 'postgres', //Idioma que se va a usar o bases de datos
    port: process.en.DB_PORT, //Puerto donde se va a trabajar
    logging: false, //Mensajes del SQL descativados en consola
    timezone: '-05:00' //Siempre se define con -5 horas por el diferente horiario
});

module.exports = sequalize;