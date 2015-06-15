var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../display/DisplayObject', '../display/SpriteSheet'], function (require, exports, DisplayObject, SpriteSheet) {
    var ImageSequence = (function (_super) {
        __extends(ImageSequence, _super);
        function ImageSequence(images, fps, width, height, x, y, regX, regY) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 7 /* BITMAP */;
            this._playing = false;
            this._timeIndex = -1;
            this._frame = 0;
            this._fps = 0;
            this._length = 0;
            this._times = 1;
            this._loopInfinite = false;
            this._onComplete = null;
            this.images = null;
            this.spriteSheet = null;
            if (images instanceof Array) {
                var imageList = images;
                this.images = [];
                for (var i = 0; i < imageList.length; i++) {
                    var image = document.createElement('img');
                    image.src = images[i];
                    this.images.push(image);
                }
                this._length = this.images.length;
            }
            else if (images instanceof SpriteSheet) {
                var spriteSheet = images;
                var animations = spriteSheet.getAnimations();
                if (animations.length > 1) {
                    throw new Error('SpriteSheet not compatible with ImageSequence, has multiple animations. Only supports one');
                }
                this._length = spriteSheet.getNumFrames(animations[0]);
                this.spriteSheet = spriteSheet;
            }
            this._fps = 1000 / fps;
        }
        ImageSequence.prototype.draw = function (ctx, ignoreCache) {
            if (this._frame > -1) {
                var frame = this._frame;
                if (this.images) {
                    var images = this.images;
                    var image = images[frame];
                    if (!image.complete) {
                        if (images[frame - 1] && images[frame - 1].complete) {
                            image = images[frame - 1];
                        }
                        else if (images[frame - 2] && images[frame - 2].complete) {
                            image = images[frame - 2];
                        }
                        else if (images[frame - 3] && images[frame - 3].complete) {
                            image = images[frame - 3];
                        }
                    }
                    var width = image.naturalWidth;
                    var height = image.naturalHeight;
                    if (width > 0 && height > 0) {
                        ctx.drawImage(image, 0, 0, width, height, 0, 0, this.width, this.height);
                    }
                }
                else if (this.spriteSheet) {
                    var frameObject = this.spriteSheet.getFrame(this._frame);
                    if (!frameObject) {
                        return false;
                    }
                    var rect = frameObject.rect;
                    if (rect.width && rect.height) {
                        ctx.drawImage(frameObject.image, rect.x, rect.y, rect.width, rect.height, 0, 0, this.width, this.height);
                    }
                }
            }
            return true;
        };
        ImageSequence.prototype.play = function (times, onComplete) {
            if (times === void 0) { times = 1; }
            if (onComplete === void 0) { onComplete = null; }
            this._frame = 0;
            this._times = times;
            this._loopInfinite = times == -1 ? true : false;
            this._onComplete = onComplete;
            this._playing = true;
        };
        ImageSequence.prototype.stop = function (triggerOnComplete) {
            if (triggerOnComplete === void 0) { triggerOnComplete = true; }
            this._playing = false;
            this._loopInfinite = false;
            this._timeIndex = -1;
            if (this._onComplete && triggerOnComplete) {
                this._onComplete.call(null);
            }
            this._onComplete = null;
        };
        ImageSequence.prototype.onTick = function (delta) {
            var playing = this._playing;
            if (playing) {
                if (this._timeIndex < 0) {
                    this._timeIndex = 0;
                }
                var time = this._timeIndex += delta;
                var fps = this._fps;
                var length = this._length;
                var times = this._times;
                var frame = Math.floor(time / fps);
                var currentFrame = this._frame;
                var playedLeft = times - Math.floor(frame / length);
                if (!this._loopInfinite && playedLeft <= 0) {
                    this.stop();
                }
                else {
                    frame %= length;
                    if (currentFrame != frame) {
                        this._frame = frame;
                    }
                }
            }
        };
        return ImageSequence;
    })(DisplayObject);
    return ImageSequence;
});
