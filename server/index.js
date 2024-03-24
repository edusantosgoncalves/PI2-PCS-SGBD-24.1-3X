const app = require('./app');

app.listen(app.get('port'));

console.log('Servidor na porta', app.get('port'));