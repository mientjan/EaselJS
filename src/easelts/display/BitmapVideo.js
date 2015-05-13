var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DisplayObject'], function (require, exports, DisplayObject) {
    var BitmapVideo = (function (_super) {
        __extends(BitmapVideo, _super);
        function BitmapVideo(videoElement, width, height, x, y, regX, regY) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 7 /* BITMAP */;
            this.loaded = true;
            this.video = null;
            this.sourceRect = null;
            this.video = videoElement;
        }
        BitmapVideo.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || this.loaded;
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        BitmapVideo.prototype.draw = function (ctx, ignoreCache) {
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            if (this.loaded) {
                var rect = this.sourceRect;
                if (rect) {
                    ctx.drawImage(this.video, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
                }
                else {
                    ctx.drawImage(this.video, 0, 0);
                }
            }
            return true;
        };
        BitmapVideo.prototype.getBounds = function () {
            var rect = _super.prototype.getBounds.call(this);
            if (rect) {
                return rect;
            }
            var o = this.sourceRect || this.video;
            return this.loaded ? this._rectangle.setProperies(0, 0, o.width, o.height) : null;
        };
        BitmapVideo.prototype.clone = function () {
            var o = new BitmapVideo(this.video);
            if (this.sourceRect) {
                o.sourceRect = this.sourceRect.clone();
            }
            this.cloneProps(o);
            return o;
        };
        BitmapVideo.prototype.toString = function () {
            return "[Bitmap (name=" + this.name + ")]";
        };
        BitmapVideo.EVENT_ONLOAD = 'onload';
        return BitmapVideo;
    })(DisplayObject);
    return BitmapVideo;
});
