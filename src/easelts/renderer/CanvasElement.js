define(["require", "exports"], function (require, exports) {
    "use strict";
    var CanvasElement = (function () {
        function CanvasElement(width, height, domElement) {
            if (domElement === void 0) { domElement = document.createElement('canvas'); }
            this._domElement = domElement;
            this.setSize(width, height);
        }
        Object.defineProperty(CanvasElement.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this.setWidth(value);
            },
            enumerable: true,
            configurable: true
        });
        CanvasElement.prototype.setWidth = function (value) {
            this._width = value;
            this._domElement.width = value;
        };
        CanvasElement.prototype.getWidth = function () {
            return this._width;
        };
        Object.defineProperty(CanvasElement.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this.setHeight(value);
            },
            enumerable: true,
            configurable: true
        });
        CanvasElement.prototype.setHeight = function (value) {
            this._height = value;
            this._domElement.height = value;
        };
        CanvasElement.prototype.getHeight = function () {
            return this._height;
        };
        CanvasElement.prototype.getDomElement = function () {
            return this._domElement;
        };
        CanvasElement.prototype.setSize = function (width, height) {
            this.setWidth(width);
            this.setHeight(height);
        };
        CanvasElement.prototype.getDomElement = function () {
            return this._domElement;
        };
        CanvasElement.prototype.destruct = function () {
            this._domElement = null;
        };
        return CanvasElement;
    }());
    exports.CanvasElement = CanvasElement;
});
