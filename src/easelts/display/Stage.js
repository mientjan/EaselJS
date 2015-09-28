/*
 * Stage
 *
 * Copyright (c) 2010 gskinner.com, inc.
 * Copyright (c) 2014-2015 Mient-jan Stelling
 * Copyright (c) 2015 MediaMonks B.V
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "./DisplayObject", "./Container", "../geom/Size", "../../createts/event/Signal", "../../createts/util/Interval", "../component/Stats", "../data/StageOption"], function (require, exports, DisplayObject_1, Container_1, Size_1, Signal_1, Interval_1, Stats_1, StageOption_1) {
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(element, option) {
            var _this = this;
            _super.call(this, '100%', '100%', 0, 0, 0, 0);
            this.tickstartSignal = new Signal_1.default();
            this.tickendSignal = new Signal_1.default();
            this.drawstartSignal = new Signal_1.default();
            this.drawendSignal = new Signal_1.default();
            this.type = 2;
            this._isRunning = false;
            this._fps = 60;
            this._fpsCounter = null;
            this._eventListeners = null;
            this._onResizeEventListener = null;
            this.ctx = null;
            this.holder = null;
            this.drawRect = null;
            this.snapToPixelEnabled = false;
            this.ui = null;
            this.tickOnUpdate = true;
            this._pointerData = {};
            this._pointerCount = 0;
            this._primaryPointerID = null;
            this._mouseOverIntervalID = null;
            this._nextStage = null;
            this._prevStage = null;
            this.update = function (delta) {
                var autoClear = _this._option.autoClear;
                var autoClearColor = _this._option.autoClearColor;
                if (!_this.ctx) {
                    return;
                }
                if (_this.tickOnUpdate) {
                    _this.onTick.call(_this, Math.min(delta, 100));
                }
                _this.drawstartSignal.emit();
                DisplayObject_1.default._snapToPixelEnabled = _this.snapToPixelEnabled;
                var r = _this.drawRect, ctx = _this.ctx, pixelRatio = _this._option.pixelRatio;
                ctx.setTransform(pixelRatio, 0, 0, pixelRatio, .5, .5);
                if (autoClear) {
                    if (autoClearColor) {
                        ctx.fillStyle = autoClearColor;
                        ctx.fillRect(0, 0, _this.ctx.canvas.width + 1, _this.ctx.canvas.height + 1);
                    }
                    if (r) {
                        ctx.clearRect(r.x, r.y, r.width, r.height);
                    }
                    else {
                        ctx.clearRect(0, 0, _this.ctx.canvas.width + 1, _this.ctx.canvas.height + 1);
                    }
                }
                ctx.save();
                if (_this.drawRect) {
                    ctx.beginPath();
                    ctx.rect(r.x, r.y, r.width, r.height);
                    ctx.clip();
                }
                _this.updateContext(ctx);
                _this.draw(ctx, false);
                ctx.restore();
                if (_this._fpsCounter) {
                    _this._fpsCounter.update();
                    ctx.save();
                    _this._fpsCounter.draw(ctx, false);
                    ctx.restore();
                }
                _this.drawendSignal.emit();
            };
            this._option = new StageOption_1.StageOption(option);
            var size;
            var canvas;
            switch (element.tagName) {
                case 'CANVAS':
                    {
                        canvas = element;
                        this.holder = element.parentElement;
                        size = new Size_1.default(canvas.width, canvas.height);
                        break;
                    }
                default:
                    {
                        canvas = document.createElement('canvas');
                        this.holder = element;
                        this.holder.appendChild(canvas);
                        size = new Size_1.default(this.holder.offsetWidth, this.holder.offsetHeight);
                        break;
                    }
            }
            canvas.style['image-rendering'] = '-webkit-optimize-contrast';
            this.ctx = canvas.getContext('2d');
            this.ctx.globalCompositeOperation = 'source-over';
            this.setFps(this._fps);
            this.setQuality(1);
            this.stage = this;
            if (this._option.autoResize) {
                this.enableAutoResize();
            }
            this.onResize(size.width, size.height);
        }
        Object.defineProperty(Stage.prototype, "nextStage", {
            get: function () {
                return this._nextStage;
            },
            set: function (value) {
                if (this._nextStage) {
                    this._nextStage._prevStage = null;
                }
                if (value) {
                    value._prevStage = this;
                }
                this._nextStage = value;
            },
            enumerable: true,
            configurable: true
        });
        Stage.prototype.setQuality = function (value) {
            switch (value) {
                case 1:
                    {
                        this.ctx['mozImageSmoothingEnabled'] = false;
                        this.ctx['webkitImageSmoothingEnabled'] = false;
                        this.ctx['msImageSmoothingEnabled'] = false;
                        this.ctx['imageSmoothingEnabled'] = false;
                        break;
                    }
                case 0:
                    {
                        this.ctx['mozImageSmoothingEnabled'] = true;
                        this.ctx['webkitImageSmoothingEnabled'] = true;
                        this.ctx['msImageSmoothingEnabled'] = true;
                        this.ctx['imageSmoothingEnabled'] = true;
                        break;
                    }
            }
            return this;
        };
        Stage.prototype.setFpsCounter = function (value) {
            if (value) {
                this._fpsCounter = new Stats_1.default;
            }
            else {
                this._fpsCounter = null;
            }
            return this;
        };
        Stage.prototype.tick = function (delta) {
            if (delta > 1000) {
                delta = 1000;
            }
            if (delta > 0 && this.tickEnabled) {
                this.tickstartSignal.emit();
                this.onTick(delta);
                this.tickendSignal.emit();
            }
        };
        Stage.prototype.clear = function () {
            if (!this.ctx) {
                return;
            }
            var ctx = this.ctx.canvas.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.ctx.canvas.width + 1, this.ctx.canvas.height + 1);
        };
        Stage.prototype.toDataURL = function (backgroundColor, mimeType) {
            if (!mimeType) {
                mimeType = "image/png";
            }
            var ctx = this.ctx;
            var w = this.ctx.canvas.width;
            var h = this.ctx.canvas.height;
            var data;
            if (backgroundColor) {
                data = ctx.getImageData(0, 0, w, h);
                var compositeOperation = ctx.globalCompositeOperation;
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, w, h);
            }
            var dataURL = this.ctx.canvas.toDataURL(mimeType);
            if (backgroundColor) {
                ctx.clearRect(0, 0, w + 1, h + 1);
                ctx.putImageData(data, 0, 0);
                ctx.globalCompositeOperation = compositeOperation;
            }
            return dataURL;
        };
        Stage.prototype.clone = function () {
            var o = new Stage(null, this._option.autoResize);
            this.cloneProps(o);
            return o;
        };
        Stage.prototype.toString = function () {
            return "[Stage (name=" + this.name + ")]";
        };
        Stage.prototype.getElementRect = function (element) {
            var bounds;
            bounds = element.getBoundingClientRect();
            var offX = (window.pageXOffset || document['scrollLeft'] || 0) - (document['clientLeft'] || document.body.clientLeft || 0);
            var offY = (window.pageYOffset || document['scrollTop'] || 0) - (document['clientTop'] || document.body.clientTop || 0);
            var styles = window.getComputedStyle ? getComputedStyle(element, null) : element['currentStyle'];
            var padL = parseInt(styles.paddingLeft) + parseInt(styles.borderLeftWidth);
            var padT = parseInt(styles.paddingTop) + parseInt(styles.borderTopWidth);
            var padR = parseInt(styles.paddingRight) + parseInt(styles.borderRightWidth);
            var padB = parseInt(styles.paddingBottom) + parseInt(styles.borderBottomWidth);
            return {
                left: bounds.left + offX + padL,
                right: bounds.right + offX - padR,
                top: bounds.top + offY + padT,
                bottom: bounds.bottom + offY - padB
            };
        };
        Stage.prototype._handleWindowResize = function (e) {
            this.onResize(this.holder.offsetWidth, this.holder.offsetHeight);
        };
        Stage.prototype.setFps = function (value) {
            this._fps = value;
            return this;
        };
        Stage.prototype.getFps = function () {
            return this._fps;
        };
        Stage.prototype.enableAutoResize = function () {
            var _this = this;
            this._onResizeEventListener = function (e) { return _this._handleWindowResize(e); };
            window.addEventListener('resize', this._onResizeEventListener);
        };
        Stage.prototype.disableAutoResize = function () {
            window.removeEventListener('resize', this._onResizeEventListener);
        };
        Stage.prototype.start = function () {
            if (this._ticker) {
                this._ticker.destruct();
                this._ticker = null;
            }
            this._ticker = new Interval_1.default(this.getFps())
                .attach(this.update);
            this._isRunning = true;
            return this;
        };
        Stage.prototype.stop = function () {
            if (this._ticker) {
                this._ticker.destruct();
                this._ticker = null;
            }
            this._isRunning = false;
            return this;
        };
        Stage.prototype.isRunning = function () {
            return this._isRunning;
        };
        Stage.prototype.onResize = function (width, height) {
            var pixelRatio = this._option.pixelRatio;
            width = width + 1 >> 1 << 1;
            height = height + 1 >> 1 << 1;
            if (this.width != width || this.height != height) {
                this.ctx.canvas.width = width * pixelRatio;
                this.ctx.canvas.height = height * pixelRatio;
                this.ctx.canvas.style.width = '' + width + 'px';
                this.ctx.canvas.style.height = '' + height + 'px';
                _super.prototype.onResize.call(this, width, height);
                if (!this._isRunning) {
                    this.update(0);
                }
            }
        };
        Stage.prototype.destruct = function () {
            this.stop();
            _super.prototype.destruct.call(this);
        };
        Stage.EVENT_MOUSE_LEAVE = 'mouseleave';
        Stage.EVENT_MOUSE_ENTER = 'mouseenter';
        Stage.EVENT_STAGE_MOUSE_MOVE = 'stagemousemove';
        return Stage;
    })(Container_1.default);
    exports.default = Stage;
});
