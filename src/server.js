const sequelize = require('./config/db');
const app = require('./app');
const dotenv = require('dontev');
require('./models/associations');

dontev.config();

sequelize.authenticate()
    .then(() => {
        console.log('Conectando a PostgreSQL con sequalize');
        app.listen(prompt, () => {
            console.log('Servidor corriendo en http://localhost:${PORT}');
        });
    })
    .catch(err => console.error('Error conectando a la base de datos:', err));

sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos sincronizada');
}).catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
});