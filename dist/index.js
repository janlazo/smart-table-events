(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['smart-table-events'] = global['smart-table-events'] || {})));
}(this, (function (exports) { 'use strict';

function emitter () {

  const listenersLists = {};
  const instance = {
    on(event, ...listeners){
      listenersLists[event] = (listenersLists[event] || []).concat(listeners);
      return instance;
    },
    dispatch(event, ...args){
      const listeners = listenersLists[event] || [];
      for (let listener of listeners) {
        listener(...args);
      }
      return instance;
    },
    off(event, ...listeners){
      if (!event) {
        Object.keys(listenersLists).forEach(ev => instance.off(ev));
      } else {
        const list = listenersLists[event] || [];
        listenersLists[event] = listeners.length ? list.filter(listener => !listeners.includes(listener)) : [];
      }
      return instance;
    }
  };
  return instance;
}

function proxyListener (eventMap) {
  return function ({emitter}) {

    const proxy = {};
    let eventListeners = {};

    for (let ev of Object.keys(eventMap)) {
      const method = eventMap[ev];
      eventListeners[ev] = [];
      proxy[method] = function (...listeners) {
        eventListeners[ev] = eventListeners[ev].concat(listeners);
        emitter.on(ev, ...listeners);
        return proxy;
      };
    }

    return Object.assign(proxy, {
      off(ev){
        if (!ev) {
          Object.keys(eventListeners).forEach(eventName => proxy.off(eventName));
        }
        if (eventListeners[ev]) {
          emitter.off(ev, ...eventListeners[ev]);
        }
        return proxy;
      }
    });
  }
}

exports.emitter = emitter;
exports.proxyListener = proxyListener;

Object.defineProperty(exports, '__esModule', { value: true });

})));
