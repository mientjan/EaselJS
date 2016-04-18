var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../core/event/EventDispatcher", "../../core/util/Promise", "../../core/net/HttpRequest", "../geom/Rectangle"], function (require, exports, EventDispatcher_1, Promise_1, HttpRequest_1, Rectangle_1) {
    "use strict";
    var SpriteSheet = (function (_super) {
        __extends(SpriteSheet, _super);
        function SpriteSheet(dataOrUrl) {
            _super.call(this);
            this.complete = true;
            this.framerate = 0;
            this._animations = null;
            this._frames = null;
            this._images = null;
            this._data = null;
            this.loadCount = 0;
            this._frameHeight = 0;
            this._frameWidth = 0;
            this._numFrames = 0;
            this._regX = 0;
            this._regY = 0;
            this._hasLoaded = false;
            this.url = null;
            if (typeof dataOrUrl == 'string') {
                this.url = dataOrUrl;
            }
            else {
                this.initialize(dataOrUrl);
            }
        }
        SpriteSheet.createSequenceDataFromString = function (images, width, height) {
            var sequenceStructure = {
                "images": images.map(function (src) { return src; }),
                "frames": images.map(function (src, index) { return [0, 0, width, height, index, 0, 0]; }),
                "animations": {
                    "animation": [0, images.length - 1]
                }
            };
            return sequenceStructure;
        };
        SpriteSheet.createFromString = function (images, width, height) {
            return new SpriteSheet(SpriteSheet.createSequenceDataFromString(images, width, height));
        };
        SpriteSheet.load = function (url, spriteSheet, onProgress) {
            if (spriteSheet === void 0) { spriteSheet = new SpriteSheet(''); }
            var baseDir = url;
            if (url.indexOf('.json') > -1) {
                baseDir = url.substr(0, url.lastIndexOf('/'));
            }
            else {
                if (baseDir.substr(-1) == '/') {
                    baseDir = baseDir.substr(0, baseDir.length - 1);
                }
                url += (url.substr(url.length - 1) != '/' ? '/' : '') + 'library.json';
            }
            return HttpRequest_1.default
                .getJSON(url)
                .then(function (json) {
                spriteSheet.url = url;
                for (var i = 0; i < json.images.length; i++) {
                    var image = json.images[i];
                    if (!(/\\/.test(image))) {
                        json.images[i] = baseDir + '/' + image;
                    }
                }
                spriteSheet.initialize(json);
                if (onProgress)
                    onProgress(1);
                return spriteSheet;
            });
        };
        SpriteSheet.prototype.initialize = function (data) {
            var i, l, o, a;
            if (data == null) {
                return;
            }
            this.framerate = data.framerate || 0;
            if (data.images && (l = data.images.length) > 0) {
                a = this._images = [];
                for (i = 0; i < l; i++) {
                    var img = data.images[i];
                    if (typeof img == "string") {
                        var src = img;
                        img = document.createElement("img");
                        img.src = src;
                    }
                    a.push(img);
                    if (!img.getContext && !img.complete) {
                        this.loadCount++;
                        this.complete = false;
                        (function (o) {
                            img.onload = function () {
                                o._handleImageLoad();
                            };
                        })(this);
                    }
                }
            }
            if (data.frames == null) {
            }
            else if (data.frames instanceof Array) {
                this._frames = [];
                a = data.frames;
                for (i = 0, l = a.length; i < l; i++) {
                    var arr = a[i];
                    this._frames.push({ image: this._images[arr[4] ? arr[4] : 0], rect: new Rectangle_1.default(arr[0], arr[1], arr[2], arr[3]), regX: arr[5] || 0, regY: arr[6] || 0 });
                }
            }
            else {
                o = data.frames;
                this._frameWidth = o.width;
                this._frameHeight = o.height;
                this._regX = o.regX || 0;
                this._regY = o.regY || 0;
                this._numFrames = o.count;
                if (this.loadCount == 0) {
                    this._calculateFrames();
                }
            }
            this._animations = [];
            if ((o = data.animations) != null) {
                this._data = {};
                var name;
                for (name in o) {
                    var anim = { name: name };
                    var obj = o[name];
                    if (typeof obj == "number") {
                        a = anim.frames = [obj];
                    }
                    else if (obj instanceof Array) {
                        if (obj.length == 1) {
                            anim.frames = [obj[0]];
                        }
                        else {
                            anim.speed = obj[3];
                            anim.next = obj[2];
                            a = anim.frames = [];
                            for (i = obj[0]; i <= obj[1]; i++) {
                                a.push(i);
                            }
                        }
                    }
                    else {
                        anim.speed = obj.speed;
                        anim.next = obj.next;
                        var frames = obj.frames;
                        a = anim.frames = (typeof frames == "number") ? [frames] : frames.slice(0);
                    }
                    if (anim.next === true || anim.next === undefined) {
                        anim.next = name;
                    }
                    if (anim.next === false || (a.length < 2 && anim.next == name)) {
                        anim.next = null;
                    }
                    if (!anim.speed) {
                        anim.speed = 1;
                    }
                    this._animations.push(name);
                    this._data[name] = anim;
                }
            }
        };
        SpriteSheet.prototype.hasLoaded = function () {
            return this._hasLoaded;
        };
        SpriteSheet.prototype.load = function (onProgress) {
            var _this = this;
            if (this.hasLoaded()) {
                if (onProgress)
                    onProgress(1);
                return new Promise_1.default(function (resolve, reject) {
                    resolve(_this);
                });
            }
            if (this._animations.length > 0) {
                return new Promise_1.default(function (resolve, reject) {
                    var total = _this.loadCount;
                    var kill = setInterval(function () {
                        if (onProgress) {
                            onProgress((total - _this.loadCount) / total);
                        }
                        if (_this.loadCount == 0) {
                            _this._hasLoaded = true;
                            resolve(_this);
                            clearInterval(kill);
                        }
                    }, 1000 / 60);
                });
            }
            if (!this.url) {
                throw new Error('url is not set and there for can not be loaded');
            }
            return SpriteSheet.load(this.url, this, onProgress).catch(function () {
                throw new Error('could not load library');
            });
        };
        SpriteSheet.prototype.getNumFrames = function (animation) {
            var result = 0;
            if (animation == null) {
                result = this._frames ? this._frames.length : this._numFrames;
            }
            else {
                var data = this._data[animation];
                if (data == null) {
                    result = 0;
                }
                else {
                    result = data.frames.length;
                }
            }
            return result;
        };
        SpriteSheet.prototype.getAnimations = function () {
            return this._animations.slice(0);
        };
        SpriteSheet.prototype.getAnimation = function (name) {
            return this._data[name];
        };
        SpriteSheet.prototype.getFrame = function (frameIndex) {
            var frame;
            if (this._frames && (frame = this._frames[frameIndex])) {
                return frame;
            }
            return null;
        };
        SpriteSheet.prototype.getFrameBounds = function (frameIndex, rectangle) {
            var frame = this.getFrame(frameIndex);
            return frame ? (rectangle || new Rectangle_1.default(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height)) : null;
        };
        SpriteSheet.prototype.toString = function () {
            return "[SpriteSheet]";
        };
        SpriteSheet.prototype.clone = function () {
            var o = new SpriteSheet();
            o.complete = this.complete;
            o._animations = this._animations;
            o._frames = this._frames;
            o._images = this._images;
            o._data = this._data;
            o._frameHeight = this._frameHeight;
            o._frameWidth = this._frameWidth;
            o._numFrames = this._numFrames;
            o.loadCount = this.loadCount;
            return o;
        };
        SpriteSheet.prototype._handleImageLoad = function () {
            if (--this.loadCount == 0) {
                this._calculateFrames();
                this.complete = true;
                this.dispatchEvent("complete");
            }
        };
        SpriteSheet.prototype._calculateFrames = function () {
            if (this._frames || this._frameWidth == 0) {
                return;
            }
            this._frames = [];
            var maxFrames = this._numFrames || 100000;
            var frameCount = 0, frameWidth = this._frameWidth, frameHeight = this._frameHeight;
            var spacing = 0;
            var margin = 0;
            imgLoop: for (var i = 0, imgs = this._images; i < imgs.length; i++) {
                var img = imgs[i], imgW = img.width, imgH = img.height;
                var y = margin;
                while (y <= imgH - margin - frameHeight) {
                    var x = margin;
                    while (x <= imgW - margin - frameWidth) {
                        if (frameCount >= maxFrames) {
                            break imgLoop;
                        }
                        frameCount++;
                        this._frames.push({
                            image: img,
                            rect: new Rectangle_1.default(x, y, frameWidth, frameHeight),
                            regX: this._regX,
                            regY: this._regY
                        });
                        x += frameWidth + spacing;
                    }
                    y += frameHeight + spacing;
                }
            }
            this._numFrames = frameCount;
        };
        return SpriteSheet;
    }(EventDispatcher_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SpriteSheet;
});
