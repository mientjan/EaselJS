var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DisplayObject'], function (require, exports, DisplayObject) {
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(imageOrUri, width, height, x, y, regX, regY) {
            var _this = this;
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 7 /* BITMAP */;
            this.bitmapType = 0 /* UNKNOWN */;
            this.loaded = false;
            this.image = null;
            this._imageNaturalWidth = null;
            this._imageNaturalHeight = null;
            this.sourceRect = null;
            this.destinationRect = null;
            var image;
            if (typeof imageOrUri == "string") {
                image = document.createElement("img");
                image.src = imageOrUri;
            }
            else {
                image = imageOrUri;
            }
            var tagName = '';
            if (image) {
                tagName = image.tagName.toLowerCase();
            }
            switch (tagName) {
                case 'img':
                    {
                        this.image = image;
                        this.bitmapType = 1 /* IMAGE */;
                        if (this.image && (this.image['complete'] || this.image['getContext'] || this.image['readyState'] >= 2)) {
                            this.onLoad();
                        }
                        else {
                            this.image.addEventListener('load', function () { return _this.onLoad(); });
                        }
                        break;
                    }
                case 'video':
                    {
                        this.image = image;
                        this.bitmapType = 2 /* VIDEO */;
                        if (this.width == 0 || this.height == 0) {
                            throw new Error('width and height must be set when using canvas / video');
                        }
                        this.onLoad();
                        break;
                    }
                case 'canvas':
                    {
                        this.image = image;
                        this.bitmapType = 3 /* CANVAS */;
                        if (this.width == 0 || this.height == 0) {
                            throw new Error('width and height must be set when using canvas / video');
                        }
                        this.onLoad();
                        break;
                    }
            }
        }
        Bitmap.prototype.onLoad = function () {
            if (this.bitmapType == 1 /* IMAGE */) {
                this._imageNaturalWidth = this.image.naturalWidth;
                this._imageNaturalHeight = this.image.naturalHeight;
                if (!this.width) {
                    this.width = this._imageNaturalWidth;
                }
                if (!this.height) {
                    this.height = this._imageNaturalHeight;
                }
            }
            else {
                if (!this.width) {
                    this.width = this.image.width;
                }
                if (!this.height) {
                    this.height = this.image.height;
                }
            }
            this.isDirty = true;
            this.dispatchEvent(Bitmap.EVENT_ONLOAD);
            this.loaded = true;
        };
        Bitmap.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || this.loaded;
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        Bitmap.prototype.draw = function (ctx, ignoreCache) {
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            if (this.isVisible()) {
                var sourceRect = this.sourceRect;
                var destRect = this.destinationRect;
                var width = this.width;
                var height = this.height;
                if (sourceRect && !destRect) {
                    ctx.drawImage(this.image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, 0, 0, width, height);
                }
                else if (!sourceRect && destRect) {
                    ctx.drawImage(this.image, 0, 0, width, height, destRect.x, destRect.y, destRect.width, destRect.height);
                }
                else if (sourceRect && destRect) {
                    ctx.drawImage(this.image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
                }
                else {
                    if (this.bitmapType == 1 /* IMAGE */) {
                        if (this._imageNaturalWidth == 0 || this._imageNaturalHeight == 0) {
                            this._imageNaturalWidth = this.image.naturalWidth;
                            this._imageNaturalHeight = this.image.naturalHeight;
                        }
                        if (this._imageNaturalWidth != 0 && this._imageNaturalHeight != 0) {
                            if (width == 0) {
                                this.width = width = this._imageNaturalWidth;
                            }
                            if (height == 0) {
                                this.height = height = this._imageNaturalHeight;
                            }
                            ctx.drawImage(this.image, 0, 0, this._imageNaturalWidth, this._imageNaturalHeight, 0, 0, width, height);
                        }
                    }
                    else {
                        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, width, height);
                    }
                }
            }
            return true;
        };
        Bitmap.prototype.getBounds = function () {
            var rect = _super.prototype.getBounds.call(this);
            if (rect) {
                return rect;
            }
            var o = this.sourceRect || this.image;
            return this.loaded ? this._rectangle.setProperies(0, 0, o.width, o.height) : null;
        };
        Bitmap.prototype.clone = function () {
            var o = new Bitmap(this.image);
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
            this.image = null;
            this.sourceRect = null;
            this.destinationRect = null;
            this._imageNaturalWidth = null;
            this._imageNaturalHeight = null;
            _super.prototype.destruct.call(this);
        };
        Bitmap.EVENT_ONLOAD = 'onload';
        return Bitmap;
    })(DisplayObject);
    return Bitmap;
});
