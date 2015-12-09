define(["require", "exports"], function (require, exports) {
    var WebGLBuffer = (function () {
        function WebGLBuffer(width, height, element) {
            if (element === void 0) { element = document.createElement('canvas'); }
            this.transparent = true;
            this.background = null;
            this.element = element;
            this.context = this.element.getContext('webgl');
            this.element.width = width;
            this.element.height = height;
        }
        Object.defineProperty(WebGLBuffer.prototype, "width", {
            get: function () {
                return this.element.width;
            },
            set: function (value) {
                this.element.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebGLBuffer.prototype, "height", {
            get: function () {
                return this.element.height;
            },
            set: function (value) {
                this.element.height = value;
            },
            enumerable: true,
            configurable: true
        });
        WebGLBuffer.prototype.draw = function (ctx) {
        };
        WebGLBuffer.prototype.clear = function () {
            this.context.clear(this.context.COLOR_BUFFER_BIT);
        };
        WebGLBuffer.prototype.setSize = function (width, height) {
            this.element.width = width;
            this.element.height = height;
        };
        WebGLBuffer.prototype.destruct = function () {
            this.context = null;
            this.element = null;
        };
        return WebGLBuffer;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLBuffer;
});
