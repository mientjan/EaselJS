define(["require", "exports", "../../createts/util/Interval", "../geom/PointerData", "../display/DisplayObject"], function (require, exports, Interval_1, PointerData_1, DisplayObject_1) {
    var UIDefault = (function () {
        function UIDefault(stage) {
            this._eventListeners = {};
            this._mouseoverInterval = null;
            this._pointerData = {};
            this._primaryPointerID = 0;
            this.mouseMoveOutside = false;
            this.mouseInBounds = false;
            this._mouseOverX = 0;
            this._mouseOverY = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this._stage = stage;
            this.setDOMEvents(true);
        }
        UIDefault.prototype.enableMouseOver = function (frequency) {
            if (frequency === void 0) { frequency = 20; }
            if (this._mouseoverInterval) {
                this._mouseoverInterval.destruct();
            }
            this._mouseoverInterval = new Interval_1.default(frequency);
            this._mouseoverInterval.attach(this._testMouseOver.bind(this));
            return this;
        };
        UIDefault.prototype.setDOMEvents = function (enable) {
            var _this = this;
            if (enable === void 0) { enable = true; }
            var element = this._stage.ctx.canvas;
            var name, o, eventListeners = this._eventListeners;
            if (!enable && eventListeners) {
                for (name in eventListeners) {
                    o = eventListeners[name];
                    o.window.removeEventListener(name, o.fn, false);
                }
                this._eventListeners = null;
            }
            else if (enable && !eventListeners && element) {
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
                    window: this._stage.ctx.canvas,
                    fn: function (e) { return _this._handleMouseDown(e); }
                };
                for (name in eventListeners) {
                    o = eventListeners[name];
                    o.window.addEventListener(name, o.fn, false);
                }
            }
        };
        UIDefault.prototype._getElementRect = function (element) {
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
        UIDefault.prototype._getPointerData = function (id) {
            var data = this._pointerData[id];
            if (!data) {
                data = this._pointerData[id] = new PointerData_1.default(0, 0);
                if (this._primaryPointerID == null) {
                    this._primaryPointerID = id;
                }
                if (this._primaryPointerID == null || this._primaryPointerID == -1) {
                    this._primaryPointerID = id;
                }
            }
            return data;
        };
        UIDefault.prototype._handleMouseMove = function (e) {
            //		if(!e){
            //			var b = <MouseEvent> window['event'];
            //		 }
            if (e === void 0) { e = window['event']; }
            this._handlePointerMove(-1, e, e.pageX, e.pageY);
        };
        UIDefault.prototype._handlePointerMove = function (id, e, pageX, pageY, owner) {
            var pointerData = this._getPointerData(id);
            var inBounds = pointerData.inBounds;
            this._updatePointerPosition(id, e, pageX, pageY);
            if (inBounds || pointerData.inBounds || this.mouseMoveOutside) {
                if (id == -1 && pointerData.inBounds == !inBounds) {
                    this._dispatchMouseEvent(this, (inBounds ? "mouseleave" : "mouseenter"), false, id, pointerData, e);
                }
                this._dispatchMouseEvent(this._stage, "stagemousemove", false, id, pointerData, e);
                this._dispatchMouseEvent(pointerData.target, "pressmove", true, id, pointerData, e);
            }
            nextStage && nextStage._handlePointerMove(id, e, pageX, pageY, null);
        };
        UIDefault.prototype._updatePointerPosition = function (id, e, pageX, pageY) {
            var rect = this._getElementRect(this.ctx.canvas);
            pageX -= rect.left;
            pageY -= rect.top;
            var w = this.ctx.canvas.width;
            var h = this.ctx.canvas.height;
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
        UIDefault.prototype._handleMouseUp = function (e) {
            this._handlePointerUp(-1, e, false);
        };
        UIDefault.prototype._handlePointerUp = function (id, e, clear, owner) {
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
        UIDefault.prototype._handleMouseDown = function (e) {
            this._handlePointerDown(-1, e, e.pageX, e.pageY);
        };
        UIDefault.prototype._handlePointerDown = function (id, e, pageX, pageY, owner) {
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
        UIDefault.prototype._testMouseOver = function (clear, owner, eventTarget) {
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
            var isEventTarget = eventTarget || e && (e.target == this.ctx.canvas);
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
            this._stage.ctx.canvas.style.cursor = cursor;
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
        UIDefault.prototype._dispatchMouseEvent = function (target, type, bubbles, pointerId, o, nativeEvent) {
            if (!target || (!bubbles && !target.hasEventListener(type))) {
                return;
            }
            var evt = new PointerEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId == this._primaryPointerID, o.rawX, o.rawY);
            target.dispatchEvent(evt);
        };
        UIDefault.prototype._getObjectsUnderPoint = function (x, y, arr, mouse, activeListener) {
            var ctx = DisplayObject_1.default._hitTestContext;
            var mtx = this._matrix;
            activeListener = activeListener || (mouse && this.hasMouseEventListener());
            var children = this.children;
            var l = children.length;
            for (var i = l - 1; i >= 0; i--) {
                var child = children[i];
                var hitArea = child.hitArea;
                var mask = child.mask;
                if (!child.visible || (!child.isVisible()) || (mouse && !child.mouseEnabled)) {
                    continue;
                }
                if (!hitArea && mask && mask.graphics && !mask.graphics.isEmpty()) {
                    var maskMtx = mask.getMatrix(mask._matrix).prependMatrix(this.getConcatenatedMatrix(mtx));
                    ctx.setTransform(maskMtx.a, maskMtx.b, maskMtx.c, maskMtx.d, maskMtx.tx - x, maskMtx.ty - y);
                    mask.graphics.drawAsPath(ctx);
                    ctx.fillStyle = "#000";
                    ctx.fill();
                    if (!this._testHit(ctx)) {
                        continue;
                    }
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, 2, 2);
                }
                if (!hitArea && child.type == DisplayType.CONTAINER) {
                    var result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener);
                    if (!arr && result) {
                        return (mouse && !this.mouseChildren) ? this : result;
                    }
                }
                else {
                    if (mouse && !activeListener && !child.hasMouseEventListener()) {
                        continue;
                    }
                    child.getConcatenatedMatrix(mtx);
                    if (hitArea) {
                        mtx.appendTransform(hitArea.x, hitArea.y, hitArea.scaleX, hitArea.scaleY, hitArea.rotation, hitArea.skewX, hitArea.skewY, hitArea.regX, hitArea.regY);
                        mtx.alpha = hitArea.alpha;
                    }
                    ctx.globalAlpha = mtx.alpha;
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
                    (hitArea || child).draw(ctx);
                    if (!this.testHit(ctx)) {
                        continue;
                    }
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, 2, 2);
                    if (arr) {
                        arr.push(child);
                    }
                    else {
                        return;
                    }
                }
            }
            return null;
        };
        return UIDefault;
    })();
});
