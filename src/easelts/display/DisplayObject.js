var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../createts/event/EventDispatcher', '../../createts/event/Signal2', '../util/UID', '../util/Methods', './Shadow', '../geom/FluidCalculation', '../geom/Matrix2', '../geom/Rectangle', '../geom/Point'], function (require, exports, EventDispatcher, Signal2, UID, Methods, Shadow, FluidCalculation, m2, Rectangle, Point) {
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject(width, height, x, y, regX, regY) {
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this);
            this.type = 3 /* DISPLAYOBJECT */;
            this.cacheCanvas = null;
            this.id = UID.get();
            this.mouseEnabled = true;
            this.tickEnabled = true;
            this.name = null;
            this.parent = null;
            this.visible = true;
            this.alpha = 1;
            this.isDirty = false;
            this.isHitable = true;
            this.x = 0;
            this._x_type = 2 /* STATIC */;
            this._x_percent = .0;
            this.y = 0;
            this._y_percent = .0;
            this.width = 0;
            this._width_type = 2 /* STATIC */;
            this._width_percent = .0;
            this.height = 0;
            this._height_type = 2 /* STATIC */;
            this._height_percent = .0;
            this.regX = 0;
            this._regX_type = 2 /* STATIC */;
            this._regX_percent = .0;
            this.regY = 0;
            this._regY_type = 2 /* STATIC */;
            this._regY_percent = .0;
            this.rotation = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.skewX = 0;
            this.skewY = 0;
            this.shadow = null;
            this.stage = null;
            this._behaviorList = null;
            this.compositeOperation = null;
            this.snapToPixel = true;
            this.filters = null;
            this.cacheID = 0;
            this.mask = null;
            this.hitArea = null;
            this.cursor = null;
            this._cacheOffsetX = 0;
            this._cacheOffsetY = 0;
            this._cacheScale = 1;
            this._cacheDataURLID = 0;
            this._cacheDataURL = null;
            this._matrix = new m2.Matrix2(0, 0, 0, 0, 0, 0);
            this._rectangle = new Rectangle(0, 0, 0, 0);
            this._bounds = null;
            this._off = false;
            this.DisplayObject_draw = this.draw;
            this.DisplayObject_getBounds = this._getBounds;
            this.setGeomTransform(width, height, x, y, regX, regY);
        }
        Object.defineProperty(DisplayObject.prototype, "resizeSignal", {
            get: function () {
                if (this._resizeSignal === void 0) {
                    this._resizeSignal = new Signal2();
                }
                return this._resizeSignal;
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.initialize = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this['constructor'].apply(this, args);
        };
        DisplayObject.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        DisplayObject.prototype.distanceToSquared = function (v) {
            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;
        };
        DisplayObject.prototype.distanceTo = function (v) {
            return Math.sqrt(this.distanceToSquared(v));
        };
        DisplayObject.prototype.setWidth = function (value) {
            this._width_type = FluidCalculation.getCalculationTypeByValue(value);
            switch (this._width_type) {
                case 1 /* PERCENT */: {
                    this._width_percent = FluidCalculation.getPercentageParcedValue(value);
                    break;
                }
                case 3 /* CALC */: {
                    this._width_calc = FluidCalculation.dissolveCalcElements(value);
                    break;
                }
                case 2 /* STATIC */: {
                    this.width = value;
                    break;
                }
            }
            this.isDirty = true;
            return this;
        };
        DisplayObject.prototype.getWidth = function () {
            return this.width;
        };
        DisplayObject.prototype.setHeight = function (value) {
            this._height_type = FluidCalculation.getCalculationTypeByValue(value);
            switch (this._height_type) {
                case 1 /* PERCENT */: {
                    this._height_percent = FluidCalculation.getPercentageParcedValue(value);
                    break;
                }
                case 3 /* CALC */: {
                    this._height_calc = FluidCalculation.dissolveCalcElements(value);
                    break;
                }
                case 2 /* STATIC */: {
                    this.height = value;
                    break;
                }
            }
            this.isDirty = true;
            return this;
        };
        DisplayObject.prototype.getHeight = function () {
            return this.height;
        };
        DisplayObject.prototype.setX = function (value) {
            this._x_type = FluidCalculation.getCalculationTypeByValue(value);
            switch (this._x_type) {
                case 1 /* PERCENT */: {
                    this._x_percent = FluidCalculation.getPercentageParcedValue(value);
                    break;
                }
                case 3 /* CALC */: {
                    this._x_calc = FluidCalculation.dissolveCalcElements(value);
                    break;
                }
                case 2 /* STATIC */: {
                    this.x = value;
                    break;
                }
            }
            this.isDirty = true;
            return this;
        };
        DisplayObject.prototype.getX = function () {
            return this.x;
        };
        DisplayObject.prototype.setY = function (value) {
            this._y_type = FluidCalculation.getCalculationTypeByValue(value);
            switch (this._y_type) {
                case 1 /* PERCENT */: {
                    this._y_percent = FluidCalculation.getPercentageParcedValue(value);
                    break;
                }
                case 3 /* CALC */: {
                    this._y_calc = FluidCalculation.dissolveCalcElements(value);
                    break;
                }
                case 2 /* STATIC */: {
                    this.y = value;
                    break;
                }
            }
            this.isDirty = true;
            return this;
        };
        DisplayObject.prototype.getY = function () {
            return this.y;
        };
        DisplayObject.prototype.setRegX = function (value) {
            this.isDirty = true;
            this._regX_type = FluidCalculation.getCalculationTypeByValue(value);
            switch (this._regX_type) {
                case 1 /* PERCENT */: {
                    this._regX_percent = FluidCalculation.getPercentageParcedValue(value);
                    break;
                }
                case 3 /* CALC */: {
                    this._regX_calc = FluidCalculation.dissolveCalcElements(value);
                    break;
                }
                case 2 /* STATIC */: {
                    this.regX = value;
                    break;
                }
            }
            return this;
        };
        DisplayObject.prototype.getRegX = function () {
            return this.regX;
        };
        DisplayObject.prototype.setRegY = function (value) {
            this.isDirty = true;
            this._regY_type = FluidCalculation.getCalculationTypeByValue(value);
            switch (this._regY_type) {
                case 1 /* PERCENT */: {
                    this._regY_percent = FluidCalculation.getPercentageParcedValue(value);
                    break;
                }
                case 3 /* CALC */: {
                    this._regY_calc = FluidCalculation.dissolveCalcElements(value);
                    break;
                }
                case 2 /* STATIC */: {
                    this.regY = value;
                    break;
                }
            }
            return this;
        };
        DisplayObject.prototype.getRegY = function () {
            return this.regY;
        };
        DisplayObject.prototype.addBehavior = function (behavior) {
            if (!this._behaviorList) {
                this._behaviorList = [];
            }
            this._behaviorList.push(behavior);
            behavior.initialize(this);
            return this;
        };
        DisplayObject.prototype.destructBehavior = function (behavior) {
            var behaviorList = this._behaviorList;
            if (behaviorList) {
                for (var i = behaviorList.length - 1; i >= 0; i--) {
                    if (behaviorList[i] === behavior) {
                        behaviorList.splice(i, 1);
                    }
                }
            }
            return this;
        };
        DisplayObject.prototype.destructAllBehaviors = function () {
            if (this._behaviorList) {
                while (this._behaviorList.length) {
                    this._behaviorList.shift().destruct();
                }
                this._behaviorList = null;
            }
        };
        DisplayObject.prototype.enableMouseInteraction = function () {
            this.mouseEnabled = true;
        };
        DisplayObject.prototype.disableMouseInteraction = function () {
            this.mouseEnabled = false;
        };
        DisplayObject.prototype.isVisible = function () {
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
        };
        DisplayObject.prototype.draw = function (ctx, ignoreCache) {
            var cacheCanvas = this.cacheCanvas;
            if (ignoreCache || !cacheCanvas) {
                return false;
            }
            var scale = this._cacheScale;
            var offX = this._cacheOffsetX;
            var offY = this._cacheOffsetY;
            var fBounds;
            if (fBounds = this._applyFilterBounds(offX, offY, 0, 0)) {
                offX = fBounds.x;
                offY = fBounds.y;
            }
            ctx.drawImage(cacheCanvas, offX, offY, cacheCanvas.width / scale, cacheCanvas.height / scale);
            return true;
        };
        DisplayObject.prototype.updateContext = function (ctx) {
            var mtx, mask = this.mask, o = this;
            if (mask && mask.graphics && !mask.graphics.isEmpty()) {
                mtx = mask.getMatrix(mask._matrix);
                ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                mask.graphics.drawAsPath(ctx);
                ctx.clip();
                mtx.invert();
                ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            }
            mtx = o._matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            var tx = mtx.tx, ty = mtx.ty;
            if (DisplayObject._snapToPixelEnabled && o.snapToPixel) {
                tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
                ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
            }
            ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, tx, ty);
            ctx.globalAlpha *= o.alpha;
            if (o.compositeOperation) {
                ctx.globalCompositeOperation = o.compositeOperation;
            }
            if (o.shadow) {
                this._applyShadow(ctx, o.shadow);
            }
        };
        DisplayObject.prototype.cache = function (x, y, width, height, scale) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            if (scale === void 0) { scale = 1; }
            if (!this.cacheCanvas) {
                this.cacheCanvas = Methods.createCanvas();
            }
            this._cacheWidth = width;
            this._cacheHeight = height;
            this._cacheOffsetX = x;
            this._cacheOffsetY = y;
            this._cacheScale = scale;
            this.updateCache();
        };
        DisplayObject.prototype.updateCache = function (compositeOperation) {
            var cacheCanvas = this.cacheCanvas, scale = this._cacheScale, offX = this._cacheOffsetX * scale, offY = this._cacheOffsetY * scale;
            var w = this._cacheWidth, h = this._cacheHeight, fBounds;
            if (!cacheCanvas) {
                throw "cache() must be called before updateCache()";
            }
            var ctx = cacheCanvas.getContext("2d");
            if (fBounds = this._applyFilterBounds(offX, offY, w, h)) {
                offX = fBounds.x;
                offY = fBounds.y;
                w = fBounds.width;
                h = fBounds.height;
            }
            w = Math.ceil(w * scale);
            h = Math.ceil(h * scale);
            if (w != cacheCanvas.width || h != cacheCanvas.height) {
                cacheCanvas.width = w;
                cacheCanvas.height = h;
            }
            else if (!compositeOperation) {
                ctx.clearRect(0, 0, w + 1, h + 1);
            }
            ctx.save();
            ctx.globalCompositeOperation = compositeOperation;
            ctx.setTransform(scale, 0, 0, scale, -offX, -offY);
            this.draw(ctx, true);
            this._applyFilters();
            ctx.restore();
            this.cacheID = DisplayObject._nextCacheID++;
        };
        DisplayObject.prototype.uncache = function () {
            this._cacheDataURL = this.cacheCanvas = null;
            this.cacheID = this._cacheOffsetX = this._cacheOffsetY = 0;
            this._cacheScale = 1;
        };
        DisplayObject.prototype.getCacheDataURL = function () {
            if (!this.cacheCanvas) {
                return null;
            }
            if (this.cacheID != this._cacheDataURLID) {
                this._cacheDataURL = this.cacheCanvas.toDataURL();
            }
            return this._cacheDataURL;
        };
        DisplayObject.prototype.localToGlobal = function (x, y) {
            var mtx = this.getConcatenatedMatrix(this._matrix);
            if (mtx == null) {
                return null;
            }
            mtx.append(1, 0, 0, 1, x, y);
            return new Point(mtx.tx, mtx.ty);
        };
        DisplayObject.prototype.globalToLocal = function (x, y) {
            var mtx = this.getConcatenatedMatrix(this._matrix);
            if (mtx == null) {
                return null;
            }
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            return new Point(mtx.tx, mtx.ty);
        };
        DisplayObject.prototype.localToLocal = function (x, y, target) {
            var pt = this.localToGlobal(x, y);
            return target.globalToLocal(pt.x, pt.y);
        };
        DisplayObject.prototype.setTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            if (rotation === void 0) { rotation = 0; }
            if (skewX === void 0) { skewX = 0; }
            if (skewY === void 0) { skewY = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            this.x = x;
            this.y = y;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
            this.rotation = rotation;
            this.skewX = skewX;
            this.skewY = skewY;
            this.regX = regX;
            this.regY = regY;
            return this;
        };
        DisplayObject.prototype.setGeomTransform = function (w, h, x, y, rx, ry) {
            if (w === void 0) { w = null; }
            if (h === void 0) { h = null; }
            if (x === void 0) { x = null; }
            if (y === void 0) { y = null; }
            if (rx === void 0) { rx = null; }
            if (ry === void 0) { ry = null; }
            if (x != null) {
                this.setX(x);
            }
            if (y != null) {
                this.setY(y);
            }
            if (w != null) {
                this.setWidth(w);
            }
            if (h != null) {
                this.setHeight(h);
            }
            if (rx != null) {
                this.setRegX(rx);
            }
            if (ry != null) {
                this.setRegY(ry);
            }
            return this;
        };
        DisplayObject.prototype.getMatrix = function (matrix) {
            var o = this;
            return (matrix ? matrix.identity() : new m2.Matrix2(0, 0, 0, 0, 0, 0)).appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).appendProperties(o.alpha, o.shadow, o.compositeOperation, 1);
        };
        DisplayObject.prototype.getConcatenatedMatrix = function (matrix) {
            if (matrix) {
                matrix.identity();
            }
            else {
                matrix = new m2.Matrix2(0, 0, 0, 0, 0, 0);
            }
            var o = this;
            while (o != null) {
                matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha, o.shadow, o.compositeOperation, o.visible);
                o = o.parent;
            }
            return matrix;
        };
        DisplayObject.prototype.hitTest = function (x, y) {
            if (this.isHitable) {
                var ctx = DisplayObject._hitTestContext;
                ctx.setTransform(1, 0, 0, 1, -x, -y);
                this.draw(ctx);
                var hit = this._testHit(ctx);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, 2, 2);
                return hit;
            }
            return false;
        };
        DisplayObject.prototype.set = function (props) {
            for (var n in props) {
                this[n] = props[n];
            }
            return this;
        };
        DisplayObject.prototype.getBounds = function () {
            if (this._bounds) {
                return this._rectangle.copy(this._bounds);
            }
            var cacheCanvas = this.cacheCanvas;
            if (cacheCanvas) {
                var scale = this._cacheScale;
                return this._rectangle.setProperies(this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width / scale, cacheCanvas.height / scale);
            }
            return null;
        };
        DisplayObject.prototype.getTransformedBounds = function () {
            return this._getBounds();
        };
        DisplayObject.prototype.setBounds = function (x, y, width, height) {
            if (x == null) {
                this._bounds = null;
            }
            this._bounds = (this._bounds || new Rectangle(x, y, width, height));
        };
        DisplayObject.prototype.clone = function (recursive) {
            var o = new DisplayObject();
            this.cloneProps(o);
            return o;
        };
        DisplayObject.prototype.toString = function () {
            return "[DisplayObject (name=" + this.name + ")]";
        };
        DisplayObject.prototype.cloneProps = function (o) {
            o.alpha = this.alpha;
            o.name = this.name;
            o.regX = this.regX;
            o.regY = this.regY;
            o.rotation = this.rotation;
            o.scaleX = this.scaleX;
            o.scaleY = this.scaleY;
            o.shadow = this.shadow;
            o.skewX = this.skewX;
            o.skewY = this.skewY;
            o.visible = this.visible;
            o.x = this.x;
            o.y = this.y;
            o._bounds = this._bounds;
            o.mouseEnabled = this.mouseEnabled;
            o.compositeOperation = this.compositeOperation;
        };
        DisplayObject.prototype._applyShadow = function (ctx, shadow) {
            shadow = shadow || Shadow.identity;
            ctx.shadowColor = shadow.color;
            ctx.shadowOffsetX = shadow.offsetX;
            ctx.shadowOffsetY = shadow.offsetY;
            ctx.shadowBlur = shadow.blur;
        };
        DisplayObject.prototype.onTick = function (delta) {
            if (this.isDirty) {
                if (this.parent) {
                    this.onResize(this.parent.width, this.parent.height);
                }
            }
        };
        DisplayObject.prototype._testHit = function (ctx) {
            var hit = false;
            if (this.isHitable) {
                hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
            }
            return hit;
        };
        DisplayObject.prototype._applyFilters = function () {
            if (!this.filters || this.filters.length == 0 || !this.cacheCanvas) {
                return;
            }
            var l = this.filters.length;
            var ctx = this.cacheCanvas.getContext("2d");
            var w = this.cacheCanvas.width;
            var h = this.cacheCanvas.height;
            for (var i = 0; i < l; i++) {
                this.filters[i].applyFilter(ctx, 0, 0, w, h);
            }
        };
        DisplayObject.prototype._applyFilterBounds = function (x, y, width, height) {
            var bounds, l, filters = this.filters;
            if (!filters || !(l = filters.length)) {
                return null;
            }
            for (var i = 0; i < l; i++) {
                var f = this.filters[i];
                var fBounds = f.getBounds && f.getBounds();
                if (!fBounds) {
                    continue;
                }
                if (!bounds) {
                    bounds = this._rectangle.setProperies(x, y, width, height);
                }
                bounds.x += fBounds.x;
                bounds.y += fBounds.y;
                bounds.width += fBounds.width;
                bounds.height += fBounds.height;
            }
            return bounds;
        };
        DisplayObject.prototype._getBounds = function (matrix, ignoreTransform) {
            return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
        };
        DisplayObject.prototype._transformBounds = function (bounds, matrix, ignoreTransform) {
            if (!bounds) {
                return bounds;
            }
            var x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
            var mtx = ignoreTransform ? this._matrix.identity() : this.getMatrix(this._matrix);
            if (x || y) {
                mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
            }
            if (matrix) {
                mtx.prependMatrix(matrix);
            }
            var x_a = width * mtx.a, x_b = width * mtx.b;
            var y_c = height * mtx.c, y_d = height * mtx.d;
            var tx = mtx.tx, ty = mtx.ty;
            var minX = tx, maxX = tx, minY = ty, maxY = ty;
            if ((x = x_a + tx) < minX) {
                minX = x;
            }
            else if (x > maxX) {
                maxX = x;
            }
            if ((x = x_a + y_c + tx) < minX) {
                minX = x;
            }
            else if (x > maxX) {
                maxX = x;
            }
            if ((x = y_c + tx) < minX) {
                minX = x;
            }
            else if (x > maxX) {
                maxX = x;
            }
            if ((y = x_b + ty) < minY) {
                minY = y;
            }
            else if (y > maxY) {
                maxY = y;
            }
            if ((y = x_b + y_d + ty) < minY) {
                minY = y;
            }
            else if (y > maxY) {
                maxY = y;
            }
            if ((y = y_d + ty) < minY) {
                minY = y;
            }
            else if (y > maxY) {
                maxY = y;
            }
            return bounds.setProperies(minX, minY, maxX - minX, maxY - minY);
        };
        DisplayObject.prototype._hasMouseEventListener = function () {
            var evts = DisplayObject._MOUSE_EVENTS;
            for (var i = 0, l = evts.length; i < l; i++) {
                if (this.hasEventListener(evts[i])) {
                    return true;
                }
            }
            return this.cursor != null;
        };
        DisplayObject.prototype.onStageSet = function () {
        };
        DisplayObject.prototype.onResize = function (width, height) {
            this.isDirty = false;
            if (this._width_type == 1 /* PERCENT */) {
                this.width = this._width_percent * width;
            }
            else if (this._width_type == 3 /* CALC */) {
                this.width = FluidCalculation.calcUnit(width, this._width_calc);
            }
            if (this._height_type == 1 /* PERCENT */) {
                this.height = this._height_percent * height;
            }
            else if (this._height_type == 3 /* CALC */) {
                this.height = FluidCalculation.calcUnit(height, this._height_calc);
            }
            if (this._regX_type == 1 /* PERCENT */) {
                this.regX = this._regX_percent * this.width;
            }
            else if (this._regX_type == 3 /* CALC */) {
                this.regX = FluidCalculation.calcUnit(this.width, this._regX_calc);
            }
            if (this._regY_type == 1 /* PERCENT */) {
                this.regY = this._regY_percent * this.height;
            }
            else if (this._regY_type == 3 /* CALC */) {
                this.regY = FluidCalculation.calcUnit(this.height, this._regY_calc);
            }
            if (this._x_type == 1 /* PERCENT */) {
                this.x = Math.round(this._x_percent * width);
            }
            else if (this._x_type == 3 /* CALC */) {
                this.x = Math.round(FluidCalculation.calcUnit(width, this._x_calc));
            }
            if (this._y_type == 1 /* PERCENT */) {
                this.y = Math.round(this._y_percent * height);
            }
            else if (this._y_type == 3 /* CALC */) {
                this.y = Math.round(FluidCalculation.calcUnit(height, this._y_calc));
            }
            if (this._resizeSignal && this._resizeSignal.hasListeners()) {
                this._resizeSignal.emit(width, height);
            }
        };
        DisplayObject.prototype.destruct = function () {
            this.parent = null;
            this.destructAllBehaviors();
            _super.prototype.destruct.call(this);
        };
        DisplayObject.EVENT_MOUSE_CLICK = 'click';
        DisplayObject.EVENT_MOUSE_DOWN = 'mousedown';
        DisplayObject.EVENT_MOUSE_OUT = 'mouseout';
        DisplayObject.EVENT_MOUSE_OVER = 'mouseover';
        DisplayObject.EVENT_MOUSE_MOVE = 'mousemove';
        DisplayObject.EVENT_PRESS_MOVE = 'pressmove';
        DisplayObject.EVENT_PRESS_UP = 'pressup';
        DisplayObject.EVENT_ROLL_OUT = 'rollout';
        DisplayObject.EVENT_ROLL_OVER = 'rollover';
        DisplayObject.EVENT_POINTER_CLICK = 'click';
        DisplayObject.EVENT_POINTER_DOWN = 'mousedown';
        DisplayObject.EVENT_POINTER_MOVE = 'mousemove';
        DisplayObject.EVENT_POINTER_UP = 'pressup';
        DisplayObject.EVENT_POINTER_CANCEL = 'mousedown';
        DisplayObject.EVENT_POINTER_ENTER = 'mouseover';
        DisplayObject.EVENT_POINTER_LEAVE = 'mouseout';
        DisplayObject.EVENT_POINTER_OUT = 'mouseout';
        DisplayObject.EVENT_POINTER_OVER = 'mouseover';
        DisplayObject._MOUSE_EVENTS = [
            DisplayObject.EVENT_MOUSE_CLICK,
            DisplayObject.EVENT_MOUSE_DOWN,
            DisplayObject.EVENT_MOUSE_OUT,
            DisplayObject.EVENT_MOUSE_OVER,
            DisplayObject.EVENT_PRESS_MOVE,
            DisplayObject.EVENT_PRESS_UP,
            DisplayObject.EVENT_ROLL_OUT,
            DisplayObject.EVENT_ROLL_OVER,
            "dblclick"
        ];
        DisplayObject.COMPOSITE_OPERATION_SOURCE_ATOP = 'source-atop';
        DisplayObject.COMPOSITE_OPERATION_SOURCE_IN = 'source-in';
        DisplayObject.COMPOSITE_OPERATION_SOURCE_OUT = 'source-out';
        DisplayObject.COMPOSITE_OPERATION_SOURCE_OVER = 'source-over';
        DisplayObject.COMPOSITE_OPERATION_DESTINATION_ATOP = 'destination-atop';
        DisplayObject.COMPOSITE_OPERATION_DESTINATION_IN = 'destination-in';
        DisplayObject.COMPOSITE_OPERATION_DESTINATION_OUT = 'destination-out';
        DisplayObject.COMPOSITE_OPERATION_DESTINATION_OVER = 'destination-over';
        DisplayObject.COMPOSITE_OPERATION_LIGHTER = 'lighter';
        DisplayObject.COMPOSITE_OPERATION_DARKER = 'darker';
        DisplayObject.COMPOSITE_OPERATION_XOR = 'xor';
        DisplayObject.COMPOSITE_OPERATION_COPY = 'copy';
        DisplayObject.suppressCrossDomainErrors = false;
        DisplayObject._snapToPixelEnabled = false;
        DisplayObject._hitTestCanvas = Methods.createCanvas();
        DisplayObject._hitTestContext = DisplayObject._hitTestCanvas.getContext('2d');
        DisplayObject._nextCacheID = 1;
        return DisplayObject;
    })(EventDispatcher);
    return DisplayObject;
});
