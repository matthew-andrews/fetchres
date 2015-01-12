"use strict";

export function json(response) {
	if (response.status >= 400) {
		throw new BadServerResponse(response.status);
	}
	return response.json();
}

export function text(response) {
	if (response.status >= 400) {
		throw new BadServerResponse(response.status);
	}
	return response.text();
}

export function BadServerResponse(message) {
	this.message = (message || "");
}

BadServerResponse.prototype = Error.prototype;
