define(["require", "exports"], function (require, exports) {
    "use strict";
    var Context2dRenderer = (function () {
        function Context2dRenderer() {
        }
        Context2dRenderer.prototype.setElement = function (element) {
            this._element = element;
            this._context = element.getContext();
        };
        Context2dRenderer.prototype.render = function (item) {
            item.draw(this._context);
        };
        return Context2dRenderer;
    }());
    exports.Context2dRenderer = Context2dRenderer;
});
