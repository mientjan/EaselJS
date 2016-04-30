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
            this._texture = texture;
            if (uv instanceof Rectangle_1.Rectangle) {
                this._uvRectangle;
            }
            this._uv = texture;
        }
        return Sprite;
    }(DisplayObject_1.DisplayObject));
    exports.Sprite = Sprite;
});
