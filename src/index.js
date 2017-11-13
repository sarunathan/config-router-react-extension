import React from "react";
import ReactDOM from "react-dom";
import {Provider,createProvider} from 'react-redux';


let GlobalProvider = createProvider("global");

const settings = {};
let uniqId;

const generateUniqId = () => {
    if (!uniqId) {
        uniqId = 0;
    }
    return ++uniqId;
};

/*****
 * Abstracts the logic of when to render local or global data store provider to
 * readable text
 ***/
let getComponentStatus = (moduleData) => {

    let status = "RENDER_ONLY_COMPONENT";

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
}

let createInstance = (moduleData) => {

    moduleData.id = generateUniqId();
    
    document.querySelector(moduleData.instanceConfig.container).setAttribute("data-react-id", moduleData.id);

    let renderModule = React.createElement(
        moduleData.module,
        {
            container: moduleData.instanceConfig.container,
            placeholder: moduleData.instanceConfig.placeholder
        });
    
    let renderGlobalProvider = React.createElement(GlobalProvider, {store: settings.dataStore}, renderModule);

    let renderLocalProvider = React.createElement(Provider, {store: moduleData.instanceStore}, renderGlobalProvider);
    
    switch(getComponentStatus(moduleData)){
        case "RENDER_COMPONENT_WITH_GLOBALSTORE":
            ReactDOM.render( renderGlobalProvider,document.querySelector(moduleData.instanceConfig.container));
        break;
        case "RENDER_COMPONENT_WITH_GLOBALSTORE_AND_LOCALSTORE":
            ReactDOM.render( renderLocalProvider,document.querySelector(moduleData.instanceConfig.container));
        break;
        case "RENDER_ONLY_COMPONENT":
            ReactDOM.render(renderModule, document.querySelector(moduleData.instanceConfig.container));        
        break;
        default:
            ReactDOM.render(renderModule, document.querySelector(moduleData.instanceConfig.container));
    }

    return Promise.resolve(moduleData.id);
};

let destroyInstance = (moduleData) => {

    let moduleRef = document.querySelector(`[data-react-id='${moduleData.id}']`);
    if (moduleRef) {
        ReactDOM.unmountComponentAtNode(moduleRef);
    } else {
        console.error("Module you are trying to destory is not available in dom");
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
