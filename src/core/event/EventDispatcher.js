define(["require", "exports", "./Event"], function (require, exports, Event_1) {
    "use strict";
    var EventDispatcher = (function () {
        function EventDispatcher(target) {
            this._listeners = null;
            this._captureListeners = null;
        }
        EventDispatcher.initialize = function (target) {
            var p = EventDispatcher.prototype;
            target.addEventListener = p.addEventListener;
            target.on = p.on;
            target.removeEventListener = target.off = p.removeEventListener;
            target.removeAllEventListeners = p.removeAllEventListeners;
            target.hasEventListener = p.hasEventListener;
            target.dispatchEvent = p.dispatchEvent;
            target._dispatchEvent = p._dispatchEvent;
            target.willTrigger = p.willTrigger;
        };
        EventDispatcher.prototype.addEventListener = function (type, listener, useCapture) {
            var listeners;
            if (useCapture) {
                listeners = this._captureListeners = this._captureListeners || {};
            }
            else {
                listeners = this._listeners = this._listeners || {};
            }
            var arr = listeners[type];
            if (arr) {
                this.removeEventListener(type, listener, useCapture);
            }
            arr = listeners[type];
            if (!arr) {
                listeners[type] = [listener];
            }
            else {
                arr.push(listener);
            }
            return listener;
        };
        EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
            var listeners = useCapture ? this._captureListeners : this._listeners;
            if (!listeners) {
                return;
            }
            var arr = listeners[type];
            if (!arr) {
                return;
            }
            for (var i = 0, l = arr.length; i < l; i++) {
                if (arr[i] == listener) {
                    if (l == 1) {
                        delete (listeners[type]);
                    }
                    else {
                        arr.splice(i, 1);
                    }
                    break;
                }
            }
        };
        EventDispatcher.prototype.removeAllEventListeners = function (type) {
            if (!type) {
                this._listeners = this._captureListeners = null;
            }
            else {
                if (this._listeners) {
                    delete (this._listeners[type]);
                }
                if (this._captureListeners) {
                    delete (this._captureListeners[type]);
                }
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (eventObj, target) {
            if (typeof eventObj == "string") {
                var listeners = this._listeners;
                if (!listeners || !listeners[eventObj]) {
                    return false;
                }
                eventObj = new Event_1.default(eventObj);
            }
            try {
                eventObj.target = target || this;
            }
            catch (e) {
            }
            if (!eventObj.bubbles || !this.parent) {
                this._dispatchEvent(eventObj, 2);
            }
            else {
                var top = this, list = [top];
                while (top.parent) {
                    list.push(top = top.parent);
                }
                var i, l = list.length;
                for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
                    list[i]._dispatchEvent(eventObj, 1 + ((i == 0) ? 1 : 0));
                }
                for (i = 1; i < l && !eventObj.propagationStopped; i++) {
                    list[i]._dispatchEvent(eventObj, 3);
                }
            }
            return eventObj.defaultPrevented;
        };
        EventDispatcher.prototype.hasEventListener = function (type) {
            var listeners = this._listeners, captureListeners = this._captureListeners;
            return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
        };
        EventDispatcher.prototype.willTrigger = function (type) {
            var o = this;
            while (o) {
                if (o.hasEventListener(type)) {
                    return true;
                }
                o = o.parent;
            }
            return false;
        };
        EventDispatcher.prototype.toString = function () {
            return "[EventDispatcher]";
        };
        EventDispatcher.prototype._dispatchEvent = function (eventObj, eventPhase) {
            var l, listeners = (eventPhase == 1) ? this._captureListeners : this._listeners;
            if (eventObj && listeners) {
                var arr = listeners[eventObj.type];
                if (!arr || !(l = arr.length)) {
                    return;
                }
                try {
                    eventObj.currentTarget = this;
                }
                catch (e) {
                }
                try {
                    eventObj.eventPhase = eventPhase;
                }
                catch (e) {
                }
                eventObj.removed = false;
                arr = arr.slice();
                for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
                    var o = arr[i];
                    if (o.handleEvent) {
                        o.handleEvent(eventObj);
                    }
                    else {
                        o(eventObj);
                    }
                    if (eventObj.removed) {
                        this.removeEventListener(eventObj.type, o, eventPhase == 1);
                        eventObj.removed = false;
                    }
                }
            }
        };
        EventDispatcher.prototype.destruct = function () {
            this.removeAllEventListeners();
        };
        return EventDispatcher;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventDispatcher;
});
