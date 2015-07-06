/*
 * Ticker
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
define(["require", "exports", '../../createts/event/Signal1', '../../createts/event/Signal'], function (require, exports, Signal1, Signal) {
    var Ticker = (function () {
        function Ticker() {
            var _this = this;
            this.timingMode = Ticker.TIMING_MODE_RAF;
            this._isRunning = false;
            this._interval = 50.0;
            this._lastTime = 0;
            this._timerId = -1;
            this.signals = {
                tick: new Signal1(),
                started: new Signal(),
                stopped: new Signal()
            };
            this._isUsingRAF = true;
            this._handleSynch = function () {
                _this._timerId = -1;
                _this._setupTick();
                if (Ticker._getTime() - _this._lastTime >= (_this._interval - 1) * 0.97) {
                    _this._tick();
                }
            };
            this._handleRAF = function () {
                _this._timerId = -1;
                _this._setupTick();
                _this._tick();
            };
            this._handleTimeout = function () {
                _this._timerId = -1;
                _this._setupTick();
                _this._tick();
            };
        }
        Ticker._getTime = function () {
            return (Ticker.now && Ticker.now.call(performance)) || (new Date().getTime());
        };
        Ticker.getInstance = function () {
            if (!Ticker._instance) {
                Ticker._instance = new Ticker();
            }
            return Ticker._instance;
        };
        Ticker.prototype.start = function () {
            if (this._isRunning)
                return;
            this._isRunning = true;
            this._lastTime = Ticker._getTime();
            this._setupTick();
            if (this.signals.started) {
                this.signals.started.emit();
            }
        };
        Ticker.prototype.stop = function () {
            if (!this._isRunning)
                return;
            if (this._isUsingRAF) {
                var fn = window.cancelAnimationFrame
                    || window['webkitCancelAnimationFrame']
                    || window['mozCancelAnimationFrame']
                    || window['oCancelAnimationFrame']
                    || window['msCancelAnimationFrame'];
                fn && fn(this._timerId);
            }
            else {
                clearTimeout(this._timerId);
            }
            this._timerId = -1;
            this._isRunning = false;
            if (this.signals.stopped) {
                this.signals.stopped.emit();
            }
        };
        Ticker.prototype.addTickListener = function (fn) {
            return this.signals.tick.connectImpl(fn, false);
        };
        Ticker.prototype.setInterval = function (interval) {
            this._interval = interval;
            if (this._isRunning) {
                this._setupTick();
            }
        };
        Ticker.prototype.getInterval = function () {
            return this._interval;
        };
        Ticker.prototype.setFPS = function (value) {
            this.setInterval(1000 / value);
        };
        Ticker.prototype.getFPS = function () {
            return 1000 / this._interval;
        };
        Ticker.prototype.getIsRunning = function () {
            return this._isRunning;
        };
        Ticker.prototype._setupTick = function () {
            if (this._timerId > -1) {
                return;
            }
            var mode = this.timingMode;
            if (mode == Ticker.TIMING_MODE_RAFSYNCHED || mode == Ticker.TIMING_MODE_RAF) {
                var fn = window.requestAnimationFrame || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || window['oRequestAnimationFrame'] || window['msRequestAnimationFrame'];
                if (fn) {
                    this._timerId = fn(mode == Ticker.TIMING_MODE_RAF ? this._handleRAF : this._handleSynch);
                    this._isUsingRAF = true;
                    return;
                }
            }
            this._isUsingRAF = false;
            this._timerId = setTimeout(this._handleTimeout, this._interval);
        };
        Ticker.prototype._tick = function () {
            var time = Ticker._getTime();
            var delta = time - this._lastTime;
            this._lastTime = time;
            if (this.signals.tick.hasListeners()) {
                var maxDelta = Ticker.maxDelta;
                this.signals.tick.emit((maxDelta && delta > maxDelta) ? maxDelta : delta);
            }
        };
        Ticker.TIMING_MODE_RAFSYNCHED = 'raf_synched';
        Ticker.TIMING_MODE_RAF = 'raf';
        Ticker.TIMING_MODE_TIMEOUT = 'timeout';
        Ticker.now = window.performance && (window.performance.now || window.performance['mozNow'] || window.performance['msNow'] || window.performance['oNow'] || window.performance['webkitNow']);
        Ticker._instance = null;
        Ticker.maxDelta = 0;
        return Ticker;
    })();
    return Ticker;
});
