'use strict';

const
	Request = require('request'),
	stream  = require('readable-stream'),
	util    = require('util')
	;

const NSQStream = module.exports = function NSQStream(opts)
{
	stream.Writable.call(this);

	opts.parsed.protocol = 'http:';
	if (!opts.parsed.pathname) opts.parsed.pathname = 'pub';

	this.defaults = {
		uri: opts.parsed.format(),
		method: 'post',
		qs: { topic: opts.topic || 'metrics' },
	};
	process.nextTick(this.emit.bind(this, 'connect')); // we won't emit the event otherwise
};
util.inherits(NSQStream, stream.Writable);

NSQStream.prototype._write = function _write(event, encoding, callback)
{
	const options = Object.assign({ body: event }, this.defaults);
	Request(options, function(err, response, body)
	{
		if (err) return callback(err);
		if (response.statusCode !== 200)
			return callback(new Error(`unexpected status code ${response.statusCode}`));
		callback();
	});
};