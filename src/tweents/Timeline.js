var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../createts/event/EventDispatcher', './Tween'], function (require, exports, EventDispatcher, Tween) {
    var Timeline = (function (_super) {
        __extends(Timeline, _super);
        function Timeline(tweens, labels, props) {
            _super.call(this);
            this.ignoreGlobalPause = false;
            this.duration = 0;
            this.loop = false;
            this.position = null;
            this._paused = false;
            this._tweens = [];
            this._labels = null;
            this._labelList = null;
            this._prevPosition = 0;
            this._prevPos = -1;
            this._useTicks = false;
            this._registered = false;
            if (props) {
                this._useTicks = props.useTicks;
                this.loop = props.loop;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                props.onChange && this.addEventListener("change", props.onChange);
            }
            if (tweens) {
                this.addTween.apply(this, tweens);
            }
            this.setLabels(labels);
            if (props && props.paused) {
                this._paused = true;
            }
            else {
                Tween._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position, Tween.NONE);
            }
        }
        Timeline.prototype.addTween = function (tween) {
            var l = arguments.length;
            if (l > 1) {
                for (var i = 0; i < l; i++) {
                    this.addTween(arguments[i]);
                }
                return arguments[0];
            }
            else if (l == 0) {
                return null;
            }
            this.removeTween(tween);
            this._tweens.push(tween);
            tween.setPaused(true);
            tween._paused = false;
            tween._useTicks = this._useTicks;
            if (tween.duration > this.duration) {
                this.duration = tween.duration;
            }
            if (this._prevPos >= 0) {
                tween.setPosition(this._prevPos, Tween.NONE);
            }
            return tween;
        };
        Timeline.prototype.removeTween = function (tween) {
            var l = arguments.length;
            if (l > 1) {
                var good = true;
                for (var i = 0; i < l; i++) {
                    good = good && this.removeTween(arguments[i]);
                }
                return good;
            }
            else if (l == 0) {
                return false;
            }
            var tweens = this._tweens;
            var i = tweens.length;
            while (i--) {
                if (tweens[i] == tween) {
                    tweens.splice(i, 1);
                    if (tween.duration >= this.duration) {
                        this.updateDuration();
                    }
                    return true;
                }
            }
            return false;
        };
        Timeline.prototype.addLabel = function (label, position) {
            this._labels[label] = position;
            var list = this._labelList;
            if (list) {
                for (var i = 0, l = list.length; i < l; i++) {
                    if (position < list[i].position) {
                        break;
                    }
                }
                list.splice(i, 0, { label: label, position: position });
            }
        };
        Timeline.prototype.setLabels = function (o) {
            this._labels = o ? o : {};
        };
        Timeline.prototype.getLabels = function () {
            var list = this._labelList;
            if (!list) {
                list = this._labelList = [];
                var labels = this._labels;
                for (var n in labels) {
                    list.push({ label: n, position: labels[n] });
                }
                list.sort(function (a, b) {
                    return a.position - b.position;
                });
            }
            return list;
        };
        Timeline.prototype.getCurrentLabel = function () {
            var labels = this.getLabels();
            var pos = this.position;
            var l = labels.length;
            if (l) {
                for (var i = 0; i < l; i++) {
                    if (pos < labels[i].position) {
                        break;
                    }
                }
                return (i == 0) ? null : labels[i - 1].label;
            }
            return null;
        };
        Timeline.prototype.gotoAndPlay = function (positionOrLabel) {
            this.setPaused(false);
            this._goto(positionOrLabel);
        };
        Timeline.prototype.gotoAndStop = function (positionOrLabel) {
            this.setPaused(true);
            this._goto(positionOrLabel);
        };
        Timeline.prototype.setPosition = function (value, actionsMode) {
            if (value < 0) {
                value = 0;
            }
            var t = this.loop ? value % this.duration : value;
            var end = !this.loop && value >= this.duration;
            if (t == this._prevPos) {
                return end;
            }
            this._prevPosition = value;
            this.position = this._prevPos = t;
            for (var i = 0, l = this._tweens.length; i < l; i++) {
                this._tweens[i].setPosition(t, actionsMode);
                if (t != this._prevPos) {
                    return false;
                }
            }
            if (end) {
                this.setPaused(true);
            }
            this.dispatchEvent("change");
            return end;
        };
        Timeline.prototype.setPaused = function (value) {
            this._paused = !!value;
            Tween._register(this, !value);
        };
        Timeline.prototype.updateDuration = function () {
            this.duration = 0;
            for (var i = 0, l = this._tweens.length; i < l; i++) {
                var tween = this._tweens[i];
                if (tween.duration > this.duration) {
                    this.duration = tween.duration;
                }
            }
        };
        Timeline.prototype.onTick = function (delta) {
            this.setPosition(this._prevPosition + delta);
        };
        Timeline.prototype.resolve = function (positionOrLabel) {
            var pos = Number(positionOrLabel);
            if (isNaN(pos)) {
                pos = this._labels[positionOrLabel];
            }
            return pos;
        };
        Timeline.prototype.toString = function () {
            return "[Timeline]";
        };
        Timeline.prototype.clone = function () {
            throw ("Timeline can not be cloned.");
        };
        Timeline.prototype._goto = function (positionOrLabel) {
            var pos = this.resolve(positionOrLabel);
            if (pos != null) {
                this.setPosition(pos);
            }
        };
        return Timeline;
    })(EventDispatcher);
    return Timeline;
});
