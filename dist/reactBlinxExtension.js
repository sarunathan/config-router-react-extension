(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["reactBlinxExtension"] = factory();
	else
		root["reactBlinxExtension"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	import { PubSubHelper } from "blinx";
	import React from "react";
	import ReactDOM from "react-dom";
	import { Provider } from 'react-redux';

	const settings = {};

	/* Monkey patching pubsub to send container in the eventpublisher */
	let publish = PubSubHelper["publish"];

	React.Component.prototype["publish"] = function (...args) {
	    if (args.length == 2) {
	        publish.call(PubSubHelper, this.props.container, ...args);
	    } else {
	        publish.call(PubSubHelper, ...args);
	    }
	};
	/* Monkey patching pubsub to send container */

	React.Component.prototype["subscribe"] = PubSubHelper["subscribe"];
	React.Component.prototype["unsubscribe"] = PubSubHelper["unsubscribe"];

	let createInstance = moduleData => {
	    return Promise.resolve(ReactDOM.render(React.createElement(Provider, { store: settings.dataStore }, React.createElement(moduleData.module, {
	        container: moduleData.instanceConfig.container,
	        placeholder: moduleData.instanceConfig.placeholder
	    })), document.querySelector(moduleData.instanceConfig.container)));
	};

	let destroyInstance = moduleData => {
	    ReactDOM.unmountComponentAtNode(document.querySelector(moduleData.instanceConfig.container));
	};

	let init = o => {
	    Object.assign(settings, o);
	};

	export default {
	    createInstance,
	    destroyInstance,
	    init
	};

/***/ }
/******/ ])
});
;