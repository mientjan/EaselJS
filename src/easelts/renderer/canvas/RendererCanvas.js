var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../buffer/CanvasBuffer"], function (require, exports, CanvasBuffer_1) {
    var RendererCanvas = (function (_super) {
        __extends(RendererCanvas, _super);
        function RendererCanvas(width, height, options) {
            _super.call(this, width, height, options);
        }
        RendererCanvas.prototype.render = function (item) {
            item.draw(this.context);
        };
        return RendererCanvas;
    })(CanvasBuffer_1.CanvasBuffer);
});
