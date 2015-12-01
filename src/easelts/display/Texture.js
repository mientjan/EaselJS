define(["require", "exports", "../../createts/util/Promise", "../geom/Size", "../util/MathUtil"], function (require, exports, Promise_1, Size_1, MathUtil_1) {
    var Texture = (function () {
        function Texture(source, autoload) {
            if (autoload === void 0) { autoload = false; }
            this.webGLTexture = null;
            this.width = 0;
            this.height = 0;
            this._loadPromise = null;
            this._hasLoaded = false;
            this.source = source;
            if (autoload) {
                this.load();
            }
        }
        Texture.createFromString = function (source, autoload) {
            if (autoload === void 0) { autoload = false; }
            var img = document.createElement('img');
            return new Texture(img, autoload);
        };
        Texture.prototype.hasLoaded = function () {
            return this._hasLoaded;
        };
        Texture.prototype.isLoading = function () {
            return this._loadPromise != null;
        };
        Texture.prototype.load = function (onProgress) {
            var _this = this;
            if (!this._hasLoaded) {
                if (!this._loadPromise) {
                    this._loadPromise = new Promise_1.default(function (resolve, reject) {
                        return _this._load(function (scope) {
                            resolve(scope);
                            _this._loadPromise = null;
                        }, reject);
                    });
                }
                return this._loadPromise;
            }
            if (onProgress) {
                onProgress(1);
            }
            return Promise_1.default.resolve(this);
        };
        Texture.prototype._load = function (onComplete, onError) {
            var bitmap = this.source;
            var tagName = '';
            if (bitmap) {
                tagName = bitmap.tagName.toLowerCase();
            }
            switch (tagName) {
                case 'img':
                    {
                        if ((bitmap['complete'] || bitmap['readyState'] >= 2)) {
                            this.initImage(bitmap);
                        }
                        else {
                            bitmap.onload = (function (scope) {
                                return function (ev) {
                                    scope.initImage(this);
                                    onComplete(scope);
                                };
                            })(this);
                            if (onError) {
                                bitmap.onerror = onerror;
                            }
                        }
                        break;
                    }
                case 'canvas':
                    {
                        this.initCanvas(bitmap);
                        onComplete(this);
                        break;
                    }
            }
        };
        Texture.prototype.initImage = function (image) {
            this.width = image.naturalWidth;
            this.height = image.naturalHeight;
            this._hasLoaded = true;
        };
        Texture.prototype.initCanvas = function (canvas) {
            this.width = canvas.width;
            this.height = canvas.height;
            this._hasLoaded = true;
        };
        Texture.prototype.getWidth = function () {
            return this.width;
        };
        Texture.prototype.getHeight = function () {
            return this.height;
        };
        Texture.prototype.draw = function (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
            ctx.drawImage(this.source, sx, sy, sw, sh, dx, dy, dw, dh);
            return true;
        };
        Texture.prototype.drawWebGL = function (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
            return true;
        };
        Texture.prototype.bindTexture = function (ctx) {
            var bitmap = this.source;
            if (this.hasLoaded()) {
                if (!(MathUtil_1.default.isPowerOfTwo(this.width) && MathUtil_1.default.isPowerOfTwo(this.height))) {
                    if (console && console.warn)
                        console.warn("Texture " + this.width + "x" + this.height + " is not power of 2", this);
                }
                if (!this.webGLTexture) {
                    var texture = this.webGLTexture = ctx.createTexture();
                    ctx.bindTexture(ctx.TEXTURE_2D, texture);
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, bitmap);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                }
                return texture;
            }
        };
        Texture.prototype.getSize = function () {
            return new Size_1.default(this.width, this.height);
        };
        Texture.prototype.destruct = function () {
            this.source = null;
            if (this.webGLTexture) {
                delete this.webGLTexture;
            }
            this._loadPromise = null;
        };
        return Texture;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Texture;
});
