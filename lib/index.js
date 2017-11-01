"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

/*****
 * Abstracts the logic of when to render local or global data store provider to
 * readable text
 ***/
var getComponentStatus = function getComponentStatus(moduleData) {

    var status = "RENDER_ONLY_COMPONENT";

    if (settings.dataStore && !moduleData.instanceStore) {
        status = "RENDER_COMPONENT_WITH_GLOBALSTORE";
    } else if (settings.dataStore && moduleData.instanceStore) {
        status = "RENDER_COMPONENT_WITH_GLOBALSTORE_AND_LOCALSTORE";
    } else if (!settings.dataStore && moduleData.instanceStore) {
        console.warn(" React-config-router extension doesn't support only local store. Please use a global store along with local store , Note: Your local store is ignored");
        // // render only component
    } else {
            // render only component
        }
    return status;
};

var createInstance = function createInstance(moduleData) {

    moduleData.id = generateUniqId();

    document.querySelector(moduleData.instanceConfig.container).setAttribute("data-react-id", moduleData.id);

    var renderModule = _react2.default.createElement(moduleData.module, {
        container: moduleData.instanceConfig.container,
        placeholder: moduleData.instanceConfig.placeholder
    });

    var renderGlobalProvider = _react2.default.createElement(_reactRedux.Provider, { store: settings.dataStore }, renderModule);

    var renderLocalProvider = _react2.default.createElement(_reactRedux.Provider, { store: settings.dataStore }, renderGlobalProvider);

    switch (getComponentStatus(moduleData)) {
        case "RENDER_COMPONENT_WITH_GLOBALSTORE":
            _reactDom2.default.render(renderGlobalProvider, document.querySelector(moduleData.instanceConfig.container));
            break;
        case "RENDER_COMPONENT_WITH_GLOBALSTORE_AND_LOCALSTORE":
            _reactDom2.default.render(renderLocalProvider, document.querySelector(moduleData.instanceConfig.container));
            break;
        case "RENDER_ONLY_COMPONENT":
            _reactDom2.default.render(renderModule, document.querySelector(moduleData.instanceConfig.container));
            break;
        default:
            _reactDom2.default.render(renderModule, document.querySelector(moduleData.instanceConfig.container));
    }

    return Promise.resolve(moduleData.id);
};

var destroyInstance = function destroyInstance(moduleData) {

    var moduleRef = document.querySelector("[data-react-id='" + moduleData.id + "']");
    if (moduleRef) {
        _reactDom2.default.unmountComponentAtNode(moduleRef);
    } else {
        console.error("Module you are trying to destory is not available in dom");
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