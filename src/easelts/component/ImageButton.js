var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../display/DisplayObject", "../behavior/ButtonBehavior"], function (require, exports, DisplayObject_1, ButtonBehavior_1) {
    "use strict";
    var ImageButton = (function (_super) {
        __extends(ImageButton, _super);
        function ImageButton(data, width, height, x, y, regX, regY) {
            var _this = this;
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 1024;
            this._bitmaps = {
                idle: null,
                over: null,
                down: null,
                disabled: null
            };
            this._bitmap = null;
            this.addBehavior(new ButtonBehavior_1.default());
            this._bitmaps.idle = data.idle;
            if (data.over)
                this._bitmaps.over = data.over;
            if (data.down)
                this._bitmaps.down = data.down;
            if (data.disabled)
                this._bitmaps.disabled = data.disabled;
            this._bitmap = this._bitmaps.idle;
            this.addEventListener(ImageButton.EVENT_MOUSE_CLICK, function (e) {
                _this._bitmap = _this._bitmaps.idle;
            });
            if (this._bitmaps.over) {
                this.addEventListener(ImageButton.EVENT_MOUSE_OVER, function (e) {
                    _this._bitmap = _this._bitmaps.over;
                });
            }
            if (this._bitmaps.down) {
                this.addEventListener(ImageButton.EVENT_MOUSE_DOWN, function (e) {
                    _this._bitmap = _this._bitmaps.down;
                });
            }
            if (this._bitmaps.disabled) {
                this.addEventListener(ImageButton.EVENT_DISABLED, function (e) {
                    _this._bitmap = _this._bitmaps.disabled;
                });
            }
        }
        ImageButton.prototype.disable = function () {
            if (this._bitmaps.disabled) {
                this._bitmap = this._bitmaps.disabled;
            }
        };
        ImageButton.prototype.enable = function () {
            if (this._bitmaps.idle) {
                this._bitmap = this._bitmaps.idle;
            }
        };
        ImageButton.prototype.draw = function (ctx, ignoreCache) {
            this._bitmap.draw(ctx, ignoreCache);
            return true;
        };
        ImageButton.EVENT_DISABLED = 'disabled';
        return ImageButton;
    }(DisplayObject_1.DisplayObject));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ImageButton;
});
