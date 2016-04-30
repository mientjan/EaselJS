var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./DisplayObject", "./Texture"], function (require, exports, DisplayObject_1, Texture_1) {
    "use strict";
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(imageOrUri, width, height, x, y, regX, regY) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 32;
            this.source = null;
            this._isTiled = false;
            this.sourceRect = null;
            this.destinationRect = null;
            if (typeof imageOrUri == 'string') {
                this.source = Texture_1.Texture.createFromString(imageOrUri, false);
            }
            else if (imageOrUri instanceof Texture_1.Texture) {
                this.source = imageOrUri;
            }
            else {
                this.source = new Texture_1.Texture(imageOrUri);
            }
            this.source.load();
        }
        Bitmap.prototype.hasLoaded = function () {
            return this.source.hasLoaded();
        };
        Bitmap.prototype.load = function (onProgress) {
            var _this = this;
            return this.source.load(onProgress).then(function () {
                return _this;
            });
        };
        Bitmap.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || this.hasLoaded();
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        Bitmap.prototype.draw = function (ctx, ignoreCache) {
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            var sourceRect = this.sourceRect;
            var destRect = this.destinationRect;
            var width = this.width;
            var height = this.height;
            var source = this.source;
            if (sourceRect && !destRect) {
                source.draw(ctx, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, 0, 0, width, height);
            }
            else if (!sourceRect && destRect) {
                source.draw(ctx, 0, 0, source.getWidth(), source.getHeight(), destRect.x, destRect.y, destRect.width, destRect.height);
            }
            else if (sourceRect && destRect) {
                source.draw(ctx, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
            }
            else {
                if (!width) {
                    width = source.width;
                }
                if (!height) {
                    height = source.height;
                }
                source.draw(ctx, 0, 0, source.getWidth(), source.getHeight(), 0, 0, width, height);
            }
            return true;
        };
        Bitmap.prototype.getBounds = function () {
            var rect = _super.prototype.getBounds.call(this);
            if (rect) {
                return rect;
            }
            var obj = this.sourceRect || this.source;
            return this.hasLoaded() ? this._rectangle.setProperies(0, 0, obj.width, obj.height) : null;
        };
        Bitmap.prototype.getImageSize = function () {
            if (!this.hasLoaded()) {
                throw new Error('bitmap has not yet been loaded, getImageSize can only be called when bitmap has been loaded');
            }
            return this.source.getSize();
        };
        Bitmap.prototype.clone = function () {
            var o = new Bitmap(this.source);
            if (this.sourceRect)
                o.sourceRect = this.sourceRect.clone();
            if (this.destinationRect)
                o.destinationRect = this.destinationRect.clone();
            this.cloneProps(o);
            return o;
        };
        Bitmap.prototype.toString = function () {
            return "[Bitmap (name=" + this.name + ")]";
        };
        Bitmap.prototype.destruct = function () {
            this.source.destruct();
            this.source = null;
            this.sourceRect = null;
            this.destinationRect = null;
            _super.prototype.destruct.call(this);
        };
        return Bitmap;
    }(DisplayObject_1.DisplayObject));
    exports.Bitmap = Bitmap;
});
