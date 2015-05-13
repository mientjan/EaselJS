var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Container', '../../tweents/Timeline', '../../tweents/Tween', './DisplayObject'], function (require, exports, Container, Timeline, Tween, DisplayObject) {
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(mode, startPosition, loop, labels) {
            if (mode === void 0) { mode = MovieClip.INDEPENDENT; }
            if (startPosition === void 0) { startPosition = 0; }
            if (loop === void 0) { loop = true; }
            _super.call(this);
            this.mode = MovieClip.INDEPENDENT;
            this.startPosition = 0;
            this.loop = false;
            this.currentFrame = 0;
            this.timeline = null;
            this.paused = false;
            this.actionsEnabled = true;
            this.autoReset = true;
            this.frameBounds = this.frameBounds || null;
            this.framerate = null;
            this._synchOffset = 0;
            this._prevPos = -1;
            this._prevPosition = 0;
            this._t = 0;
            this._managed = {};
            !MovieClip.inited && MovieClip.init();
            this.mode = mode;
            this.startPosition = startPosition;
            this.loop = loop;
            this.timeline = new Timeline(null, labels, { paused: true, position: startPosition, useTicks: true });
        }
        MovieClip.init = function () {
            if (MovieClip.inited) {
                return;
            }
            MovieClipPlugin.install();
            MovieClip.inited = true;
        };
        MovieClip.prototype.getLabels = function () {
            return this.timeline.getLabels();
        };
        MovieClip.prototype.getCurrentLabel = function () {
            this._updateTimeline();
            return this.timeline.getCurrentLabel();
        };
        Object.defineProperty(MovieClip.prototype, "labels", {
            get: function () {
                return this.getLabels();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "currentLabel", {
            get: function () {
                return this.getCurrentLabel();
            },
            enumerable: true,
            configurable: true
        });
        MovieClip.prototype.isVisible = function () {
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
        };
        MovieClip.prototype.draw = function (ctx, ignoreCache) {
            this._updateTimeline();
            _super.prototype.draw.call(this, ctx, ignoreCache);
            return true;
        };
        MovieClip.prototype.play = function () {
            this.paused = false;
        };
        MovieClip.prototype.stop = function () {
            this.paused = true;
        };
        MovieClip.prototype.gotoAndPlay = function (positionOrLabel) {
            this.paused = false;
            this._goto(positionOrLabel);
        };
        MovieClip.prototype.gotoAndStop = function (positionOrLabel) {
            this.paused = true;
            this._goto(positionOrLabel);
        };
        MovieClip.prototype.advance = function (time) {
            var independent = MovieClip.INDEPENDENT;
            if (this.mode != independent) {
                return;
            }
            var o = this, fps = o.framerate;
            while ((o = o.parent) && fps == null) {
                if (o.mode == independent) {
                    fps = o._framerate;
                }
            }
            this._framerate = fps;
            var t = (fps != null && fps != -1 && time != null) ? time / (1000 / fps) + this._t : 1;
            var frames = t | 0;
            this._t = t - frames;
            while (!this.paused && frames--) {
                this._prevPosition = (this._prevPos < 0) ? 0 : this._prevPosition + 1;
                this._updateTimeline();
            }
        };
        MovieClip.prototype.clone = function () {
            throw ("MovieClip cannot be cloned.");
            return this;
        };
        MovieClip.prototype.toString = function () {
            return "[MovieClip (name=" + this.name + ")]";
        };
        MovieClip.prototype._tick = function (evtObj) {
            debugger;
            this.advance(evtObj && evtObj.delta);
            this.onTick(evtObj);
        };
        MovieClip.prototype.onTick = function (delta) {
            this.advance(delta);
            _super.prototype.onTick.call(this, delta);
        };
        MovieClip.prototype._goto = function (positionOrLabel) {
            var pos = this.timeline.resolve(positionOrLabel);
            if (pos == null) {
                return;
            }
            if (this._prevPos == -1) {
                this._prevPos = NaN;
            }
            this._prevPosition = pos;
            this._t = 0;
            this._updateTimeline();
        };
        MovieClip.prototype._reset = function () {
            this._prevPos = -1;
            this._t = this.currentFrame = 0;
            this.paused = false;
        };
        MovieClip.prototype._updateTimeline = function () {
            var tl = this.timeline;
            var synched = this.mode != MovieClip.INDEPENDENT;
            tl.loop = (this.loop == null) ? true : this.loop;
            if (synched) {
                tl.setPosition(this.startPosition + (this.mode == MovieClip.SINGLE_FRAME ? 0 : this._synchOffset), Tween.NONE);
            }
            else {
                tl.setPosition(this._prevPos < 0 ? 0 : this._prevPosition, this.actionsEnabled ? null : Tween.NONE);
            }
            this._prevPosition = tl._prevPosition;
            if (this._prevPos == tl._prevPos) {
                return;
            }
            this.currentFrame = this._prevPos = tl._prevPos;
            for (var n in this._managed) {
                this._managed[n] = 1;
            }
            var tweens = tl._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween = tweens[i];
                var target = tween._target;
                if (target == this || tween.passive) {
                    continue;
                }
                var offset = tween._stepPosition;
                if (target instanceof DisplayObject) {
                    this._addManagedChild(target, offset);
                }
                else {
                    this._setState(target.state, offset);
                }
            }
            var kids = this.children;
            for (i = kids.length - 1; i >= 0; i--) {
                var id = kids[i].id;
                if (this._managed[id] == 1) {
                    this.removeChildAt(i);
                    delete (this._managed[id]);
                }
            }
        };
        MovieClip.prototype._setState = function (state, offset) {
            if (!state) {
                return;
            }
            for (var i = state.length - 1; i >= 0; i--) {
                var o = state[i];
                var target = o.t;
                var props = o.p;
                for (var n in props) {
                    target[n] = props[n];
                }
                this._addManagedChild(target, offset);
            }
        };
        MovieClip.prototype._addManagedChild = function (child, offset) {
            if (child._off) {
                return;
            }
            this.addChildAt(child, 0);
            if (child instanceof MovieClip) {
                child._synchOffset = offset;
                if (child.mode == MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) {
                    child._reset();
                }
            }
            this._managed[child.id] = 2;
        };
        MovieClip.prototype._getBounds = function (matrix, ignoreTransform) {
            var bounds = this.DisplayObject_getBounds();
            if (!bounds) {
                this._updateTimeline();
                if (this.frameBounds) {
                    bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]);
                }
            }
            if (bounds) {
                return this._transformBounds(bounds, matrix, ignoreTransform);
            }
            return _super.prototype._getBounds.call(this, matrix, ignoreTransform);
        };
        MovieClip.INDEPENDENT = "independent";
        MovieClip.SINGLE_FRAME = "single";
        MovieClip.SYNCHED = "synched";
        MovieClip.inited = false;
        return MovieClip;
    })(Container);
    var MovieClipPlugin = (function () {
        function MovieClipPlugin() {
            throw ("MovieClipPlugin cannot be instantiated.");
        }
        MovieClipPlugin.install = function () {
            Tween.installPlugin(MovieClipPlugin, ["startPosition"]);
        };
        MovieClipPlugin.init = function (tween, prop, value) {
            return value;
        };
        MovieClipPlugin.step = function () {
        };
        MovieClipPlugin.tween = function (tween, prop, value, startValues, endValues, ratio, wait, end) {
            if (!(tween.target instanceof MovieClip)) {
                return value;
            }
            return (ratio == 1 ? endValues[prop] : startValues[prop]);
        };
        MovieClipPlugin.priority = 100;
        return MovieClipPlugin;
    })();
    return MovieClip;
});
