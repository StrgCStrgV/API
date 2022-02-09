const http = require ('http');
const app = require ('./app');
const port = 3500;
const server = http.createServer(app);
process.setMaxListeners(0);// to avoid error:node:40310) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 exit listeners added to [Bus]. Use emitter.setMaxListeners() to increase limit (Use `node --trace-warnings ...` to show where the warning was created)
console.log("server listening on port", port);
server.listen(port);