define(["require", "exports", "../Canvas2DElement", "../../../core/event/Signal", "../../component/Stats"], function (require, exports, Canvas2DElement_1, Signal_1, Stats_1) {
    "use strict";
    var Context2dRenderer = (function () {
        function Context2dRenderer(element, options) {
            if (element === void 0) { element = document.createElement('canvas'); }
            if (options === void 0) { options = {}; }
            this._autoClear = true;
            this.sourceRect = null;
            this.drawstartSignal = new Signal_1.Signal();
            this.drawendSignal = new Signal_1.Signal();
            if (element instanceof Canvas2DElement_1.Canvas2DElement) {
                this.setElement(element);
            }
            else {
                this.setElement(new Canvas2DElement_1.Canvas2DElement(element.width, element.height, {
                    transparent: false,
                    backgroundColor: '#000000',
                    domElement: element
                }));
            }
            this._pixelRatio = options.pixelRatio || 1;
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
            ctx.setTransform(this._pixelRatio, 0, 0, this._pixelRatio, 0, 0);
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
