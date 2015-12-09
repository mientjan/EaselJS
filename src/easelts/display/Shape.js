var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Graphics", "./DisplayObject"], function (require, exports, Graphics_1, DisplayObject_1) {
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape(graphics, width, height, x, y, regX, regY) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 16;
            this.graphics = graphics ? graphics : new Graphics_1.default();
        }
        Shape.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || (this.graphics && !this.graphics.isEmpty());
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        Shape.prototype.draw = function (ctx, ignoreCache) {
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            this.graphics.draw(ctx, this);
            return true;
        };
        Shape.prototype.clone = function (recursive) {
            if (recursive === void 0) { recursive = false; }
            var o = new Shape((recursive && this.graphics) ? this.graphics.clone() : this.graphics);
            this.cloneProps(o);
            return o;
        };
        Shape.prototype.toString = function () {
            return "[Shape ()]";
        };
        return Shape;
    })(DisplayObject_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Shape;
});
