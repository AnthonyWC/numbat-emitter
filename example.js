#!/usr/bin/env node

var Emitter = require('./index');

var emitter = new Emitter({
    path: '/tmp/numbat.sock',
    node: 'example-1'
});

emitter.metric({ name: 'example.start', pid: process.pid });


function heartbeat()
{
    emitter.metric({ name: 'heartbeat', ttl: 16000 });
}

function resources()
{
    var mem = process.memoryUsage();

    emitter.metric({ name: 'example.memory.rss', value: mem.rss });
    emitter.metric({ name: 'example.memory.heapTotal', value: mem.heapTotal });
    emitter.metric({ name: 'example.memory.heapUsed', value: mem.heapUsed });
}

var heartbeatTimer = setInterval(heartbeat, 15000);
var resourcesTimer = setInterval(resources, 30000);

process.on('SIGINT', function()
{
    console.log('Shutting down gracefully.');
    clearInterval(heartbeatTimer);
    clearInterval(resourcesTimer);
    emitter.metric({ name: 'shutdown' });
    setTimeout(process.exit, 500);
});
