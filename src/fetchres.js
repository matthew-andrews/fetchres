"use strict";

export function json(response) {
	if (Array.isArray(response)) {
		return Promise.all(response.map(json));
	}
	if (response.status >= 400) {
		throw new BadServerResponseError(response.status);
	}
	return response.json()
		.catch(function(err) {
			// probably invalid json
			throw new InvalidJsonError(err.message);
		});
}

export function text(response) {
	if (Array.isArray(response)) {
		return Promise.all(response.map(text));
	}
	if (response.status >= 400) {
		throw new BadServerResponseError(response.status);
	}
	return response.text();
}

export class BadServerResponseError extends Error {
	// es6 smells
	// https://twitter.com/andrewsmatt/status/554792707139584001
	constructor(options) {
		this.message = options;
	}
}

export class InvalidJsonError extends Error {
	constructor(options) {
		this.message = options;
	}
}
