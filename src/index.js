import {PubSubHelper} from "blinx";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'

const settings = {};


/* Monkey patching pubsub to send container in the eventpublisher */
let publish = PubSubHelper["publish"];

React.Component.prototype["publish"] = function(...args){
    if(args.length == 2){
        publish.call(PubSubHelper,this.props.container, ...args)
    }
    else{
        publish.call(PubSubHelper, ...args)
    }
};
/* Monkey patching pubsub to send container */

React.Component.prototype["subscribe"] = PubSubHelper["subscribe"];
React.Component.prototype["unsubscribe"] = PubSubHelper["unsubscribe"];

let createInstance = (moduleData)=> {
    return Promise.resolve(ReactDOM.render(
            React.createElement( Provider , {store : settings.dataStore}, React.createElement(
                    moduleData.module,
                    {
                        container : moduleData.instanceConfig.container,
                        placeholder : moduleData.instanceConfig.placeholder
                    })

            ),
            document.querySelector(moduleData.instanceConfig.container)
        )
    );
};

let destroyInstance = (moduleData)=> {
    ReactDOM.unmountComponentAtNode(document.querySelector(moduleData.instanceConfig.container));
};

let init = (o) => {
    Object.assign(settings,o);
};

export default {
    createInstance,
    destroyInstance,
    init
}