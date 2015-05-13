var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../createts/util/Ticker', './DisplayObject', './Container', '../geom/Size', '../geom/PointerData', '../event/PointerEvent', '../../createts/event/Signal'], function (require, exports, Ticker, DisplayObject, Container, Size, PointerData, PointerEvent, Signal) {
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
            this.type = 1 /* STAGE */;
            this._isRunning = false;
            this._tickSignalConnection = null;
            this._fps = 60;
            this._eventListeners = null;
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
            this.enableDOMEvents(true);
            this.setFps(this._fps);
            this.ctx = this.canvas.getContext('2d');
            this.setQuality(1 /* LOW */);
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
                case 1 /* LOW */:
                    {
                        this.ctx['mozImageSmoothingEnabled'] = false;
                        this.ctx['webkitImageSmoothingEnabled'] = false;
                        this.ctx['msImageSmoothingEnabled'] = false;
                        this.ctx['imageSmoothingEnabled'] = false;
                        break;
                    }
                case 0 /* NORMAL */:
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
        Stage.prototype.enableMouseOver = function (frequency) {
            var _this = this;
            if (frequency === void 0) { frequency = null; }
            if (this._mouseOverIntervalID) {
                clearInterval(this._mouseOverIntervalID);
                this._mouseOverIntervalID = null;
                if (frequency == 0) {
                    this._testMouseOver(true);
                }
            }
            if (frequency == null) {
                frequency = 20;
            }
            else if (frequency <= 0) {
                return void 0;
            }
            this.enableMouseInteraction();
            this._mouseOverIntervalID = setInterval(function () {
                _this._testMouseOver();
            }, 1000 / Math.min(50, frequency));
        };
        Stage.prototype.enableDOMEvents = function (enable) {
            var _this = this;
            if (enable === void 0) { enable = true; }
            var name, o, eventListeners = this._eventListeners;
            if (!enable && eventListeners) {
                for (name in eventListeners) {
                    o = eventListeners[name];
                    o.window.removeEventListener(name, o.fn, false);
                }
                this._eventListeners = null;
            }
            else if (enable && !eventListeners && this.canvas) {
                var windowsObject = window['addEventListener'] ? window : document;
                eventListeners = this._eventListeners = {};
                eventListeners["mouseup"] = {
                    window: windowsObject,
                    fn: function (e) { return _this._handleMouseUp(e); }
                };
                eventListeners["mousemove"] = {
                    window: windowsObject,
                    fn: function (e) { return _this._handleMouseMove(e); }
                };
                eventListeners["mousedown"] = {
                    window: this.canvas,
                    fn: function (e) { return _this._handleMouseDown(e); }
                };
                for (name in eventListeners) {
                    o = eventListeners[name];
                    o.window.addEventListener(name, o.fn, false);
                }
            }
        };
        Stage.prototype.clone = function () {
            var o = new Stage(null, this.triggerResizeOnWindowResize);
            this.cloneProps(o);
            return o;
        };
        Stage.prototype.toString = function () {
            return "[Stage (name=" + this.name + ")]";
        };
        Stage.prototype._getElementRect = function (element) {
            var bounds;
            bounds = element.getBoundingClientRect();
            var offX = (window.pageXOffset || document['scrollLeft'] || 0) - (document['clientLeft'] || document.body.clientLeft || 0);
            var offY = (window.pageYOffset || document['scrollTop'] || 0) - (document['clientTop'] || document.body.clientTop || 0);
            var styles = window.getComputedStyle ? getComputedStyle(element, null) : element.currentStyle;
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
        Stage.prototype._getPointerData = function (id) {
            var data = this._pointerData[id];
            if (!data) {
                data = this._pointerData[id] = new PointerData(0, 0);
                if (this._primaryPointerID == null) {
                    this._primaryPointerID = id;
                }
                if (this._primaryPointerID == null || this._primaryPointerID == -1) {
                    this._primaryPointerID = id;
                }
            }
            return data;
        };
        Stage.prototype._handleMouseMove = function (e) {
            if (e === void 0) { e = window['event']; }
            this._handlePointerMove(-1, e, e.pageX, e.pageY);
        };
        Stage.prototype._handlePointerMove = function (id, e, pageX, pageY, owner) {
            if (this._prevStage && owner === undefined) {
                return;
            }
            if (!this.canvas) {
                return;
            }
            var nextStage = this._nextStage;
            var pointerData = this._getPointerData(id);
            var inBounds = pointerData.inBounds;
            this._updatePointerPosition(id, e, pageX, pageY);
            if (inBounds || pointerData.inBounds || this.mouseMoveOutside) {
                if (id == -1 && pointerData.inBounds == !inBounds) {
                    this._dispatchMouseEvent(this, (inBounds ? "mouseleave" : "mouseenter"), false, id, pointerData, e);
                }
                this._dispatchMouseEvent(this, "stagemousemove", false, id, pointerData, e);
                this._dispatchMouseEvent(pointerData.target, "pressmove", true, id, pointerData, e);
            }
            nextStage && nextStage._handlePointerMove(id, e, pageX, pageY, null);
        };
        Stage.prototype._updatePointerPosition = function (id, e, pageX, pageY) {
            var rect = this._getElementRect(this.canvas);
            pageX -= rect.left;
            pageY -= rect.top;
            var w = this.canvas.width;
            var h = this.canvas.height;
            pageX /= (rect.right - rect.left) / w;
            pageY /= (rect.bottom - rect.top) / h;
            var pointerData = this._getPointerData(id);
            if (pointerData.inBounds = (pageX >= 0 && pageY >= 0 && pageX <= w - 1 && pageY <= h - 1)) {
                pointerData.x = pageX;
                pointerData.y = pageY;
            }
            else if (this.mouseMoveOutside) {
                pointerData.x = pageX < 0 ? 0 : (pageX > w - 1 ? w - 1 : pageX);
                pointerData.y = pageY < 0 ? 0 : (pageY > h - 1 ? h - 1 : pageY);
            }
            pointerData.posEvtObj = e;
            pointerData.rawX = pageX;
            pointerData.rawY = pageY;
            if (id == this._primaryPointerID) {
                this.mouseX = pointerData.x;
                this.mouseY = pointerData.y;
                this.mouseInBounds = pointerData.inBounds;
            }
        };
        Stage.prototype._handleMouseUp = function (e) {
            this._handlePointerUp(-1, e, false);
        };
        Stage.prototype._handlePointerUp = function (id, e, clear, owner) {
            var nextStage = this._nextStage, o = this._getPointerData(id);
            if (this._prevStage && owner === undefined) {
                return;
            }
            this._dispatchMouseEvent(this, "stagemouseup", false, id, o, e);
            var target = null, oTarget = o.target;
            if (!owner && (oTarget || nextStage)) {
                target = this._getObjectsUnderPoint(o.x, o.y, null, true);
            }
            if (target == oTarget) {
                this._dispatchMouseEvent(oTarget, "click", true, id, o, e);
            }
            this._dispatchMouseEvent(oTarget, "pressup", true, id, o, e);
            if (clear) {
                if (id == this._primaryPointerID) {
                    this._primaryPointerID = null;
                }
                delete (this._pointerData[id]);
            }
            else {
                o.target = null;
            }
            nextStage && nextStage._handlePointerUp(id, e, clear, owner || target && this);
        };
        Stage.prototype._handleMouseDown = function (e) {
            this._handlePointerDown(-1, e, e.pageX, e.pageY);
        };
        Stage.prototype._handlePointerDown = function (id, e, pageX, pageY, owner) {
            if (pageY != null) {
                this._updatePointerPosition(id, e, pageX, pageY);
            }
            var target = null;
            var nextStage = this._nextStage;
            var pointerData = this._getPointerData(id);
            if (pointerData.inBounds) {
                this._dispatchMouseEvent(this, "stagemousedown", false, id, pointerData, e);
            }
            if (!owner) {
                target = pointerData.target = this._getObjectsUnderPoint(pointerData.x, pointerData.y, null, true);
                this._dispatchMouseEvent(pointerData.target, "mousedown", true, id, pointerData, e);
            }
            nextStage && nextStage._handlePointerDown(id, e, pageX, pageY, owner || target && this);
        };
        Stage.prototype._testMouseOver = function (clear, owner, eventTarget) {
            if (this._prevStage && owner === undefined) {
                return;
            }
            var nextStage = this._nextStage;
            if (!this._mouseOverIntervalID) {
                nextStage && nextStage._testMouseOver(clear, owner, eventTarget);
                return;
            }
            if (this._primaryPointerID != -1 || (!clear && this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds)) {
                return;
            }
            var o = this._getPointerData(-1), e = o.posEvtObj;
            var isEventTarget = eventTarget || e && (e.target == this.canvas);
            var target = null, common = -1, cursor = "", t, i, l;
            if (!owner && (clear || this.mouseInBounds && isEventTarget)) {
                target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
                this._mouseOverX = this.mouseX;
                this._mouseOverY = this.mouseY;
            }
            var oldList = this._mouseOverTarget || [];
            var oldTarget = oldList[oldList.length - 1];
            var list = this._mouseOverTarget = [];
            t = target;
            while (t) {
                list.unshift(t);
                if (t.cursor != null) {
                    cursor = t.cursor;
                }
                t = t.parent;
            }
            this.canvas.style.cursor = cursor;
            if (!owner && eventTarget) {
                eventTarget.canvas.style.cursor = cursor;
            }
            for (i = 0, l = list.length; i < l; i++) {
                if (list[i] != oldList[i]) {
                    break;
                }
                common = i;
            }
            if (oldTarget != target) {
                this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e);
            }
            for (i = oldList.length - 1; i > common; i--) {
                this._dispatchMouseEvent(oldList[i], "rollout", false, -1, o, e);
            }
            for (i = list.length - 1; i > common; i--) {
                this._dispatchMouseEvent(list[i], "rollover", false, -1, o, e);
            }
            if (oldTarget != target) {
                this._dispatchMouseEvent(target, "mouseover", true, -1, o, e);
            }
            nextStage && nextStage._testMouseOver(clear, owner || target && this, eventTarget || isEventTarget && this);
        };
        Stage.prototype._handleDoubleClick = function (e, owner) {
            var target = null, nextStage = this._nextStage, o = this._getPointerData(-1);
            if (!owner) {
                target = this._getObjectsUnderPoint(o.x, o.y, null, true);
                this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
            }
            nextStage && nextStage._handleDoubleClick(e, owner || target && this);
        };
        Stage.prototype._handleWindowResize = function (e) {
            this.onResize(this.holder.offsetWidth, this.holder.offsetHeight);
        };
        Stage.prototype._dispatchMouseEvent = function (target, type, bubbles, pointerId, o, nativeEvent) {
            if (!target || (!bubbles && !target.hasEventListener(type))) {
                return;
            }
            var evt = new PointerEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId == this._primaryPointerID, o.rawX, o.rawY);
            target.dispatchEvent(evt);
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
            this.enableDOMEvents(false);
            _super.prototype.destruct.call(this);
        };
        Stage.EVENT_MOUSE_LEAVE = 'mouseleave';
        Stage.EVENT_MOUSE_ENTER = 'mouseenter';
        Stage.EVENT_STAGE_MOUSE_MOVE = 'stagemousemove';
        return Stage;
    })(Container);
    return Stage;
});
