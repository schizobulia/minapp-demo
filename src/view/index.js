import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
    datasetModule
} from "snabbdom";

const patch = init([
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    datasetModule
]);

let nowVnode = document.getElementById("container");

function postMessage(type, name, pageName) {
    myWorker.postMessage({
        type: type,
        name: name,
        pageName: pageName
    })
}

window.__render = function (newVnode) {
    newVnode.data.on = {
        click: function (e) {
            const dataset = e.target.dataset
            if (dataset && dataset.pageName && dataset.bindtap) {
                postMessage('event', dataset.bindtap, dataset.pageName)
            }
            e.stopPropagation();
        }
    }
    patch(nowVnode, newVnode);
    nowVnode = newVnode
}