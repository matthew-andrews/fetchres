"use strict";

export function json(response) {
	if (response.status >= 400) {
		throw new BadServerResponseError(response.status);
	}
	return response.json();
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
