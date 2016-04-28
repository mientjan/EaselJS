define(["require", "exports", "./Interval2"], function (require, exports, Interval2_1) {
    "use strict";
    var RenderInterval = (function () {
        function RenderInterval(container, framePerSecond) {
            var _this = this;
            this.framePerSecond = framePerSecond;
            this.currentTime = 0;
            this.accumulator = 0;
            this.millisecondsPerFrame = 0;
            this.update = function () {
                var dt = _this.millisecondsPerFrame;
                var newTime = Date.now();
                var deltaTime = newTime - _this.currentTime;
                _this.currentTime = newTime;
                if (deltaTime > 25) {
                    deltaTime = 25;
                }
                _this.accumulator += deltaTime;
                while (_this.accumulator >= dt) {
                    _this.accumulator -= dt;
                    integrate(current, t, dt);
                    t += dt;
                }
            };
            this.millisecondsPerFrame = 1000 / framePerSecond;
        }
        RenderInterval.prototype.start = function () {
            this.interval = new Interval2_1.Interval2();
            this.interval.add(this.update);
        };
        RenderInterval.prototype.stop = function () {
            if (this.interval) {
                this.interval.destruct();
            }
        };
        return RenderInterval;
    }());
    exports.RenderInterval = RenderInterval;
});
