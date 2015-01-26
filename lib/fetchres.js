!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.fetchres=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

exports.json = json;
exports.text = text;
function json(response) {
  if (Array.isArray(response)) {
    return Promise.all(response.map(json));
  }
  if (response.status >= 400) {
    throw new BadServerResponseError(response.status);
  }
  return response.json()["catch"](function (err) {
    // probably invalid json
    throw new InvalidJsonError(err.message);
  });
}

function text(response) {
  if (Array.isArray(response)) {
    return Promise.all(response.map(text));
  }
  if (response.status >= 400) {
    throw new BadServerResponseError(response.status);
  }
  return response.text();
}

var BadServerResponseError = (function (Error) {
  // es6 smells
  // https://twitter.com/andrewsmatt/status/554792707139584001
  function BadServerResponseError(options) {
    this.message = options;
  }

  _inherits(BadServerResponseError, Error);

  return BadServerResponseError;
})(Error);

exports.BadServerResponseError = BadServerResponseError;
var InvalidJsonError = (function (Error) {
  function InvalidJsonError(options) {
    this.message = options;
  }

  _inherits(InvalidJsonError, Error);

  return InvalidJsonError;
})(Error);

exports.InvalidJsonError = InvalidJsonError;

},{}]},{},[1])(1)
});