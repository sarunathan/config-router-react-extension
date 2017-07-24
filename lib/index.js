"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _blinx = require("blinx");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require("react-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settings = {};
var uniqId = void 0;

var generateUniqId = function generateUniqId() {
    if (!uniqId) {
        uniqId = 0;
    }
    return ++uniqId;
};

/* Monkey patching pubsub to send container in the eventpublisher */
var publish = _blinx.PubSubHelper["publish"];

_react2.default.Component.prototype["publish"] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    if (args.length == 2) {
        publish.call.apply(publish, [_blinx.PubSubHelper, this.props.container].concat(args));
    } else {
        publish.call.apply(publish, [_blinx.PubSubHelper].concat(args));
    }
};
/* Monkey patching pubsub to send container */

_react2.default.Component.prototype["subscribe"] = _blinx.PubSubHelper["subscribe"];
_react2.default.Component.prototype["unsubscribe"] = _blinx.PubSubHelper["unsubscribe"];

var createInstance = function createInstance(moduleData) {

    moduleData.id = generateUniqId();
    document.querySelector(moduleData.instanceConfig.container).setAttribute("data-react-id", moduleData.id);
    _reactDom2.default.render(_react2.default.createElement(_reactRedux.Provider, { store: settings.dataStore }, _react2.default.createElement(moduleData.module, {
        container: moduleData.instanceConfig.container,
        placeholder: moduleData.instanceConfig.placeholder
    })), document.querySelector(moduleData.instanceConfig.container));

    return Promise.resolve(moduleData.id);
};

var destroyInstance = function destroyInstance(moduleData) {

    var moduleRef = document.querySelector("[data-react-id='" + moduleData.id + "']");
    if (moduleRef) {
        _reactDom2.default.unmountComponentAtNode(moduleRef);
    } else {
        throw "Module you are trying to destory is not available in dom";
    }
};

var init = function init(o) {
    Object.assign(settings, o);
};

exports.default = {
    createInstance: createInstance,
    destroyInstance: destroyInstance,
    init: init
};