define(["require", "exports", "../../../core/event/Signal"], function (require, exports, Signal_1) {
    "use strict";
    var Context2dRenderer = (function () {
        function Context2dRenderer() {
            this._autoClear = true;
            this.drawstartSignal = new Signal_1.default();
            this.drawendSignal = new Signal_1.default();
        }
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
            item.updateContext(ctx);
            item.draw(ctx, false);
            ctx.restore();
            this.drawendSignal.emit();
        };
        return Context2dRenderer;
    }());
    exports.Context2dRenderer = Context2dRenderer;
});
