"use strict";

export function json(response) {
	if (Array.isArray(response)) {
		return Promise.all(response.map(json));
	}
	if (!response.ok) {
		response.text();
		throw new BadServerResponseError(response.url, response.status, response.statusText);
	}

	if (response.status === 204) {
		response.text();
		return undefined;
	}

	return response.json()
		.catch(function(err) {
			if (err.message.indexOf('timeout') > -1) {
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
		response.text();
		throw new BadServerResponseError(response.url, response.status, response.statusText);
	}

	if (response.status === 204) {
		response.text();
		return undefined;
	}

	return response.text();
}

export class BadServerResponseError extends Error {
	// es6 smells
	// https://twitter.com/andrewsmatt/status/554792707139584001
	constructor(url, status, statusText) {
		super();
		this.message = `${url} responded with a ${status} (${statusText})`;
		this.name = 'BadServerResponseError';
	}
}

export class InvalidJsonError extends Error {
	constructor(options) {
		super();
		this.message = options;
		this.name = 'InvalidJsonError';
	}
}

export class ReadTimeoutError extends Error {
	constructor(options) {
		super();
		this.message = options;
		this.name = 'ReadTimeoutError';
	}
}

export function originatedError(err) {
	if (err.name === BadServerResponseError.name
		|| err.name === InvalidJsonError.name
		|| err.name === ReadTimeoutError.name) {
		return true;
	} else {
		return false;
	}
}
