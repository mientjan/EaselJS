var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../geom/Rectangle", "./DisplayObject"], function (require, exports, Rectangle_1, DisplayObject_1) {
    "use strict";
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(texture, uv) {
            if (uv === void 0) { uv = []; }
            _super.call(this);
            this._texture = texture;
            if (uv instanceof Rectangle_1.Rectangle) {
                this._uvRectangle = uv;
            }
            else {
                this._uvRectangle;
                this._uv = new Uint16Array(uv);
            }
        }
        Sprite.prototype.draw = function (ctx, ignoreCache) {
            var rectangle = this._uvRectangle, texture = this._texture;
            if (texture.hasLoaded()) {
                if (!rectangle) {
                    var uv = this._uv;
                    var x = Math.min(uv[0], uv[6]) * texture.width, y = Math.min(uv[1], uv[7]) * texture.height, width = (Math.max(uv[2], uv[4]) - x) * texture.width, height = (Math.max(uv[6], uv[5]) - y) * texture.height;
                    rectangle = this._uvRectangle = new Rectangle_1.Rectangle(x, y, width, height);
                }
            }
            texture.draw(ctx, rectangle.x, rectangle.y, rectangle.width, rectangle.height, 0, 0, this.width, this.height);
            return true;
        };
        Sprite.prototype.getTexture = function () {
            return this._texture;
        };
        return Sprite;
    }(DisplayObject_1.DisplayObject));
    exports.Sprite = Sprite;
});
