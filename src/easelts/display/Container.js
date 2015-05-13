var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DisplayObject', '../util/Methods'], function (require, exports, DisplayObject, Methods) {
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
            this.type = 2 /* CONTAINER */;
            this.children = [];
            this.mouseChildren = true;
            this.tickChildren = true;
            this._isRenderIsolated = false;
            this._willUpdateRenderIsolation = true;
            this._renderIsolationCanvas = null;
        }
        Container.prototype.isVisible = function () {
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && (this.cacheCanvas || this.children.length));
        };
        Container.prototype.setRenderIsolation = function (value) {
            if (this._isRenderIsolated && !value) {
                this._isRenderIsolated = value;
                this._renderIsolationCanvas = null;
            }
            else if (!this._isRenderIsolated && value) {
                this._isRenderIsolated = value;
                this._renderIsolationCanvas = Methods.createCanvas();
            }
            return this;
        };
        Container.prototype.isRenderIsolated = function () {
            return this._isRenderIsolated;
        };
        Container.prototype.willUpdateRenderIsolation = function () {
            return this._willUpdateRenderIsolation;
        };
        Container.prototype.setUpdateRenderIsolation = function (value) {
            if (!this._isRenderIsolated) {
                throw new Error('draw calls are not isolated, first call setRenderIsolation(true)');
            }
            this._willUpdateRenderIsolation = value;
        };
        Container.prototype.enableMouseInteraction = function () {
            this.mouseChildren = true;
            _super.prototype.enableMouseInteraction.call(this);
        };
        Container.prototype.disableMouseInteraction = function () {
            this.mouseChildren = false;
            _super.prototype.disableMouseInteraction.call(this);
        };
        Container.prototype.draw = function (ctx, ignoreCache) {
            var localCtx = ctx;
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            if (this._isRenderIsolated) {
                localCtx = this._renderIsolationCanvas.getContext('2d');
                if (this._willUpdateRenderIsolation) {
                    localCtx.clearRect(0, 0, this.width, this.height);
                }
            }
            if (this._willUpdateRenderIsolation) {
                var list = this.children, child;
                for (var i = 0, l = list.length; i < l; i++) {
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
            if (this._isRenderIsolated) {
                ctx.drawImage(this._renderIsolationCanvas, 0, 0, this.width, this.height);
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
                child.stage = this.stage;
                if (child.onStageSet) {
                    child.onStageSet.call(child);
                }
            }
            this.children.push(child);
            return child;
        };
        Container.prototype.onStageSet = function () {
            var children = this.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.stage != this.stage) {
                    child.stage = this.stage;
                    if (child.onStageSet) {
                        child.onStageSet.call(child);
                    }
                }
            }
        };
        Container.prototype.addChildAt = function (child, index) {
            if (child.parent) {
                child.parent.removeChild(child);
            }
            if (this.stage) {
                child.stage = this.stage;
                if (child.onStageSet) {
                    child.onStageSet.call(child);
                }
            }
            child.parent = this;
            child.isDirty = true;
            this.children.splice(index, 0, child);
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
        };
        Container.prototype.getChildAt = function (index) {
            return this.children[index];
        };
        Container.prototype.getChildByName = function (name) {
            var children = this.children;
            for (var i = 0, l = children.length; i < l; i++) {
                if (children[i].name == name) {
                    return children[i];
                }
            }
            return null;
        };
        Container.prototype.sortChildren = function (sortFunction) {
            this.children.sort(sortFunction);
        };
        Container.prototype.getChildIndex = function (child) {
            return this.children.indexOf(child);
        };
        Container.prototype.getNumChildren = function () {
            return this.children.length;
        };
        Container.prototype.swapChildrenAt = function (index1, index2) {
            var children = this.children;
            var o1 = children[index1];
            var o2 = children[index2];
            if (!o1 || !o2) {
                return;
            }
            children[index1] = o2;
            children[index2] = o1;
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
                return;
            }
            children[index1] = child1;
            children[index2] = child0;
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
                return;
            }
            children.splice(i, 1);
            children.splice(index, 0, child);
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
            return (this.getObjectUnderPoint(x, y) != null);
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
        Container.prototype.clone = function (recursive) {
            var container = new Container();
            this.cloneProps(container);
            if (recursive) {
                var arr = container.children = [];
                for (var i = 0, l = this.children.length; i < l; i++) {
                    var clone = this.children[i].clone(recursive);
                    clone.parent = container;
                    arr.push(clone);
                }
            }
            return container;
        };
        Container.prototype.toString = function () {
            return "[Container (name=" + this.name + ")]";
        };
        Container.prototype.onResize = function (width, height) {
            var oldWidth = this.width;
            var oldHeight = this.height;
            _super.prototype.onResize.call(this, width, height);
            var newWidth = this.width;
            var newHeight = this.height;
            if (this._isRenderIsolated) {
                this._renderIsolationCanvas.width = newWidth;
                this._renderIsolationCanvas.height = newHeight;
            }
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                if (child.onResize) {
                    child.onResize(newWidth, newHeight);
                }
            }
        };
        Container.prototype.onTick = function (delta) {
            _super.prototype.onTick.call(this, delta);
            if (this.tickChildren) {
                var children = this.children;
                for (var i = children.length - 1; i >= 0; i--) {
                    var child = children[i];
                    if (child.tickEnabled) {
                        child.onTick(delta);
                    }
                }
            }
        };
        Container.prototype._getObjectsUnderPoint = function (x, y, arr, mouse, activeListener) {
            var ctx = DisplayObject._hitTestContext;
            var mtx = this._matrix;
            activeListener = activeListener || (mouse && this._hasMouseEventListener());
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
                if (!hitArea && child.type == 2 /* CONTAINER */) {
                    var result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener);
                    if (!arr && result) {
                        return (mouse && !this.mouseChildren) ? this : result;
                    }
                }
                else {
                    if (mouse && !activeListener && !child._hasMouseEventListener()) {
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
            var minX, maxX, minY, maxY;
            var mtx = ignoreTransform ? this._matrix.identity() : this.getMatrix(this._matrix);
            if (matrix) {
                mtx.prependMatrix(matrix);
            }
            var l = this.children.length;
            for (var i = 0; i < l; i++) {
                var child = this.children[i];
                if (!child.visible || !(bounds = child._getBounds(mtx))) {
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
                if (typeof this.children[i].destruct == 'function') {
                    this.children[i].destruct();
                }
            }
            this.disableMouseInteraction();
            this.removeAllChildren();
            _super.prototype.destruct.call(this);
        };
        return Container;
    })(DisplayObject);
    return Container;
});
