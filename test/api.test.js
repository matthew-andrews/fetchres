"use strict";

require('es6-promise').polyfill();
require('isomorphic-fetch');
require("6to5/register");
var fetchRes = require('../dist/index');

var expect = require('chai').expect;
var nock = require('nock');
var good = 'hello world. 你好世界。';
var bad = 'good bye cruel world. 再见残酷的世界。';

describe('fetch', function() {

	before(function() {
		nock('https://mattandre.ws')
			.get('/succeed.txt')
			.reply(200, good);
		nock('https://mattandre.ws')
			.get('/fail.txt')
			.reply(404, bad);
		nock('https://mattandre.ws')
			.get('/succeed.json')
			.reply(200, { text: good });
		nock('https://mattandre.ws')
			.get('/fail.json')
			.reply(404, { text: bad });
	});

	it('should facilitate the making of requests', function(done) {
		fetch('https://mattandre.ws/succeed.txt')
			.then(fetchRes.text)
			.then(function(data) {
				expect(data).to.equal(good);
				done();
			});
	});

	it('should do the right thing with bad requests', function(done) {
		fetch('https://mattandre.ws/fail.txt')
			.then(fetchRes.text)
			.catch(function(err) {
				expect(err).to.be.instanceOf(fetchRes.BadServerResponse);
				done();
			});
	});

	it('should facilitate the making of json requests', function(done) {
		fetch('https://mattandre.ws/succeed.json')
			.then(fetchRes.json)
			.then(function(data) {
				expect(data.text).to.equal(good);
				done();
			});
	});

	it('should do the right thing with bad json requests', function(done) {
		fetch('https://mattandre.ws/fail.json')
			.then(fetchRes.json)
			.catch(function(err) {
				expect(err).to.be.instanceOf(fetchRes.BadServerResponse);
				done();
			});
	});

});
