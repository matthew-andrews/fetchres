"use strict";

export function json(response) {
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
	if (response.status >= 400) {
		throw new BadServerResponseError(response.status);
	}
	return response.text();
}

export class BadServerResponseError extends Error {
	constructor(options) {
		this.message = options;
	}
}

export class InvalidJsonError extends Error {
	constructor(options) {
		this.message = options;
	}
}
