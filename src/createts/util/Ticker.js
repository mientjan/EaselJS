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
    /**
     * The Ticker provides  a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe to the tick
     * event to be notified when a set time interval has elapsed.
     *
     * Note that the interval that the tick event is called is a target interval, and may be broadcast at a slower interval
     * during times of high CPU load. The Ticker class uses a static interface (ex. <code>Ticker.getPaused()</code>) and
     * should not be instantiated.
     *
     * <h4>Example</h4>
     *
     *      createjs.Ticker.addEventListener("tick", handleTick);
     *      function handleTick(event) {
     *          // Actions carried out each frame
     *          if (!event.paused) {
     *              // Actions carried out when the Ticker is not paused.
     *          }
     *      }
     *
     * To update a stage every tick, the {{#crossLink "Stage"}}{{/crossLink}} instance can also be used as a listener, as
     * it will automatically update when it receives a tick event:
     *
     *      createjs.Ticker.addEventListener("tick", stage);
     *
     * @class Ticker
     * @uses EventDispatcher
     * @static
     **/
    var Ticker = (function () {
        function Ticker() {
            var _this = this;
            // public static properties:
            /**
             * Specifies the timing api (setTimeout or requestAnimationFrame) and mode to use. See
             * {{#crossLink "Ticker/TIMEOUT"}}{{/crossLink}}, {{#crossLink "Ticker/RAF"}}{{/crossLink}}, and
             * {{#crossLink "Ticker/RAF_SYNCHED"}}{{/crossLink}} for mode details.
             * @property timingMode
             * @static
             * @type {String}
             * @default  Ticker.TIMINGMODE_RAF
             **/
            this.timingMode = Ticker.TIMING_MODE_RAF;
            // private static properties:
            /**
             * @property _isRunning
             * @type {Boolean}
             * @protected
             **/
            this._isRunning = false;
            /**
             * @property _interval
             * @type {Number}
             * @protected
             **/
            this._interval = 50.0;
            /**
             * @property _lastTime
             * @type {Number}
             * @protected
             **/
            this._lastTime = 0;
            /**
             * Stores the timeout or requestAnimationFrame id.
             *
             * @property _timerId
             * @type {Number}
             * @protected
             **/
            this._timerId = -1;
            this.signals = {
                tick: new Signal1(),
                started: new Signal(),
                stopped: new Signal()
            };
            /**
             * True if currently using requestAnimationFrame, false if using setTimeout.
             *
             * @property _isUsingRAF
             * @type {Boolean}
             * @protected
             **/
            this._isUsingRAF = true;
            // private static methods:
            /**
             * @method _handleSynch
             * @static
             * @protected
             **/
            this._handleSynch = function () {
                _this._timerId = -1;
                _this._setupTick();
                // run if enough time has elapsed, with a little bit of flexibility to be early:
                if (Ticker._getTime() - _this._lastTime >= (_this._interval - 1) * 0.97) {
                    _this._tick();
                }
            };
            /**
             * @method _handleRAF
             * @static
             * @protected
             **/
            this._handleRAF = function () {
                _this._timerId = -1;
                _this._setupTick();
                _this._tick();
            };
            /**
             * @method _handleTimeout
             * @static
             * @protected
             **/
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
        /**
         * Starts the Ticker. Use stop() to stop the Ticker.
         *
         * @method stop
         **/
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
        /**
         * Stops the Ticker. Use start() to restart the Ticker.
         *
         * @method stop
         **/
        Ticker.prototype.stop = function () {
            if (!this._isRunning)
                return;
            if (this._isUsingRAF) {
                var fn = window.cancelAnimationFrame || window['webkitCancelAnimationFrame'] || window['mozCancelAnimationFrame'] || window['oCancelAnimationFrame'] || window['msCancelAnimationFrame'];
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
        /**
         *
         * @returns {SignalConnection}
         */
        Ticker.prototype.addTickListener = function (fn) {
            return this.signals.tick.connectImpl(fn, false);
        };
        /**
         * Sets the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
         *
         * Note actual time between ticks may be more than requested depending on CPU load.
         * @method setInterval
         * @static
         * @param {Number} interval Time in milliseconds between ticks. Default value is 50.
         **/
        Ticker.prototype.setInterval = function (interval) {
            this._interval = interval;
            if (this._isRunning) {
                this._setupTick();
            }
        };
        /**
         * Returns the current target time between ticks, as set with {{#crossLink "Ticker/setInterval"}}{{/crossLink}}.
         * @method getInterval
         * @static
         * @return {Number} The current target interval in milliseconds between tick events.
         **/
        Ticker.prototype.getInterval = function () {
            return this._interval;
        };
        /**
         * Sets the target frame rate in frames per second (FPS). For example, with an interval of 40, <code>getFPS()</code>
         * will return 25 (1000ms per second divided by 40 ms per tick = 25fps).
         * @method setFPS
         * @static
         * @param {Number} value Target number of ticks broadcast per second.
         **/
        Ticker.prototype.setFPS = function (value) {
            this.setInterval(1000 / value);
        };
        /**
         * Returns the target frame rate in frames per second (FPS). For example, with an interval of 40, <code>getFPS()</code>
         * will return 25 (1000ms per second divided by 40 ms per tick = 25fps).
         * @method getFPS
         * @static
         * @return {Number} The current target number of frames / ticks broadcast per second.
         **/
        Ticker.prototype.getFPS = function () {
            return 1000 / this._interval;
        };
        /**
         * Returns a boolean indicating whether Ticker is currently running.
         *
         * @method getIsRunning
         * @static
         * @return {Boolean} Whether the Ticker is currently running.
         **/
        Ticker.prototype.getIsRunning = function () {
            return this._isRunning;
        };
        /**
         * @method _setupTick
         * @static
         * @protected
         **/
        Ticker.prototype._setupTick = function () {
            if (this._timerId > -1) {
                return;
            } // avoid duplicates
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
        /**
         * @method _tick
         * @static
         * @protected
         **/
        Ticker.prototype._tick = function () {
            var time = Ticker._getTime();
            var delta = time - this._lastTime;
            this._lastTime = time;
            if (this.signals.tick.hasListeners()) {
                var maxDelta = Ticker.maxDelta;
                this.signals.tick.emit((maxDelta && delta > maxDelta) ? maxDelta : delta);
            }
        };
        /**
         * In this mode, Ticker uses the requestAnimationFrame API, but attempts to synch the ticks to target framerate. It
         * uses a simple heuristic that compares the time of the RAF return to the target time for the current frame and
         * dispatches the tick when the time is within a certain threshold.
         *
         * This mode has a higher variance for time between frames than TIMEOUT, but does not require that content be time
         * based as with RAF while gaining the benefits of that API (screen synch, background throttling).
         *
         * Variance is usually lowest for framerates that are a divisor of the RAF frequency. This is usually 60, so
         * framerates of 10, 12, 15, 20, and 30 work well.
         *
         * Falls back on TIMEOUT if the requestAnimationFrame API is not supported.
         * @property RAF_SYNCHED
         * @static
         * @type {String}
         * @default "synched"
         * @readonly
         **/
        Ticker.TIMING_MODE_RAFSYNCHED = 'raf_synched';
        /**
         * In this mode, Ticker passes through the requestAnimationFrame heartbeat, ignoring the target framerate completely.
         * Because requestAnimationFrame frequency is not deterministic, any content using this mode should be time based.
         * You can leverage {{#crossLink "Ticker/getTime"}}{{/crossLink}} and the tick event object's "delta" properties
         * to make this easier.
         *
         * Falls back on TIMEOUT if the requestAnimationFrame API is not supported.
         * @property RAF
         * @static
         * @type {String}
         * @default "raf"
         * @readonly
         **/
        Ticker.TIMING_MODE_RAF = 'raf';
        /**
         * In this mode, Ticker uses the setTimeout API. This provides predictable, adaptive frame timing, but does not
         * provide the benefits of requestAnimationFrame (screen synch, background throttling).
         * @property TIMEOUT
         * @static
         * @type {String}
         * @default "timer"
         * @readonly
         **/
        Ticker.TIMING_MODE_TIMEOUT = 'timeout';
        /**
         * @method _getTime
         * @static
         * @protected
         **/
        Ticker.now = window.performance && (window.performance.now || window.performance['mozNow'] || window.performance['msNow'] || window.performance['oNow'] || window.performance['webkitNow']);
        Ticker._instance = null;
        /**
         * Specifies a maximum value for the delta property in the tick event object. This is useful when building time
         * based animations and systems to prevent issues caused by large time gaps caused by background tabs, system sleep,
         * alert dialogs, or other blocking routines. Double the expected frame duration is often an effective value
         * (ex. maxDelta=50 when running at 40fps).
         *
         * This does not impact any other values (ex. time, runTime, etc), so you may experience issues if you enable maxDelta
         * when using both delta and other values.
         *
         * If 0, there is no maximum.
         * @property maxDelta
         * @static
         * @type {number}
         * @default 0
         */
        Ticker.maxDelta = 0;
        return Ticker;
    })();
    return Ticker;
});
