define(["require", "exports", "../../geom/Rectangle"], function (require, exports, Rectangle_1) {
    "use strict";
    var CanvasBuffer = (function () {
        function CanvasBuffer(width, height, options) {
            if (options === void 0) { options = {
                domElement: document.createElement('canvas'),
                transparent: true,
                backgroundColor: '#000000'
            }; }
            this._quality = null;
            if (!options.transparent && !options.backgroundColor) {
                throw new Error('options.backgroundColor is requered when transparent is false');
            }
            this._transparent = options.transparent;
            this._backgroundColor = options.backgroundColor;
            this.domElement = options.domElement;
            this.context = this.domElement.getContext('2d', { alpha: this._transparent });
            this.setSize(width, height);
        }
        Object.defineProperty(CanvasBuffer.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
                this.domElement.width = value;
                this.setQuality(this._quality);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasBuffer.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._height = value;
                this.domElement.height = value;
                this.setQuality(this._quality);
            },
            enumerable: true,
            configurable: true
        });
        CanvasBuffer.prototype.draw = function (ctx, ignoreCache) {
            var w = this._width, h = this._height;
            ctx.drawImage(this.domElement, 0, 0, w, h, 0, 0, w, h);
        };
        CanvasBuffer.prototype.reset = function () {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.clear();
        };
        CanvasBuffer.prototype.clear = function () {
            if (this._transparent) {
                this.context.clearRect(0, 0, this._width, this._height);
            }
            else {
                this.context.fillStyle = this._backgroundColor;
                this.context.fillRect(0, 0, this._width, this._height);
            }
        };
        CanvasBuffer.prototype.toDataURL = function (backgroundColor, mimeType, quality) {
            if (mimeType === void 0) { mimeType = "image/png"; }
            if (quality === void 0) { quality = 1.0; }
            var ctx = this.getContext();
            var w = this.width;
            var h = this.height;
            var data;
            if (backgroundColor) {
                data = ctx.getImageData(0, 0, w, h);
                var compositeOperation = ctx.globalCompositeOperation;
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, w, h);
            }
            var dataURL = this.domElement.toDataURL(mimeType, quality);
            if (backgroundColor) {
                ctx.clearRect(0, 0, w + 1, h + 1);
                ctx.putImageData(data, 0, 0);
                ctx.globalCompositeOperation = compositeOperation;
            }
            return dataURL;
        };
        CanvasBuffer.prototype.getImageData = function (x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = this._width; }
            if (height === void 0) { height = this._height; }
            return this.context.getImageData(x, y, width, height);
        };
        CanvasBuffer.prototype.getDrawBounds = function () {
            var width = Math.ceil(this.width);
            var height = Math.ceil(this.height);
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
        CanvasBuffer.prototype.getContext = function () {
            return this.context;
        };
        CanvasBuffer.prototype.setSize = function (width, height) {
            this.domElement.width = this._width = width;
            this.domElement.height = this._height = height;
            this.setQuality(this._quality);
        };
        CanvasBuffer.prototype.setQuality = function (name) {
            var ctx = this.context;
            switch (name) {
                case 'low':
                    {
                        this._quality = name;
                        ctx['mozImageSmoothingEnabled'] = false;
                        ctx['webkitImageSmoothingEnabled'] = false;
                        ctx['msImageSmoothingEnabled'] = false;
                        ctx['imageSmoothingEnabled'] = false;
                        break;
                    }
                case 'normal':
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
        CanvasBuffer.prototype.destruct = function () {
            this.context = null;
            this.domElement = null;
        };
        return CanvasBuffer;
    }());
    exports.CanvasBuffer = CanvasBuffer;
});
