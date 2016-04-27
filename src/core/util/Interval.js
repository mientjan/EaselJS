define(["require", "exports", "../event/Signal1"], function (require, exports, Signal1_1) {
    "use strict";
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());
    var FpsCollection = (function () {
        function FpsCollection(fps) {
            this.signal = new Signal1_1.default();
            this.frame = 0;
            this.time = 0;
            this.ptime = 0;
            this.accum = 0;
            this.fps = fps;
            this.mspf = 1000 / fps;
        }
        return FpsCollection;
    }());
    var rafInt = 0;
    var time = 0;
    var list = [];
    var listLength = 0;
    function requestAnimationFrame(timeUpdate) {
        rafInt = window.requestAnimationFrame(requestAnimationFrame);
        var prevTime = time;
        time = timeUpdate;
        var delta = timeUpdate - prevTime;
        var fc;
        for (var i = 0; i < listLength; i++) {
            fc = list[i];
            fc.time += delta;
            fc.accum += delta;
            if (fc.accum >= fc.mspf) {
                fc.signal.emit(fc.accum);
                fc.accum = 0;
                fc.ptime = fc.time;
            }
        }
    }
    var Interval = (function () {
        function Interval(fps) {
            if (fps === void 0) { fps = 60; }
            this.fps = 0;
            this._connections = [];
            this._delay = -1;
            this.fps = fps;
        }
        Interval.attach = function (fps_, callback) {
            var fps = fps_ | 0;
            var fc = null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].fps == fps) {
                    fc = list[i];
                }
            }
            if (!fc) {
                fc = new FpsCollection(fps);
                list.push(fc);
                listLength = list.length;
            }
            return fc.signal.connect(callback);
        };
        Interval.start = function () {
            if (!Interval.isRunning) {
                Interval.isRunning = true;
                requestAnimationFrame(0);
            }
        };
        Interval.stop = function () {
            Interval.isRunning = false;
            cancelAnimationFrame(rafInt);
        };
        Interval.prototype.attach = function (callback) {
            var connection = Interval.attach(this.fps, callback);
            this._connections.push(connection);
            Interval.start();
            return connection;
        };
        Interval.prototype.getDelay = function () {
            var delay = (time - this._delay);
            this._delay = time;
            return delay;
        };
        Interval.prototype.destruct = function () {
            var connections = this._connections;
            while (connections.length) {
                connections.pop().dispose();
            }
        };
        Interval.isRunning = false;
        return Interval;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Interval;
});
