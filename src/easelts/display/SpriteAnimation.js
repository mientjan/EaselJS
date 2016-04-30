var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../core/event/Event", "./DisplayObject"], function (require, exports, Event_1, DisplayObject_1) {
    "use strict";
    var SpriteAnimation = (function (_super) {
        __extends(SpriteAnimation, _super);
        function SpriteAnimation(spriteSheet, frameOrAnimation) {
            _super.call(this);
            this.currentFrame = 0;
            this.currentAnimation = null;
            this.paused = true;
            this.spriteSheet = null;
            this.offset = 0;
            this.currentAnimationFrame = 0;
            this.framerate = 0;
            this._advanceCount = 0;
            this._animation = null;
            this._currentFrame = null;
            this.sourceRect = null;
            this.spriteSheet = spriteSheet;
            if (frameOrAnimation) {
                this.gotoAndPlay(frameOrAnimation);
            }
        }
        SpriteAnimation.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || this.spriteSheet.complete;
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        SpriteAnimation.prototype.draw = function (ctx, ignoreCache) {
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            this._normalizeFrame();
            var o = this.spriteSheet.getFrame(this._currentFrame | 0);
            if (!o) {
                return false;
            }
            var rect = o.rect;
            this.sourceRect = rect;
            if (rect.width && rect.height) {
                ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height);
            }
            return true;
        };
        SpriteAnimation.prototype.play = function () {
            this.paused = false;
        };
        SpriteAnimation.prototype.stop = function () {
            this.paused = true;
        };
        SpriteAnimation.prototype.gotoAndPlay = function (frameOrAnimation) {
            this.paused = false;
            this._goto(frameOrAnimation);
        };
        SpriteAnimation.prototype.gotoAndStop = function (frameOrAnimation) {
            this.paused = true;
            this._goto(frameOrAnimation);
        };
        SpriteAnimation.prototype.advance = function (time) {
            var speed = (this._animation && this._animation.speed) || 1;
            var fps = this.framerate || this.spriteSheet.framerate;
            var t = (fps && time != null) ? time / (1000 / fps) : 1;
            if (this._animation) {
                this.currentAnimationFrame += t * speed;
            }
            else {
                this._currentFrame += t * speed;
            }
            this._normalizeFrame();
        };
        SpriteAnimation.prototype.getBounds = function () {
            return _super.prototype.getBounds.call(this) || this.spriteSheet.getFrameBounds(this.currentFrame);
        };
        SpriteAnimation.prototype.clone = function () {
            var o = new SpriteAnimation(this.spriteSheet);
            this.cloneProps(o);
            return o;
        };
        SpriteAnimation.prototype.toString = function () {
            return "[Sprite (name=" + this.name + ")]";
        };
        SpriteAnimation.prototype.onTick = function (delta, accumulated) {
            if (!this.paused) {
                this.advance(delta);
            }
            _super.prototype.onTick.call(this, delta, accumulated);
        };
        SpriteAnimation.prototype._normalizeFrame = function () {
            var animation = this._animation;
            var paused = this.paused;
            var frame = this._currentFrame;
            var animFrame = this.currentAnimationFrame;
            var l;
            if (animation) {
                l = animation.frames.length;
                if ((animFrame | 0) >= l) {
                    var next = animation.next;
                    if (this._dispatchAnimationEnd(animation, frame, paused, next, l - 1)) {
                    }
                    else if (next) {
                        return this._goto(next, animFrame - l);
                    }
                    else {
                        this.paused = true;
                        animFrame = this.currentAnimationFrame = animation.frames.length - 1;
                        this._currentFrame = animation.frames[animFrame];
                    }
                }
                else {
                    this._currentFrame = animation.frames[animFrame | 0];
                }
            }
            else {
                l = this.spriteSheet.getNumFrames(null);
                if (frame >= l) {
                    if (!this._dispatchAnimationEnd(animation, frame, paused, l - 1, null)) {
                        if ((this._currentFrame -= l) >= l) {
                            return this._normalizeFrame();
                        }
                    }
                }
            }
            this.currentFrame = this._currentFrame | 0;
        };
        SpriteAnimation.prototype._dispatchAnimationEnd = function (animation, frame, paused, next, end) {
            var name = animation ? animation.name : null;
            if (this.hasEventListener("animationend")) {
                var evt = new Event_1.Event("animationend");
                this.dispatchEvent(evt);
            }
            var changed = (this._animation != animation || this._currentFrame != frame);
            if (!changed && !paused && this.paused) {
                this.currentAnimationFrame = end;
                changed = true;
            }
            return changed;
        };
        SpriteAnimation.prototype.cloneProps = function (o) {
            _super.prototype.cloneProps.call(this, o);
            o.currentFrame = this.currentFrame;
            o._currentFrame = this._currentFrame;
            o.currentAnimation = this.currentAnimation;
            o.paused = this.paused;
            o._animation = this._animation;
            o.currentAnimationFrame = this.currentAnimationFrame;
            o.framerate = this.framerate;
        };
        SpriteAnimation.prototype._goto = function (frameOrAnimation, frame) {
            if (isNaN(frameOrAnimation)) {
                var data = this.spriteSheet.getAnimation(frameOrAnimation);
                if (data) {
                    this.currentAnimationFrame = frame || 0;
                    this._animation = data;
                    this.currentAnimation = frameOrAnimation;
                    this._normalizeFrame();
                }
            }
            else {
                this.currentAnimationFrame = 0;
                this.currentAnimation = this._animation = null;
                this._currentFrame = frameOrAnimation;
                this._normalizeFrame();
            }
        };
        return SpriteAnimation;
    }(DisplayObject_1.DisplayObject));
    exports.SpriteAnimation = SpriteAnimation;
});
