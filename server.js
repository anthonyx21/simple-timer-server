const restify = require('restify');
const restifyPlugins = require('restify-plugins');

const PORT = 8080
const TIMEOUT_IN_SECONDS = 120

const server = restify.createServer({
});

server.use(restifyPlugins.jsonBodyParser({mapParams: true}));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({mapParams: true}));
server.use(restifyPlugins.fullResponse());

let last = {
    status: 'ok',
    time: 0
}

server.get('/status', (req, res, next) => {
    let now = new Date().getTime()
    console.log(now,  last.time, now - last.time > TIMEOUT_IN_SECONDS * 1000)
    if (now - last.time > TIMEOUT_IN_SECONDS * 1000) {
        res.send({status: 'error', message: 'you must validate your voice'});
        next()
    }
    else{
        last.time = new Date().getTime()
        res.send(last)
        next()
    }
});

server.post('/status', (req, res, next) => {
    last.status = 'ok'
    last.time = new Date().getTime()
    res.send(last)
    next()
});

server.listen(PORT, () => {
    console.log('server started on:', PORT)
});