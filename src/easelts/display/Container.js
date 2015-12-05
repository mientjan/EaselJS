/*
 * Container
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
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
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./DisplayObject", "../../core/util/HttpRequest"], function (require, exports, DisplayObject_1, HttpRequest_1) {
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container(width, height, x, y, regX, regY) {
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 8;
            this.children = [];
            this.mouseChildren = true;
            this.tickChildren = true;
            this._buffer = null;
            this._willBufferAutoResize = true;
            this._willBufferUpdate = true;
        }
        Container.prototype.isVisible = function () {
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && (this.cacheCanvas || this.children.length));
        };
        Container.prototype.setMouseInteraction = function (value) {
            this.mouseChildren = value;
            _super.prototype.setMouseInteraction.call(this, value);
        };
        Container.prototype.setBuffer = function (buffer, autoResize) {
            if (autoResize === void 0) { autoResize = true; }
            this._buffer = buffer;
            this._willBufferAutoResize = autoResize;
            return this;
        };
        Container.prototype.setBufferUpdate = function (value) {
            this._willBufferUpdate = value;
            return this;
        };
        Container.prototype.load = function (onProgress) {
            var _this = this;
            return HttpRequest_1.default.waitForLoadable(this.children, onProgress).then(function () {
                _this._hasLoaded = true;
                return _this;
            });
        };
        Container.prototype.draw = function (ctx, ignoreCache) {
            var willBufferUpdate = this._willBufferUpdate;
            var bufferAvailable = this._buffer ? true : false;
            var buffer = this._buffer;
            var list = this.children, child;
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            if (bufferAvailable) {
                var localCtx = buffer.context;
            }
            else {
                var localCtx = ctx;
            }
            if ((bufferAvailable && willBufferUpdate) || !bufferAvailable) {
                for (var i = 0, l = list.length; i < l; ++i) {
                    child = list[i];
                    if (!child.isVisible()) {
                        continue;
                    }
                    localCtx.save();
                    child.updateContext(localCtx);
                    child.draw(localCtx);
                    localCtx.restore();
                }
            }
            if (buffer) {
                buffer.draw(ctx);
                buffer.clear();
            }
            return true;
        };
        Container.prototype.addChild = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i - 0] = arguments[_i];
            }
            var length = children.length;
            if (length == 0) {
                return null;
            }
            if (length > 1) {
                for (var i = 0; i < length; i++) {
                    this.addChild(children[i]);
                }
                return children[length - 1];
            }
            var child = children[0];
            if (child.parent) {
                child.parent.removeChild(child);
            }
            child.parent = this;
            child.isDirty = true;
            if (this.stage) {
                child.setStage(this.stage);
            }
            this.children.push(child);
            child.onResize(child.parent.width, child.parent.height);
            return child;
        };
        Container.prototype.setStage = function (stage) {
            this.stage = stage;
            var children = this.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                child.setStage(this.stage);
            }
        };
        Container.prototype.addChildAt = function (child, index) {
            if (child.parent) {
                child.parent.removeChild(child);
            }
            if (this.stage) {
                child.setStage(this.stage);
            }
            child.parent = this;
            child.isDirty = true;
            this.children.splice(index, 0, child);
            child.onResize(this.width, this.height);
            return child;
        };
        Container.prototype.removeChild = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i - 0] = arguments[_i];
            }
            var l = children.length;
            if (l > 1) {
                var good = true;
                for (var i = 0; i < l; i++) {
                    good = good && this.removeChild(children[i]);
                }
                return good;
            }
            return this.removeChildAt(this.children.indexOf(children[0]));
        };
        Container.prototype.removeChildAt = function () {
            var index = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                index[_i - 0] = arguments[_i];
            }
            var l = index.length;
            if (l > 1) {
                index.sort(function (a, b) {
                    return b - a;
                });
                var good = true;
                for (var i = 0; i < l; i++) {
                    good = good && this.removeChildAt(index[i]);
                }
                return good;
            }
            if (index[0] < 0 || index[0] > this.children.length - 1) {
                return false;
            }
            var child = this.children[index[0]];
            if (child) {
                child.parent = null;
            }
            this.children.splice(index[0], 1);
            return true;
        };
        Container.prototype.removeAllChildren = function () {
            var children = this.children;
            while (children.length) {
                children.pop().parent = null;
            }
            return this;
        };
        Container.prototype.getChildAt = function (index) {
            return this.children[index];
        };
        Container.prototype.getChildrenByProperty = function (name, value) {
            var children = this.children;
            var result = [];
            for (var i = 0, l = children.length; i < l; i++) {
                if (children[i][name] == value) {
                    result.push(children[i]);
                }
            }
            return result;
        };
        Container.prototype.sortChildren = function (sortFunction) {
            this.children.sort(sortFunction);
            return this;
        };
        Container.prototype.getChildIndex = function (child) {
            return this.children.indexOf(child);
        };
        Container.prototype.getNumChildren = function () {
            return this.children.length;
        };
        Container.prototype.swapChildrenAt = function (index0, index1) {
            var children = this.children;
            var child0 = children[index0];
            var child1 = children[index1];
            if (!child0 || !child1) {
                return;
            }
            children[index0] = child1;
            children[index1] = child0;
        };
        Container.prototype.swapChildren = function (child0, child1) {
            var children = this.children;
            var index1, index2;
            for (var i = 0, l = children.length; i < l; i++) {
                if (children[i] == child0) {
                    index1 = i;
                }
                if (children[i] == child1) {
                    index2 = i;
                }
                if (index1 != null && index2 != null) {
                    break;
                }
            }
            if (i == l) {
                return this;
            }
            children[index1] = child1;
            children[index2] = child0;
            return this;
        };
        Container.prototype.setChildIndex = function (child, index) {
            var children = this.children, l = children.length;
            if (child.parent != this || index < 0 || index >= l) {
                return;
            }
            for (var i = 0; i < l; i++) {
                if (children[i] == child) {
                    break;
                }
            }
            if (i == l || i == index) {
                return this;
            }
            children.splice(i, 1);
            children.splice(index, 0, child);
            return this;
        };
        Container.prototype.contains = function (child) {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.parent;
            }
            return false;
        };
        Container.prototype.hitTest = function (x, y) {
            return this.getObjectUnderPoint(x, y) != null;
        };
        Container.prototype.getObjectsUnderPoint = function (x, y) {
            var arr = [];
            var pt = this.localToGlobal(x, y);
            this._getObjectsUnderPoint(pt.x, pt.y, arr);
            return arr;
        };
        Container.prototype.getObjectUnderPoint = function (x, y) {
            var pt = this.localToGlobal(x, y);
            return this._getObjectsUnderPoint(pt.x, pt.y);
        };
        Container.prototype.getBounds = function () {
            return this._getBounds(null, true);
        };
        Container.prototype.getTransformedBounds = function () {
            return this._getBounds(null, true);
        };
        Container.prototype.toString = function () {
            return "[Container<T> (name=" + this.name + ")]";
        };
        Container.prototype.onResize = function (width, height) {
            _super.prototype.onResize.call(this, width, height);
            var newWidth = this.width;
            var newHeight = this.height;
            var buffer = this._buffer;
            var willAutoResize = this._willBufferAutoResize;
            if (willAutoResize && buffer) {
                buffer.setSize(newWidth, newHeight);
            }
            for (var i = 0, l = this.children.length; i < l; i++) {
                var child = this.children[i];
                child.onResize(newWidth, newHeight);
            }
        };
        Container.prototype.onTick = function (delta) {
            _super.prototype.onTick.call(this, delta);
            if (this.tickChildren) {
                for (var children = this.children, child = null, i = children.length - 1; i >= 0; i--) {
                    child = children[i];
                    child.tickEnabled && child.onTick(delta);
                }
            }
        };
        Container.prototype._getObjectsUnderPoint = function (x, y, arr, mouse, activeListener) {
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
                if (!hitArea && child.type == 8) {
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
                    if (!this._testHit(ctx)) {
                        continue;
                    }
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, 2, 2);
                    if (arr) {
                        arr.push(child);
                    }
                    else {
                        return (mouse && !this.mouseChildren) ? this : child;
                    }
                }
            }
            return null;
        };
        Container.prototype._getBounds = function (matrix, ignoreTransform) {
            var bounds = _super.prototype.getBounds.call(this);
            if (bounds) {
                return this._transformBounds(bounds, matrix, ignoreTransform);
            }
            var minX = null, maxX = null, minY = null, maxY = null;
            var mtx = ignoreTransform ? this._matrix.identity() : this.getMatrix(this._matrix);
            if (matrix) {
                mtx.prependMatrix(matrix);
            }
            var l = this.children.length;
            for (var i = 0; i < l; i++) {
                var child = this.children[i];
                if (!child.visible || !(bounds = child.getTransformedBounds(mtx))) {
                    continue;
                }
                var x1 = bounds.x, y1 = bounds.y, x2 = x1 + bounds.width, y2 = y1 + bounds.height;
                if (x1 < minX || minX == null) {
                    minX = x1;
                }
                if (x2 > maxX || maxX == null) {
                    maxX = x2;
                }
                if (y1 < minY || minY == null) {
                    minY = y1;
                }
                if (y2 > maxY || maxY == null) {
                    maxY = y2;
                }
            }
            return (maxX == null) ? null : this._rectangle.setProperies(minX, minY, maxX - minX, maxY - minY);
        };
        Container.prototype.destruct = function () {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].destruct();
            }
            this.removeAllChildren();
            this.setMouseInteraction(false);
            _super.prototype.destruct.call(this);
        };
        return Container;
    })(DisplayObject_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Container;
});
