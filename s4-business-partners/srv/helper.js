const axios = require('axios').default;
const { HTTP, CloudEvent } = require('cloudevents');

// Entry point to execute operation: CREATE or UPDATE a business partner 
async function createOrUpdateBusinessPartner(req) {
    // Build event data
    const event = {
        data: {
            method: req.method,
            entity: req.data
        }
    };

    // Get the update mode from environment setup
    let updMode = "direct";
    if (process.env.VCAP_APPLICATION) {
        const config = JSON.parse(process.env.VCAP_APPLICATION).config;
        if (config) {
            updMode = (config.update_mode) ? config.update_mode : updMode;
        }
    }

    // Execute operation according to the update mode
    let res;
    switch (updMode.toUpperCase()) {
        case "DIRECT": res = await callServerlessFunction(event); break;
        case "IN-CLUSTER":
            await emitEvent_InCluster(event);
            res = event.data.entity;
            break;
        case "OUT-CLUSTER":
            await emitEvent_OutCluster(event);
            res = event.data.entity;
            break;
        default: res = await callServerlessFunction(event); break;
    }

    return res;
}

// Publishes the business partner update event message to the event publisher proxy from
// inside the cluster (loosely coupled)
async function emitEvent_InCluster(event) {
    const ce = new CloudEvent({ type: "sap.kyma.custom.nonexistingapp.businesspartner.update.v1", source: "kyma", data: event.data });
    const message = HTTP.structured(ce);

    let evtURL = "http://eventing-event-publisher-proxy.kyma-system/publish";
    if (process.env.VCAP_APPLICATION) {
        const dests = JSON.parse(process.env.VCAP_APPLICATION).destinations;
        if (dests) {
            const dest = dests.find(element => element.name === 'event-in-cluster');
            evtURL = (dest) ? dest.url : evtURL;
        }
    }

    const res = axios({
        method: "post",
        url: evtURL,
        data: message.body,
        headers: message.headers,
    });

    return res.data;
}

// Publishes the business partner update event message to the event publisher proxy from
// outside the cluster (loosely coupled)
async function emitEvent_OutCluster(event) {
    // Get serverless function URL
    let funcURL = "http://event-publish.business-partners.svc.cluster.local";
    if (process.env.VCAP_APPLICATION) {
        const dests = JSON.parse(process.env.VCAP_APPLICATION).destinations;
        if (dests) {
            const dest = dests.find(element => element.name === 'event-out-cluster');
            funcURL = (dest) ? dest.url : funcURL;
        }
    }

    // Do a POST request to the serverlerss function
    const res = await axios({
        method: "post",
        url: funcURL,
        data: event.data
    });
    return res.data;
}

// Call the business partner management serverless function directly (not loosely coupled)
async function callServerlessFunction(event) {
    // Get serverless function URL
    let funcURL = "http://manage-bp.business-partners.svc.cluster.local";
    if (process.env.VCAP_APPLICATION) {
        const dests = JSON.parse(process.env.VCAP_APPLICATION).destinations;
        if (dests) {
            const dest = dests.find(element => element.name === 'serverless-function');
            funcURL = (dest) ? dest.url : funcURL;
        }
    }

    // Do a POST request to the serverlerss function
    const res = await axios({
        method: "post",
        url: funcURL,
        data: event.data
    });
    return res.data;
}

module.exports = {
    createOrUpdateBusinessPartner
}