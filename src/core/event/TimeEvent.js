var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Event"], function (require, exports, Event_1) {
    "use strict";
    var TimeEvent = (function (_super) {
        __extends(TimeEvent, _super);
        function TimeEvent(type, delta, paused, time, runtime, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = null; }
            if (cancelable === void 0) { cancelable = null; }
            _super.call(this, type, bubbles, cancelable);
            this.delta = delta;
            this.paused = paused;
            this.time = time;
            this.runTime = runtime;
        }
        return TimeEvent;
    }(Event_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeEvent;
});
