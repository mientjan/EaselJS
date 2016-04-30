var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../display/DisplayObject", "../display/SpriteSheet", "../../core/util/Promise", "../../core/util/AnimationQueue", "../../core/util/QueueItem"], function (require, exports, DisplayObject_1, SpriteSheet_1, Promise_1, AnimationQueue_1, QueueItem_1) {
    "use strict";
    var ImageSequence = (function (_super) {
        __extends(ImageSequence, _super);
        function ImageSequence(spriteSheet, fps, width, height, x, y, regX, regY) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 32;
            this.spriteSheet = null;
            this.frames = 0;
            this.frame = 0;
            this.paused = true;
            this._hasLoaded = false;
            this.spriteSheet = spriteSheet;
            this._fps = fps;
            this._queue = new AnimationQueue_1.AnimationQueue(fps, 1000);
        }
        ImageSequence.createFromString = function (images, fps, width, height) {
            var sequenceStructure = {
                "images": images.map(function (src) { return src; }),
                "frames": images.map(function (src, index) { return [0, 0, width, height, index, 0, 0]; }),
                "animations": {
                    "animation": [0, images.length - 1]
                }
            };
            return new ImageSequence(new SpriteSheet_1.SpriteSheet(sequenceStructure), fps, width, height);
        };
        ImageSequence.prototype.hasLoaded = function () {
            return this._hasLoaded;
        };
        ImageSequence.prototype.parseLoad = function () {
            var animations = this.spriteSheet.getAnimations();
            if (animations.length > 1) {
                throw new Error('SpriteSheet not compatible with ImageSequence, has multiple animations. Only supports one');
            }
            this.frames = this.spriteSheet.getNumFrames();
        };
        ImageSequence.prototype.load = function (onProgress) {
            var _this = this;
            if (this._hasLoaded) {
                if (onProgress)
                    onProgress(1);
                return new Promise_1.Promise(function (resolve, reject) {
                    resolve(_this);
                });
            }
            return this.spriteSheet.load(onProgress).then(function (spriteSheet) {
                _this._hasLoaded = true;
                _this.parseLoad();
                return _this;
            }).catch(function () {
                throw new Error('could not load library');
            });
        };
        ImageSequence.prototype.draw = function (ctx, ignoreCache) {
            var frame = this.frame;
            var width = this.width;
            var height = this.height;
            if (frame > -1 && this._hasLoaded) {
                var frameObject = this.spriteSheet.getFrame(frame);
                if (!frameObject) {
                    return false;
                }
                var rect = frameObject.rect;
                if (rect.width && rect.height) {
                    ctx.drawImage(frameObject.image, rect.x, rect.y, rect.width, rect.height, 0, 0, width, height);
                }
            }
            return true;
        };
        ImageSequence.prototype.play = function (times, label, complete) {
            if (times === void 0) { times = 1; }
            if (label === void 0) { label = null; }
            if (this.spriteSheet.hasLoaded() && !this._hasLoaded) {
                this._hasLoaded = true;
                this.parseLoad();
            }
            this.visible = true;
            if (label instanceof Array) {
                if (label.length == 1) {
                    var queue = new QueueItem_1.QueueItem(null, label[0], this.getTotalFrames(), times, 0);
                }
                else {
                    var queue = new QueueItem_1.QueueItem(null, label[0], label[1], times, 0);
                }
            }
            else if (label == null) {
                var queue = new QueueItem_1.QueueItem(null, 0, this.getTotalFrames(), times, 0);
            }
            if (complete) {
                queue.then(complete);
            }
            this._queue.add(queue);
            this.paused = false;
            return this;
        };
        ImageSequence.prototype.resume = function () {
            this.paused = false;
            return this;
        };
        ImageSequence.prototype.pause = function () {
            this.paused = true;
            return this;
        };
        ImageSequence.prototype.end = function (all) {
            if (all === void 0) { all = false; }
            this._queue.end(all);
            return this;
        };
        ImageSequence.prototype.stop = function () {
            this.paused = true;
            this._queue.kill();
            return this;
        };
        ImageSequence.prototype.next = function () {
            return this._queue.next();
        };
        ImageSequence.prototype.onTick = function (delta, accumulated) {
            _super.prototype.onTick.call(this, delta, accumulated);
            if (this.paused == false) {
                this._queue.onTick(delta);
                this.frame = this._queue.getFrame();
            }
        };
        ImageSequence.prototype.getTotalFrames = function () {
            return this.frames;
        };
        return ImageSequence;
    }(DisplayObject_1.DisplayObject));
    exports.ImageSequence = ImageSequence;
});
