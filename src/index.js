import {PubSubHelper} from "blinx";
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux'

const settings = {};
let uniqId;

const generateUniqId = () => {
    if (!uniqId) {
        uniqId = 0;
    }
    return ++uniqId;
};

/* Monkey patching pubsub to send container in the eventpublisher */
const publish = PubSubHelper["publish"];

React.Component.prototype["publish"] = function (...args) {
    if (args.length == 2) {
        publish.call(PubSubHelper, this.props.container, ...args)
    }
    else {
        publish.call(PubSubHelper, ...args)
    }
};
/* Monkey patching pubsub to send container */

React.Component.prototype["subscribe"] = PubSubHelper["subscribe"];
React.Component.prototype["unsubscribe"] = PubSubHelper["unsubscribe"];

let createInstance = (moduleData) => {

    moduleData.id = generateUniqId();
    document.querySelector(moduleData.instanceConfig.container).setAttribute("data-react-id", moduleData.id);

    let renderModule = React.createElement(
        moduleData.module,
        {
            container: moduleData.instanceConfig.container,
            placeholder: moduleData.instanceConfig.placeholder
        });

    if (settings.dataStore) {
        ReactDOM.render(
            React.createElement(Provider, {store: settings.dataStore}, renderModule,
                document.querySelector(moduleData.instanceConfig.container)
            )
        );
    } else {
        ReactDOM.render(renderModule, document.querySelector(moduleData.instanceConfig.container));
    }


    return Promise.resolve(moduleData.id);
};

let destroyInstance = (moduleData) => {

    let moduleRef = document.querySelector(`[data-react-id='${moduleData.id}']`);
    if (moduleRef) {
        ReactDOM.unmountComponentAtNode(moduleRef);
    } else {
        throw("Module you are trying to destory is not available in dom");
    }
};

let init = (o) => {
    Object.assign(settings, o);
};

export default {
    createInstance,
    destroyInstance,
    init
}