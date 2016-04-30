var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./CanvasElement"], function (require, exports, CanvasElement_1) {
    "use strict";
    var CanvasWebGLElement = (function (_super) {
        __extends(CanvasWebGLElement, _super);
        function CanvasWebGLElement(width, height, domElement) {
            _super.call(this, width, height, domElement);
            this._context = this._domElement.getContext('webgl');
        }
        CanvasWebGLElement.prototype.getContext = function () {
            return this._context;
        };
        CanvasWebGLElement.prototype.clear = function () {
            this._context.clear(this._context.COLOR_BUFFER_BIT);
        };
        return CanvasWebGLElement;
    }(CanvasElement_1.CanvasElement));
    exports.CanvasWebGLElement = CanvasWebGLElement;
});
