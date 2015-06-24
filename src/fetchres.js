"use strict";

export function json(response) {
	if (Array.isArray(response)) {
		return Promise.all(response.map(json));
	}
	if (!response.ok) {
		throw new BadServerResponseError(response.status);
	}
	return response.json()
		.catch(function(err) {
			if (err.message.indexOf('response timeout at') === 0) {
				throw new ReadTimeoutError(err.message);
			}
			// probably invalid json
			throw new InvalidJsonError(err.message);
		});
}

export function text(response) {
	if (Array.isArray(response)) {
		return Promise.all(response.map(text));
	}
	if (!response.ok) {
		throw new BadServerResponseError(response.status);
	}
	return response.text();
}

export class BadServerResponseError extends Error {
	// es6 smells
	// https://twitter.com/andrewsmatt/status/554792707139584001
	constructor(options) {
		this.message = options;
		this.name = 'BadServerResponseError';
	}
}

export class InvalidJsonError extends Error {
	constructor(options) {
		this.message = options;
		this.name = 'InvalidJsonError';
	}
}

export class ReadTimeoutError extends Error {
	constructor(options) {
		this.message = options;
		this.name = 'ReadTimeoutError';
	}
}
