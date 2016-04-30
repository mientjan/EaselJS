var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./LinkedList", "../event/Signal1"], function (require, exports, LinkedList_1, Signal1_1) {
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
    var FramePerSecondCollection = (function (_super) {
        __extends(FramePerSecondCollection, _super);
        function FramePerSecondCollection(fps) {
            var _this = this;
            _super.call(this);
            this._intervalKey = -1;
            this._time = 0;
            this._runRequestAnimationFrame = function (time) {
                var time, ptime;
                _this._intervalKey = requestAnimationFrame(_this._runRequestAnimationFrame);
                ptime = _this._time;
                _this._time = time;
                _this.emit(time - ptime);
            };
            this._runSetTimeout = function () {
                var time, ptime;
                _this._intervalKey = setTimeout(_this._runSetTimeout, _this._mspf);
                ptime = _this._time;
                _this._time = time = Date.now();
                _this.emit(time - ptime);
            };
            this.fps = fps;
            this._fps = fps;
            this._mspf = 1000 / fps;
        }
        FramePerSecondCollection.prototype.listAdd = function (conn, prioritize) {
            _super.prototype.listAdd.call(this, conn, prioritize);
            if (this.hasListeners()) {
                this.start();
            }
        };
        FramePerSecondCollection.prototype.listRemove = function (conn) {
            _super.prototype.listRemove.call(this, conn);
            if (!this.hasListeners()) {
                this.stop();
            }
        };
        FramePerSecondCollection.prototype.start = function () {
            if (this._fps == -1) {
                this._runRequestAnimationFrame(Date.now());
            }
            else {
                this._runSetTimeout();
            }
        };
        FramePerSecondCollection.prototype.stop = function () {
            if (this._fps == -1) {
                cancelAnimationFrame(this._intervalKey);
            }
            else {
                clearTimeout(this._intervalKey);
            }
            this._intervalKey = -1;
        };
        return FramePerSecondCollection;
    }(Signal1_1.Signal1));
    exports.FramePerSecondCollection = FramePerSecondCollection;
    var Interval2 = (function () {
        function Interval2(framePerSecond, fixedTimeStep) {
            if (framePerSecond === void 0) { framePerSecond = -1; }
            if (fixedTimeStep === void 0) { fixedTimeStep = false; }
            this._connections = [];
            if (framePerSecond === 0) {
                throw new Error('framePerSecond can not be zero, only -1 or 1 and above is allowed. -1 will run as fast as possible.');
            }
            this._framePerSecond = framePerSecond;
            this._fixedTimeStep = fixedTimeStep;
        }
        Interval2.add = function (framePerSecond, fixedTimeStep, callback) {
            var connection = null;
            if (framePerSecond === -1) {
                Interval2._requestAnimationFrameList.connect(callback);
            }
            else if (framePerSecond >= 1) {
                framePerSecond = framePerSecond | 0;
                var fpsCollection = null;
                var list = Interval2._setTimeoutList;
                var currentNode = list.firstNode;
                while (currentNode !== null) {
                    if (currentNode.element.fps == framePerSecond) {
                        fpsCollection = currentNode.element;
                        break;
                    }
                    currentNode = currentNode.next;
                }
                if (!fpsCollection) {
                    fpsCollection = new FramePerSecondCollection(framePerSecond);
                    list.add(fpsCollection);
                }
                connection = fpsCollection.connect(callback);
            }
            return connection;
        };
        Interval2.prototype.getFramePerSecond = function () {
            return this._framePerSecond;
        };
        Interval2.prototype.add = function (callback) {
            var connection = Interval2.add(this._framePerSecond, this._fixedTimeStep, callback);
            this._connections.push(connection);
            return connection;
        };
        Interval2.prototype.destruct = function () {
            var connections = this._connections;
            while (connections.length) {
                connections.pop().dispose();
            }
        };
        Interval2._requestAnimationFrameList = new FramePerSecondCollection(-1);
        Interval2._setTimeoutList = new LinkedList_1.LinkedList();
        return Interval2;
    }());
    exports.Interval2 = Interval2;
});
