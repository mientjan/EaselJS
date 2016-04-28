var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./CanvasElement", "../geom/Rectangle"], function (require, exports, CanvasElement_1, Rectangle_1) {
    "use strict";
    (function (Canvas2DElementQuality) {
        Canvas2DElementQuality[Canvas2DElementQuality["LOW"] = 0] = "LOW";
        Canvas2DElementQuality[Canvas2DElementQuality["NORMAL"] = 1] = "NORMAL";
    })(exports.Canvas2DElementQuality || (exports.Canvas2DElementQuality = {}));
    var Canvas2DElementQuality = exports.Canvas2DElementQuality;
    var Canvas2DElement = (function (_super) {
        __extends(Canvas2DElement, _super);
        function Canvas2DElement(width, height, options) {
            if (options === void 0) { options = {
                transparent: true,
                backgroundColor: '#000000'
            }; }
            if (!options.transparent && !options.backgroundColor) {
                throw new Error('options.backgroundColor is required when transparent is false or not defined');
            }
            _super.call(this, width, height, options.domElement);
            this._transparent = options.transparent;
            this._backgroundColor = options.backgroundColor;
            this._context = this._domElement.getContext('2d', { alpha: this._transparent });
            this.setSize(width, height);
        }
        Canvas2DElement.prototype.draw = function (ctx, ignoreCache) {
            var w = this._width, h = this._height;
            ctx.drawImage(this._domElement, 0, 0, w, h, 0, 0, w, h);
        };
        Canvas2DElement.prototype.reset = function () {
            this._context.setTransform(1, 0, 0, 1, 0, 0);
            this.clear();
        };
        Canvas2DElement.prototype.clear = function () {
            if (this._transparent) {
                this._context.clearRect(0, 0, this._width, this._height);
            }
            else {
                this._context.fillStyle = this._backgroundColor;
                this._context.fillRect(0, 0, this._width, this._height);
            }
        };
        Canvas2DElement.prototype.toDataURL = function (backgroundColor, mimeType, quality) {
            if (mimeType === void 0) { mimeType = "image/png"; }
            if (quality === void 0) { quality = 1.0; }
            var ctx = this.getContext();
            var w = this._width;
            var h = this._height;
            var data;
            if (backgroundColor) {
                data = ctx.getImageData(0, 0, w, h);
                var compositeOperation = ctx.globalCompositeOperation;
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, w, h);
            }
            var dataURL = this._domElement.toDataURL(mimeType, quality);
            if (backgroundColor) {
                ctx.clearRect(0, 0, w + 1, h + 1);
                ctx.putImageData(data, 0, 0);
                ctx.globalCompositeOperation = compositeOperation;
            }
            return dataURL;
        };
        Canvas2DElement.prototype.getImageData = function (x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = this._width; }
            if (height === void 0) { height = this._height; }
            return this._context.getImageData(x, y, width, height);
        };
        Canvas2DElement.prototype.getDrawBounds = function () {
            var width = Math.ceil(this._width);
            var height = Math.ceil(this._height);
            var pixels = this.getImageData();
            var data = pixels.data, x0 = width, y0 = height, x1 = 0, y1 = 0;
            for (var i = 3, l = data.length, p = 0; i < l; i += 4, ++p) {
                var px = p % width;
                var py = Math.floor(p / width);
                if (data[i - 3] > 0 ||
                    data[i - 2] > 0 ||
                    data[i - 1] > 0 ||
                    data[i] > 0) {
                    x0 = Math.min(x0, px);
                    y0 = Math.min(y0, py);
                    x1 = Math.max(x1, px);
                    y1 = Math.max(y1, py);
                }
            }
            return new Rectangle_1.default(x0, y0, x1 - x0, y1 - y0);
        };
        Canvas2DElement.prototype.getContext = function () {
            return this._context;
        };
        Canvas2DElement.prototype.setSize = function (width, height) {
            this._domElement.width = this._width = width;
            this._domElement.height = this._height = height;
            this.setQuality(this._quality);
        };
        Canvas2DElement.prototype.setQuality = function (name) {
            var ctx = this._context;
            switch (name) {
                case Canvas2DElementQuality.LOW:
                    {
                        this._quality = name;
                        ctx['mozImageSmoothingEnabled'] = false;
                        ctx['webkitImageSmoothingEnabled'] = false;
                        ctx['msImageSmoothingEnabled'] = false;
                        ctx['imageSmoothingEnabled'] = false;
                        break;
                    }
                case Canvas2DElementQuality.NORMAL:
                    {
                        this._quality = name;
                        ctx['mozImageSmoothingEnabled'] = true;
                        ctx['webkitImageSmoothingEnabled'] = true;
                        ctx['msImageSmoothingEnabled'] = true;
                        ctx['imageSmoothingEnabled'] = true;
                        break;
                    }
            }
        };
        Canvas2DElement.prototype.destruct = function () {
            this._context = null;
            this._domElement = null;
        };
        return Canvas2DElement;
    }(CanvasElement_1.CanvasElement));
    exports.Canvas2DElement = Canvas2DElement;
});
