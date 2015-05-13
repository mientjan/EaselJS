var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../display/DisplayObject', '../behavior/ButtonBehavior'], function (require, exports, DisplayObject, ButtonBehavior) {
    var ImageButton = (function (_super) {
        __extends(ImageButton, _super);
        function ImageButton(data, width, height, x, y, regX, regY) {
            var _this = this;
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 7 /* BITMAP */;
            this._bitmaps = {
                idle: null,
                over: null,
                down: null,
                disabled: null
            };
            this._bitmap = null;
            this.addBehavior(new ButtonBehavior());
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
    })(DisplayObject);
    return ImageButton;
});
