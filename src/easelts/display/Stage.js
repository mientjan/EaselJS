/*
 * Stage
 * Visit http://createjs.com/ for documentation, updates and examples.
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
define(["require", "exports", '../../createts/util/Ticker', './DisplayObject', './Container', '../geom/Size', '../../createts/event/Signal'], function (require, exports, Ticker, DisplayObject, Container, Size, Signal) {
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(element, triggerResizeOnWindowResize) {
            var _this = this;
            if (triggerResizeOnWindowResize === void 0) { triggerResizeOnWindowResize = false; }
            _super.call(this, '100%', '100%', 0, 0, 0, 0);
            this.tickstartSignal = new Signal();
            this.tickendSignal = new Signal();
            this.drawstartSignal = new Signal();
            this.drawendSignal = new Signal();
            this.type = 1;
            this._isRunning = false;
            this._tickSignalConnection = null;
            this._fps = 60;
            this._onResizeEventListener = null;
            this.autoClear = true;
            this.canvas = null;
            this.ctx = null;
            this.holder = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.triggerResizeOnWindowResize = false;
            this.drawRect = null;
            this.snapToPixelEnabled = false;
            this.mouseInBounds = false;
            this.tickOnUpdate = true;
            this.mouseMoveOutside = false;
            this._pointerData = {};
            this._pointerCount = 0;
            this._primaryPointerID = null;
            this._mouseOverIntervalID = null;
            this._nextStage = null;
            this._prevStage = null;
            this.update = function (delta) {
                if (!_this.canvas) {
                    return;
                }
                if (_this.tickOnUpdate) {
                    _this.onTick.call(_this, delta);
                }
                _this.drawstartSignal.emit();
                DisplayObject._snapToPixelEnabled = _this.snapToPixelEnabled;
                var r = _this.drawRect, ctx = _this.ctx;
                ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);
                if (_this.autoClear) {
                    if (r) {
                        ctx.clearRect(r.x, r.y, r.width, r.height);
                    }
                    else {
                        ctx.clearRect(0, 0, _this.canvas.width + 1, _this.canvas.height + 1);
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
                _this.drawendSignal.emit();
            };
            this.triggerResizeOnWindowResize = triggerResizeOnWindowResize;
            var size;
            switch (element.tagName) {
                case 'CANVAS':
                    {
                        this.canvas = element;
                        this.holder = element.parentElement;
                        size = new Size(this.canvas.width, this.canvas.height);
                        break;
                    }
                default:
                    {
                        var canvas = document.createElement('canvas');
                        this.canvas = canvas;
                        this.holder = element;
                        this.holder.appendChild(canvas);
                        size = new Size(this.holder.offsetWidth, this.holder.offsetHeight);
                        break;
                    }
            }
            this.setFps(this._fps);
            this.ctx = this.canvas.getContext('2d');
            this.stage = this;
            if (triggerResizeOnWindowResize) {
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
        };
        Stage.prototype.tick = function (delta) {
            if (!this.tickEnabled) {
                return;
            }
            this.tickstartSignal.emit();
            this.onTick(delta);
            this.tickendSignal.emit();
        };
        Stage.prototype.clear = function () {
            if (!this.canvas) {
                return;
            }
            var ctx = this.canvas.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
        };
        Stage.prototype.toDataURL = function (backgroundColor, mimeType) {
            if (!mimeType) {
                mimeType = "image/png";
            }
            var ctx = this.canvas.getContext('2d');
            var w = this.canvas.width;
            var h = this.canvas.height;
            var data;
            if (backgroundColor) {
                data = ctx.getImageData(0, 0, w, h);
                var compositeOperation = ctx.globalCompositeOperation;
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, w, h);
            }
            var dataURL = this.canvas.toDataURL(mimeType);
            if (backgroundColor) {
                ctx.clearRect(0, 0, w + 1, h + 1);
                ctx.putImageData(data, 0, 0);
                ctx.globalCompositeOperation = compositeOperation;
            }
            return dataURL;
        };
        Stage.prototype.clone = function () {
            throw new Error('cannot clone stage');
            return this;
        };
        Stage.prototype.toString = function () {
            return "[Stage (name=" + this.name + ")]";
        };
        Stage.prototype._getElementRect = function (element) {
            var bounds;
            bounds = element.getBoundingClientRect();
            var offX = (window.pageXOffset || document['scrollLeft'] || 0) - (document['clientLeft'] || document.body.clientLeft || 0);
            var offY = (window.pageYOffset || document['scrollTop'] || 0) - (document['clientTop'] || document.body.clientTop || 0);
            var styles = window.getComputedStyle ? window.getComputedStyle(element, null) : element['currentStyle'];
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
            Ticker.getInstance().setFPS(value);
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
            if (!this._isRunning) {
                this.update(0);
                this._tickSignalConnection = Ticker.getInstance().addTickListener(this.update);
                Ticker.getInstance().start();
                this._isRunning = true;
                return true;
            }
            return false;
        };
        Stage.prototype.stop = function () {
            if (this._isRunning) {
                this._tickSignalConnection.dispose();
                this._tickSignalConnection = null;
                setTimeout(this.update, 1000 / this._fps);
                this._isRunning = false;
                return true;
            }
            return false;
        };
        Stage.prototype.isRunning = function () {
            return this._isRunning;
        };
        Stage.prototype.onResize = function (width, height) {
            width = width + 1 >> 1 << 1;
            height = height + 1 >> 1 << 1;
            if (this.width != width || this.height != height) {
                this.canvas.width = width;
                this.canvas.height = height;
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
        return Stage;
    })(Container);
    exports.Stage = Stage;
});
