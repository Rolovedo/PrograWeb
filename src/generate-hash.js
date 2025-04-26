const bcrypt = require('bcrypt');
const password = '98631063ace';
bcrypt.hash(password, 10).then(hash => console.log(hash));