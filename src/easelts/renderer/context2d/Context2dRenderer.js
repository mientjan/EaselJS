define(["require", "exports", "../../../core/event/Signal", "../../component/Stats"], function (require, exports, Signal_1, Stats_1) {
    "use strict";
    var Context2dRenderer = (function () {
        function Context2dRenderer() {
            this._autoClear = true;
            this.sourceRect = null;
            this.drawstartSignal = new Signal_1.Signal();
            this.drawendSignal = new Signal_1.Signal();
        }
        Context2dRenderer.prototype.setFpsCounter = function (value) {
            if (value) {
                this._fpsCounter = new Stats_1.Stats;
            }
            else {
                this._fpsCounter = null;
            }
            return this;
        };
        Context2dRenderer.prototype.setElement = function (element) {
            this._element = element;
            this._context = element.getContext();
        };
        Context2dRenderer.prototype.render = function (item) {
            var ctx = this._context;
            var element = this._element;
            var autoClear = this._autoClear;
            this.drawstartSignal.emit();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (autoClear) {
                element.clear();
            }
            ctx.save();
            if (this.sourceRect) {
                ctx.beginPath();
                ctx.rect(this.sourceRect.x, this.sourceRect.y, this.sourceRect.width, this.sourceRect.height);
                ctx.clip();
            }
            item.updateContext(ctx);
            item.draw(ctx, false);
            ctx.restore();
            if (this._fpsCounter) {
                this._fpsCounter.update();
                ctx.save();
                this._fpsCounter.draw(ctx, false);
                ctx.restore();
            }
            this.drawendSignal.emit();
        };
        return Context2dRenderer;
    }());
    exports.Context2dRenderer = Context2dRenderer;
});
