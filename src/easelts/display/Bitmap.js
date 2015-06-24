/*
 * Bitmap
 *
 * Copyright (c) 2010 gskinner.com, inc.
 * Copyright (c) 2014-2015 Mient-jan Stelling.
 * Copyright (c) 2015 mediamonks.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DisplayObject'], function (require, exports, DisplayObject) {
    /**
     * A Bitmap represents an Image, Canvas, or Video in the display list. A Bitmap can be instantiated using an existing
     * HTML element, or a string.
     *
     * <h4>Example</h4>
     *
     *      var bitmap = new createjs.Bitmap("imagePath.jpg");
     *
     * <strong>Notes:</strong>
     * <ol>
     *     <li>When a string path or image tag that is not yet loaded is used, the stage may need to be redrawn before it
     *      will be displayed.</li>
     *     <li>Bitmaps with an SVG source currently will not respect an alpha value other than 0 or 1. To get around this,
     *     the Bitmap can be cached.</li>
     *     <li>Bitmaps with an SVG source will taint the canvas with cross-origin data, which prevents interactivity. This
     *     happens in all browsers except recent Firefox builds.</li>
     *     <li>Images loaded cross-origin will throw cross-origin security errors when interacted with using a mouse, using
     *     methods such as `getObjectUnderPoint`, or using filters, or caching. You can get around this by setting
     *     `crossOrigin` flags on your images before passing them to EaselJS, eg: `img.crossOrigin="Anonymous";`</li>
     * </ol>
     *
     * @class Bitmap
     * @extends DisplayObject
     * @constructor
     * @author Mient-jan Stelling <mientjan.stelling@gmail.com>
     * @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
     * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
     * If it is a URI, a new Image object will be constructed and assigned to the .image property.
     **/
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        /**
         * @class Bitmap
         * @constructor
         * @param {string|HTMLImageElement} imageOrUri The source object or URI to an image to
         * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
         * If it is a URI, a new Image object will be constructed and assigned to the `.image` property.
         * @param {string|number} width
         * @param {string|number} height
         * @param {string|number} x
         * @param {string|number} y
         * @param {string|number} regX
         * @param {string|number} regY
         */
        function Bitmap(imageOrUri, width, height, x, y, regX, regY) {
            var _this = this;
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            // public properties:
            this.type = 7 /* BITMAP */;
            this.bitmapType = 0 /* UNKNOWN */;
            /**
             * is Bitmap Loaded
             * @type {boolean}
             */
            this.loaded = false;
            /**
             * The image to render. This can be an Image, a Canvas, or a Video.
             * @property image
             * @type HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
             **/
            this.image = null;
            this._imageNaturalWidth = null;
            this._imageNaturalHeight = null;
            /**
             * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
             * @property sourceRect
             * @type Rectangle
             * @default null
             */
            this.sourceRect = null;
            /**
             * Specifies an area of the destination wil be drawn to.
             * @property destinationRect
             * @type Rectangle
             * @default null
             */
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
        /**
         * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
         * This does not account for whether it would be visible within the boundaries of the stage.
         *
         * @method isVisible
         * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
         **/
        Bitmap.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || this.loaded;
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        /**
         * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
         * Returns true if the draw was handled (useful for overriding functionality).
         *
         * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
         * @method draw
         * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
         * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
         * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
         * into itself).
         * @return {Boolean}
         **/
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
        /**
         * Docced in superclass.
         */
        Bitmap.prototype.getBounds = function () {
            var rect = _super.prototype.getBounds.call(this);
            if (rect) {
                return rect;
            }
            var o = this.sourceRect || this.image;
            return this.loaded ? this._rectangle.setProperies(0, 0, o.width, o.height) : null;
        };
        /**
         * Returns a clone of the Bitmap instance.
         * @method clone
         * @return {Bitmap} a clone of the Bitmap instance.
         **/
        Bitmap.prototype.clone = function () {
            var o = new Bitmap(this.image);
            if (this.sourceRect)
                o.sourceRect = this.sourceRect.clone();
            if (this.destinationRect)
                o.destinationRect = this.destinationRect.clone();
            this.cloneProps(o);
            return o;
        };
        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {String} a string representation of the instance.
         **/
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
