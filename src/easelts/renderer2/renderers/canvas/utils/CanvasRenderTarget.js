define(["require", "exports"], function (require, exports) {
    "use strict";
    var CanvasRenderTarget = (function () {
        function CanvasRenderTarget(width, height, resolution) {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.resolution = resolution || 1;
            this.resize(width, height);
        }
        Object.defineProperty(CanvasRenderTarget.prototype, "width", {
            get: function () {
                return this.canvas.width;
            },
            set: function (value) {
                this.canvas.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasRenderTarget.prototype, "height", {
            get: function () {
                return this.canvas.height;
            },
            set: function (value) {
                this.canvas.height = value;
            },
            enumerable: true,
            configurable: true
        });
        CanvasRenderTarget.prototype.clear = function () {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        CanvasRenderTarget.prototype.resize = function (width, height) {
            this.canvas.width = width * this.resolution;
            this.canvas.height = height * this.resolution;
        };
        CanvasRenderTarget.prototype.destroy = function () {
            this.context = null;
            this.canvas = null;
        };
        return CanvasRenderTarget;
    }());
    exports.CanvasRenderTarget = CanvasRenderTarget;
});
