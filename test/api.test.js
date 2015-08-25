"use strict";

require('es6-promise').polyfill();
require('isomorphic-fetch');
var fetchRes = require('../lib/fetchres');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var nock = require('nock');
var good = 'hello world. 你好世界。';
var bad = 'good bye cruel world. 再见残酷的世界。';

describe('fetch', function() {

	before(function() {
		nock('http://wheresrhys.co.uk')
			.get('/succeed.txt')
			.times(3)
			.reply(200, good);
		nock('http://wheresrhys.co.uk')
			.get('/fail.txt')
			.reply(410, bad);
		nock('http://wheresrhys.co.uk')
			.get('/succeed.json')
			.times(3)
			.reply(200, { text: good });
		nock('http://wheresrhys.co.uk')
			.get('/fail.json')
			.reply(404, { text: bad });
		nock('http://wheresrhys.co.uk')
			.get('/invalid.json')
			.reply(200, 'that\'s no json');
	});

	it('should facilitate the making of requests', function() {
		return fetch('http://wheresrhys.co.uk/succeed.txt')
			.then(fetchRes.text)
			.then(function(data) {
				expect(data).to.equal(good);
			});
	});

	it('should do the right thing with bad requests', function() {
		return fetch('http://wheresrhys.co.uk/fail.txt')
			.then(fetchRes.text)
			.catch(function(err) {
				expect(err.name).to.equal(fetchRes.BadServerResponseError.name);
				expect(err.message).to.equal(410);
			});
	});

	it('should facilitate the making of json requests', function() {
		return fetch('http://wheresrhys.co.uk/succeed.json')
			.then(fetchRes.json)
			.then(function(data) {
				expect(data.text).to.equal(good);
			});
	});

	it('should do the right thing with bad json requests', function() {
		return fetch('http://wheresrhys.co.uk/fail.json')
			.then(fetchRes.json)
			.catch(function(err) {
				expect(err.name).to.equal(fetchRes.BadServerResponseError.name);
				expect(err.message).to.equal(404);
			});
	});

	it('should do the right thing with invalid json responses', function() {
		return fetch('http://wheresrhys.co.uk/invalid.json')
			.then(fetchRes.json)
			.catch(function(err) {
				expect(err.name).to.equal(fetchRes.InvalidJsonError.name);
				var isFetchResOriginatedError = fetchRes.originatedError(err);
				expect(isFetchResOriginatedError).to.equal(true);
			});
	});

	it('should facilitate the making of many json requests', function() {
		return Promise.all([
				fetch('http://wheresrhys.co.uk/succeed.json'),
				fetch('http://wheresrhys.co.uk/succeed.json')
			])
			.then(fetchRes.json)
			.then(function(data) {
				expect(data[0].text).to.equal(good);
				expect(data[1].text).to.equal(good);
			});
	});

	it('should facilitate the making of many txt requests', function() {
		return Promise.all([
				fetch('http://wheresrhys.co.uk/succeed.txt'),
				fetch('http://wheresrhys.co.uk/succeed.txt')
			])
			.then(fetchRes.text)
			.then(function(data) {
				expect(data[0]).to.equal(good);
				expect(data[1]).to.equal(good);
			});
	});

	it('should throw ReadTimeoutError if json reading times out', function() {
		var response = {
			ok: true,
			json: function() {
				return Promise.reject(new Error('response timeout at...'));
			}
		};
		return expect(fetchRes.json(response)).to.be.rejectedWith(fetchRes.ReadTimeoutError, 'response timeout at...');
	});

});
