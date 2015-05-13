define(["require", "exports"], function (require, exports) {
    var Event = (function () {
        function Event(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = null; }
            if (cancelable === void 0) { cancelable = null; }
            this.type = null;
            this.target = null;
            this.currentTarget = null;
            this.eventPhase = 0;
            this.bubbles = false;
            this.cancelable = false;
            this.timeStamp = 0;
            this.defaultPrevented = false;
            this.propagationStopped = false;
            this.immediatePropagationStopped = false;
            this.removed = false;
            this.type = type;
            this.bubbles = bubbles;
            this.cancelable = cancelable;
            this.timeStamp = (new Date()).getTime();
        }
        Event.prototype.preventDefault = function () {
            this.defaultPrevented = true;
        };
        Event.prototype.stopPropagation = function () {
            this.propagationStopped = true;
        };
        Event.prototype.stopImmediatePropagation = function () {
            this.immediatePropagationStopped = this.propagationStopped = true;
        };
        Event.prototype.remove = function () {
            this.removed = true;
        };
        Event.prototype.clone = function () {
            return new Event(this.type, this.bubbles, this.cancelable);
        };
        Event.prototype.set = function (props) {
            for (var n in props) {
                if (props.hasOwnProperty(n)) {
                    this[n] = props[n];
                }
            }
            return this;
        };
        Event.prototype.toString = function () {
            return "[Event (type=" + this.type + ")]";
        };
        return Event;
    })();
    return Event;
});
