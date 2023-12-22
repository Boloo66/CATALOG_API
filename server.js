const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();
const port = process.env.PORT || 3010;

const server = http.createServer(app);
server.listen(port, () => {
  console.log('I\'m listening on port ', server.address().port);
});

server.on('listening', () => {
  console.log('connection to port %d successful', server.address().port);
});

server.on('error', (err) => {
  console.log(`Error(server couldn't respond): ${err}`);
});
