var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../display/DisplayObject", "../geom/Size"], function (require, exports, DisplayObject_1, Size_1) {
    var BitmapNinePatch = (function (_super) {
        __extends(BitmapNinePatch, _super);
        function BitmapNinePatch(ninePatch, width, height, x, y, regX, regY) {
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 1024;
            this._isLoaded = false;
            this._patch = ninePatch;
            console.log(this._patch.texture.hasLoaded());
            if (!this._patch.texture.hasLoaded()) {
                this._patch.texture.load().then(this.onLoad.bind(this));
            }
            else {
                this.onLoad();
            }
        }
        BitmapNinePatch.prototype.onLoad = function () {
            console.log('ONLOAD!!', this);
            this._isLoaded = true;
        };
        BitmapNinePatch.prototype.isLoaded = function () {
            return this._isLoaded;
        };
        BitmapNinePatch.prototype.setContentSize = function (width, height) {
            var imageSize = new Size_1.default(this._patch.texture.width, this._patch.texture.height);
            this.setWidth(this._patch.rectangle.x
                + Math.max(this._patch.rectangle.width, width)
                + imageSize.width - (this._patch.rectangle.x + this._patch.rectangle.width));
            this.setHeight(this._patch.rectangle.y
                + Math.max(this._patch.rectangle.height, height)
                + imageSize.height - (this._patch.rectangle.y + this._patch.rectangle.height));
            return this;
        };
        BitmapNinePatch.prototype.getRectangle = function () {
            return this._patch.rectangle;
        };
        BitmapNinePatch.prototype.draw = function (ctx, ignoreCache) {
            if (!this._isLoaded) {
                return false;
            }
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            var textures = this._patch.getTextures(this.width, this.height);
            for (var i = 0; i < textures.length; i++) {
                var texture = textures[i];
                texture.draw(ctx);
            }
            return true;
        };
        return BitmapNinePatch;
    })(DisplayObject_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BitmapNinePatch;
});
