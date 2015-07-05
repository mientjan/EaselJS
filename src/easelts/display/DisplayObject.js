/*
 * DisplayObject
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../createts/event/EventDispatcher', '../../createts/event/Signal2', '../util/UID', '../util/Methods', './Shadow', '../geom/FluidCalculation', '../geom/Matrix2', '../geom/Rectangle', '../geom/Point'], function (require, exports, EventDispatcher, Signal2, UID, Methods, Shadow, FluidCalculation, m2, Rectangle, Point) {
    /**
     * @author Mient-jan Stelling <mientjan.stelling@gmail.com>
     * @class DisplayObject
     */
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
            /**
             * If a cache is active, this returns the canvas that holds the cached version of this display object. See {{#crossLink "cache"}}{{/crossLink}}
             * for more information.
             * @property cacheCanvas
             * @type {HTMLCanvasElement | Object}
             * @default null
             * @readonly
             **/
            this.cacheCanvas = null;
            /**
             * Unique ID for this display object. Makes display objects easier for some uses.
             * @property id
             * @type {Number}
             * @default -1
             **/
            this.id = UID.get();
            /**
             * Indicates whether to include this object when running mouse interactions. Setting this to `false` for children
             * of a {{#crossLink "Container"}}{{/crossLink}} will cause events on the Container to not fire when that child is
             * clicked. Setting this property to `false` does not prevent the {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}}
             * method from returning the child.
             *
             * <strong>Note:</strong> In EaselJS 0.7.0, the mouseEnabled property will not work properly with nested Containers. Please
             * check out the latest NEXT version in <a href="https://github.com/CreateJS/EaselJS/tree/master/lib">GitHub</a> for an updated version with this issue resolved. The fix will be
             * provided in the next release of EaselJS.
             * @property mouseEnabled
             * @type {Boolean}
             * @default false
             **/
            this.mouseEnabled = true;
            /**
             * If false, the tick will not run on this display object (or its children). This can provide some performance benefits.
             * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
             * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
             * @property tickEnabled
             * @type Boolean
             * @default true
             **/
            this.tickEnabled = true;
            /**
             * An optional name for this display object. Included in {{#crossLink "DisplayObject/toString"}}{{/crossLink}} . Useful for
             * debugging.
             * @property name
             * @type {String}
             * @default null
             **/
            this.name = null;
            /**
             * A reference to the {{#crossLink "Container"}}{{/crossLink}} or {{#crossLink "Stage"}}{{/crossLink}} object that
             * contains this display object, or null if it has not been added
             * to one.
             *
             * @property parent
             * @final
             * @type {Container}
             * @default null
             * @readonly
             **/
            this.parent = null;
            /**
             * Indicates whether this display object should be rendered to the canvas and included when running the Stage
             * {{#crossLink "Stage/getObjectsUnderPoint"}}{{/crossLink}} method.
             * @property visible
             * @type {Boolean}
             * @default true
             **/
            this.visible = true;
            /**
             * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
             * @property alpha
             * @type {Number}
             * @default 1
             **/
            this.alpha = 1;
            /**
             * @property isDirty
             * @type {boolean}
             * @description is set by Container, setWidth setHeight, setX, setY, setRegX, setRegY. When set true onTick will trigger a onResize event.
             *  this is a better way to check if its been added to the stage because onTick is only triggered when added to the stage.
             */
            this.isDirty = false;
            this.isHitable = true;
            /**
             * The x (horizontal) position of the display object, relative to its parent.
             * @property x
             * @type {Number}
             * @default 0
             **/
            this.x = 0;
            this._x_type = 2 /* STATIC */;
            this._x_percent = .0;
            /** The y (vertical) position of the display object, relative to its parent.
             * @property y
             * @type {Number}
             * @default 0
             **/
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
            /**
             * The rotation in degrees for this display object.
             * @property rotation
             * @type {Number}
             * @default 0
             **/
            this.rotation = 0;
            /**
             * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
             * object to twice its nominal width. To horizontally flip an object, set the scale to a negative number.
             * @property scaleX
             * @type {Number}
             * @default 1
             **/
            this.scaleX = 1;
            /**
             * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
             * object to half its nominal height. To vertically flip an object, set the scale to a negative number.
             * @property scaleY
             * @type {Number}
             * @default 1
             **/
            this.scaleY = 1;
            /**
             * The factor to skew this display object horizontally.
             * @property skewX
             * @type {Number}
             * @default 0
             **/
            this.skewX = 0;
            /**
             * The factor to skew this display object vertically.
             * @property skewY
             * @type {Number}
             * @default 0
             **/
            this.skewY = 0;
            /**
             * A shadow object that defines the shadow to render on this display object. Set to `null` to remove a shadow. If
             * null, this property is inherited from the parent container.
             * @property shadow
             * @type {Shadow}
             * @default null
             **/
            this.shadow = null;
            /**
             * The Stage instance that the display object is a descendent of. null if the DisplayObject has not
             * been added to a Stage.
             * @property stage
             * @type {Stage}
             * @default null
             **/
            this.stage = null;
            this._behaviorList = null;
            /**
             * The composite operation indicates how the pixels of this display object will be composited with the elements
             * behind it. If `null`, this property is inherited from the parent container. For more information, read the
             * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
             * whatwg spec on compositing</a>.
             * @property compositeOperation
             * @type {String}
             * @default null
             **/
            this.compositeOperation = null;
            /**
             * Indicates whether the display object should be drawn to a whole pixel when
             * {{#crossLink "Stage/snapToPixelEnabled"}}{{/crossLink}} is true. To enable/disable snapping on whole
             * categories of display objects, set this value on the prototype (Ex. Text.prototype.snapToPixel = true).
             * @property snapToPixel
             * @type {Boolean}
             * @default true
             **/
            this.snapToPixel = true;
            /**
             * An array of Filter objects to apply to this display object. Filters are only applied / updated when {{#crossLink "cache"}}{{/crossLink}}
             * or {{#crossLink "updateCache"}}{{/crossLink}} is called on the display object, and only apply to the area that is
             * cached.
             * @property filters
             * @type {Array}
             * @default null
             **/
            this.filters = null;
            /**
             * Returns an ID number that uniquely identifies the current cache for this display object. This can be used to
             * determine if the cache has changed since a previous check.
             * @property cacheID
             * @type {Number}
             * @default 0
             */
            this.cacheID = 0;
            /**
             * A Shape instance that defines a vector mask (clipping path) for this display object.  The shape's transformation
             * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
             * @property mask
             * @type {Shape}
             * @default null
             */
            this.mask = null;
            /**
             * A display object that will be tested when checking mouse interactions or testing {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}}.
             * The hit area will have its transformation applied relative to this display object's coordinate space (as though
             * the hit test object were a child of this display object and relative to its regX/Y). The hitArea will be tested
             * using only its own `alpha` value regardless of the alpha value on the target display object, or the target's
             * ancestors (parents).
             *
             * If set on a {{#crossLink "Container"}}{{/crossLink}}, children of the Container will not receive mouse events.
             * This is similar to setting {{#crossLink "mouseChildren"}}{{/crossLink}} to false.
             *
             * Note that hitArea is NOT currently used by the `hitTest()` method, nor is it supported for {{#crossLink "Stage"}}{{/crossLink}}.
             * @property hitArea
             * @type {DisplayObject}
             * @default null
             */
            this.hitArea = null;
            /**
             * A CSS cursor (ex. "pointer", "help", "text", etc) that will be displayed when the user hovers over this display
             * object. You must enable mouseover events using the {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}} method to
             * use this property. Setting a non-null cursor on a Container will override the cursor set on its descendants.
             * @property cursor
             * @type {String}
             * @default null
             */
            this.cursor = null;
            /**
             * @property _cacheOffsetX
             * @protected
             * @type {Number}
             * @default 0
             **/
            this._cacheOffsetX = 0;
            /**
             * @property _cacheOffsetY
             * @protected
             * @type {Number}
             * @default 0
             **/
            this._cacheOffsetY = 0;
            this._cacheScale = 1;
            /**
             * @property _cacheDataURLID
             * @protected
             * @type {Number}
             * @default 0
             */
            this._cacheDataURLID = 0;
            /**
             * @property _cacheDataURL
             * @protected
             * @type {String}
             * @default null
             */
            this._cacheDataURL = null;
            /**
             * @property _matrix
             * @protected
             * @type {Matrix2D}
             * @default null
             **/
            this._matrix = new m2.Matrix2(0, 0, 0, 0, 0, 0);
            /**
             * @property _rectangle
             * @protected
             * @type {Rectangle}
             * @default null
             **/
            this._rectangle = new Rectangle(0, 0, 0, 0);
            /**
             * @property _bounds
             * @protected
             * @type {Rectangle}
             * @default null
             **/
            this._bounds = null;
            this._off = false;
            this.DisplayObject_getBounds = this._getBounds;
            this.setGeomTransform(width, height, x, y, regX, regY);
        }
        Object.defineProperty(DisplayObject.prototype, "resizeSignal", {
            /**
             *
             * @returns {Signal2<number, number>}
             */
            get: function () {
                if (this._resizeSignal === void 0) {
                    this._resizeSignal = new Signal2();
                }
                return this._resizeSignal;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * has something to do with the createjs toolkit needing to call initialize.
         * @method initialize
         * @param args
         */
        DisplayObject.prototype.initialize = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this['constructor'].apply(this, args);
        };
        /**
         * @method dot
         * @param v
         * @returns {number}
         */
        DisplayObject.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        /**
         * @method distanceToSquared
         * @param v
         * @returns {number}
         */
        DisplayObject.prototype.distanceToSquared = function (v) {
            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;
        };
        /**
         * distanceTo
         * @param {IVector2} v
         * @returns {any}
         */
        DisplayObject.prototype.distanceTo = function (v) {
            return Math.sqrt(this.distanceToSquared(v));
        };
        /**
         * @method setWidth
         * @param {string|number} width
         */
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
        /**
         * @method getWidth
         * @returns {number}
         */
        DisplayObject.prototype.getWidth = function () {
            return this.width;
        };
        /**
         * @method setHeight
         * @param {string|number} height
         * @result DisplayObject
         */
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
        /**
         * @method getHeight
         * @returns {number}
         */
        DisplayObject.prototype.getHeight = function () {
            return this.height;
        };
        /**
         * @method setX
         * @param {string|number} x
         * @return DisplayObject
         */
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
        /**
         * @method getX
         * @return {Number}
         */
        DisplayObject.prototype.getX = function () {
            return this.x;
        };
        /**
         * @method setY
         * @param {number|string} y
         * @returns {DisplayObject}
         */
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
        /**
         * @method getY
         * @returns {number}
         */
        DisplayObject.prototype.getY = function () {
            return this.y;
        };
        /**
         * @method setRegX
         * @param {number|string} value
         * @returns {DisplayObject}
         */
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
        /**
         * @method getRegX
         * @returns {number}
         */
        DisplayObject.prototype.getRegX = function () {
            return this.regX;
        };
        /**
         * @method setRegY
         * @param {number|string} value
         * @returns {DisplayObject}
         */
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
        /**
         * @method getRegY
         * @returns {number}
         */
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
        /**
         * Destructs all behaviors
         *
         * @method removeAllBehaviors
         * @return void
         */
        DisplayObject.prototype.destructAllBehaviors = function () {
            if (this._behaviorList) {
                while (this._behaviorList.length) {
                    this._behaviorList.shift().destruct();
                }
                this._behaviorList = null;
            }
        };
        /**
         * @method enableMouseInteraction
         * @return void
         */
        DisplayObject.prototype.enableMouseInteraction = function () {
            this.mouseEnabled = true;
        };
        /**
         * @method disableMouseInteraction
         * @return void
         */
        DisplayObject.prototype.disableMouseInteraction = function () {
            this.mouseEnabled = false;
        };
        /**
         * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
         * This does not account for whether it would be visible within the boundaries of the stage.
         *
         * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
         * @method isVisible
         * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
         **/
        DisplayObject.prototype.isVisible = function () {
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
        };
        /**
         * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
         * Returns <code>true</code> if the draw was handled (useful for overriding functionality).
         *
         * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
         * @method draw
         * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
         * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
         * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
         * @return {Boolean}
         **/
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
        DisplayObject.prototype.DisplayObject_draw = function (ctx, ignoreCache) {
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
        /**
         * Applies this display object's transformation, alpha, globalCompositeOperation, clipping path (mask), and shadow
         * to the specified context. This is typically called prior to {{#crossLink "DisplayObject/draw"}}{{/crossLink}}.
         *
         * @method updateContext
         * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
         **/
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
        /**
         * Draws the display object into a new canvas, which is then used for subsequent draws. For complex content
         * that does not change frequently (ex. a Container with many children that do not move, or a complex vector Shape),
         * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
         * cached display object can be moved, rotated, faded, etc freely, however if its content changes, you must
         * manually update the cache by calling <code>updateCache()</code> or <code>cache()</code> again. You must specify
         * the cache area via the x, y, w, and h parameters. This defines the rectangle that will be rendered and cached
         * using this display object's coordinates.
         *
         * <h4>Example</h4>
         * For example if you defined a Shape that drew a circle at 0, 0 with a radius of 25:
         *
         *      var shape = new createjs.Shape();
         *      shape.graphics.beginFill("#ff0000").drawCircle(0, 0, 25);
         *      myShape.cache(-25, -25, 50, 50);
         *
         * Note that filters need to be defined <em>before</em> the cache is applied. Check out the {{#crossLink "Filter"}}{{/crossLink}}
         * class for more information. Some filters (ex. BlurFilter) will not work as expected in conjunction with the scale param.
         *
         * Usually, the resulting cacheCanvas will have the dimensions width*scale by height*scale, however some filters (ex. BlurFilter)
         * will add padding to the canvas dimensions.
         *
         * @method cache
         * @param {Number} x The x coordinate origin for the cache region.
         * @param {Number} y The y coordinate origin for the cache region.
         * @param {Number} width The width of the cache region.
         * @param {Number} height The height of the cache region.
         * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
         *    myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
         *    cached elements with greater fidelity. Default is 1.
         **/
        DisplayObject.prototype.cache = function (x, y, width, height, scale) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            if (scale === void 0) { scale = 1; }
            // draw to canvas.
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
        /**
         * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
         * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the display object
         * will be drawn over the existing cache using the specified compositeOperation.
         *
         * <h4>Example</h4>
         * Clear the current graphics of a cached shape, draw some new instructions, and then update the cache. The new line
         * will be drawn on top of the old one.
         *
         *      // Not shown: Creating the shape, and caching it.
         *      shapeInstance.clear();
         *      shapeInstance.setStrokeStyle(3).beginStroke("#ff0000").moveTo(100, 100).lineTo(200,200);
         *      shapeInstance.updateCache();
         *
         * @method updateCache
         * @param {String} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
         * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
         * whatwg spec on compositing</a>.
         **/
        DisplayObject.prototype.updateCache = function (compositeOperation) {
            var cacheCanvas = this.cacheCanvas, scale = this._cacheScale, offX = this._cacheOffsetX * scale, offY = this._cacheOffsetY * scale;
            var w = this._cacheWidth, h = this._cacheHeight, fBounds;
            if (!cacheCanvas) {
                throw "cache() must be called before updateCache()";
            }
            var ctx = cacheCanvas.getContext("2d");
            // update bounds based on filters:
            if (fBounds = this._applyFilterBounds(offX, offY, w, h)) {
                offX = fBounds.x;
                offY = fBounds.y;
                w = fBounds.width;
                h = fBounds.height;
            }
            w = Math.ceil(w * scale);
            h = Math.ceil(h * scale);
            if (w != cacheCanvas.width || h != cacheCanvas.height) {
                // TODO: it would be nice to preserve the content if there is a compositeOperation.
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
            // TODO: filters and cache scale don't play well together at present.
            this._applyFilters();
            ctx.restore();
            this.cacheID = DisplayObject._nextCacheID++;
        };
        /**
         * Clears the current cache. See {{#crossLink "DisplayObject/cache"}}{{/crossLink}} for more information.
         * @method uncache
         **/
        DisplayObject.prototype.uncache = function () {
            this._cacheDataURL = this.cacheCanvas = null;
            this.cacheID = this._cacheOffsetX = this._cacheOffsetY = 0;
            this._cacheScale = 1;
        };
        /**
         * Returns a data URL for the cache, or null if this display object is not cached.
         * Uses cacheID to ensure a new data URL is not generated if the cache has not changed.
         * @method getCacheDataURL
         * @return {String} The image data url for the cache.
         **/
        DisplayObject.prototype.getCacheDataURL = function () {
            if (!this.cacheCanvas) {
                return null;
            }
            if (this.cacheID != this._cacheDataURLID) {
                this._cacheDataURL = this.cacheCanvas.toDataURL();
            }
            return this._cacheDataURL;
        };
        /**
         * Transforms the specified x and y position from the coordinate space of the display object
         * to the global (stage) coordinate space. For example, this could be used to position an HTML label
         * over a specific point on a nested display object. Returns a Point instance with x and y properties
         * correlating to the transformed coordinates on the stage.
         *
         * <h4>Example</h4>
         *
         *      displayObject.x = 300;
         *      displayObject.y = 200;
         *      stage.addChild(displayObject);
         *      var point = myDisplayObject.localToGlobal(100, 100);
         *      // Results in x=400, y=300
         *
         * @method localToGlobal
         * @param {Number} x The x position in the source display object to transform.
         * @param {Number} y The y position in the source display object to transform.
         * @return {Point} A Point instance with x and y properties correlating to the transformed coordinates
         * on the stage.
         **/
        DisplayObject.prototype.localToGlobal = function (x, y) {
            var mtx = this.getConcatenatedMatrix(this._matrix);
            if (mtx == null) {
                return null;
            }
            mtx.append(1, 0, 0, 1, x, y);
            return new Point(mtx.tx, mtx.ty);
        };
        /**
         * Transforms the specified x and y position from the global (stage) coordinate space to the
         * coordinate space of the display object. For example, this could be used to determine
         * the current mouse position within the display object. Returns a Point instance with x and y properties
         * correlating to the transformed position in the display object's coordinate space.
         *
         * <h4>Example</h4>
         *
         *      displayObject.x = 300;
         *      displayObject.y = 200;
         *      stage.addChild(displayObject);
         *      var point = myDisplayObject.globalToLocal(100, 100);
         *      // Results in x=-200, y=-100
         *
         * @method globalToLocal
         * @param {Number} x The x position on the stage to transform.
         * @param {Number} y The y position on the stage to transform.
         * @return {Point} A Point instance with x and y properties correlating to the transformed position in the
         * display object's coordinate space.
         **/
        DisplayObject.prototype.globalToLocal = function (x, y) {
            var mtx = this.getConcatenatedMatrix(this._matrix);
            if (mtx == null) {
                return null;
            }
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            return new Point(mtx.tx, mtx.ty);
        };
        /**
         * Transforms the specified x and y position from the coordinate space of this display object to the coordinate
         * space of the target display object. Returns a Point instance with x and y properties correlating to the
         * transformed position in the target's coordinate space. Effectively the same as using the following code with
         * {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}} and {{#crossLink "DisplayObject/globalToLocal"}}{{/crossLink}}.
         *
         *      var pt = this.localToGlobal(x, y);
         *      pt = target.globalToLocal(pt.x, pt.y);
         *
         * @method localToLocal
         * @param {Number} x The x position in the source display object to transform.
         * @param {Number} y The y position on the source display object to transform.
         * @param {DisplayObject} target The target display object to which the coordinates will be transformed.
         * @return {Point} Returns a Point instance with x and y properties correlating to the transformed position
         * in the target's coordinate space.
         **/
        DisplayObject.prototype.localToLocal = function (x, y, target) {
            var pt = this.localToGlobal(x, y);
            return target.globalToLocal(pt.x, pt.y);
        };
        /**
         * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
         * Omitted parameters will have the default value set.
         *
         * <h4>Example</h4>
         *
         *      displayObject.setTransform(100, 100, 2, 2);
         *
         * @method setTransform
         * @param {Number} [x=0] The horizontal translation (x position) in pixels
         * @param {Number} [y=0] The vertical translation (y position) in pixels
         * @param {Number} [scaleX=1] The horizontal scale, as a percentage of 1
         * @param {Number} [scaleY=1] the vertical scale, as a percentage of 1
         * @param {Number} [rotation=0] The rotation, in degrees
         * @param {Number} [skewX=0] The horizontal skew factor
         * @param {Number} [skewY=0] The vertical skew factor
         * @param {Number} [regX=0] The horizontal registration point in pixels
         * @param {Number} [regY=0] The vertical registration point in pixels
         * @return {DisplayObject} Returns this instance. Useful for chaining commands.
         */
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
        /**
         *
         * @param w
         * @param h
         * @param x
         * @param y
         * @param rx
         * @param ry
         * @returns {DisplayObject}
         */
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
        /**
         * Returns a matrix based on this object's transform.
         * @method getMatrix
         * @param {Matrix2D} matrix Optional. A Matrix2D object to populate with the calculated values. If null, a new
         * Matrix object is returned.
         * @return {Matrix2D} A matrix representing this display object's transform.
         **/
        DisplayObject.prototype.getMatrix = function (matrix) {
            var o = this;
            return (matrix ? matrix.identity() : new m2.Matrix2(0, 0, 0, 0, 0, 0)).appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).appendProperties(o.alpha, o.shadow, o.compositeOperation, 1);
        };
        /**
         * Generates a concatenated Matrix2D object representing the combined transform of the display object and all of its
         * parent Containers up to the highest level ancestor (usually the {{#crossLink "Stage"}}{{/crossLink}}). This can
         * be used to transform positions between coordinate spaces, such as with {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}}
         * and {{#crossLink "DisplayObject/globalToLocal"}}{{/crossLink}}.
         * @method getConcatenatedMatrix
         * @param {Matrix2D} [matrix] A {{#crossLink "Matrix2D"}}{{/crossLink}} object to populate with the calculated values.
         * If null, a new Matrix2D object is returned.
         * @return {Matrix2D} a concatenated Matrix2D object representing the combined transform of the display object and
         * all of its parent Containers up to the highest level ancestor (usually the {{#crossLink "Stage"}}{{/crossLink}}).
         **/
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
        /**
         * Tests whether the display object intersects the specified point in local coordinates (ie. draws a pixel with alpha > 0 at
         * the specified position). This ignores the alpha, shadow, hitArea, mask, and compositeOperation of the display object.
         *
         * <h4>Example</h4>
         *
         *      stage.addEventListener("stagemousedown", handleMouseDown);
         *      function handleMouseDown(event) {
         *          var hit = myShape.hitTest(event.stageX, event.stageY);
         *      }
         *
         * Please note that shape-to-shape collision is not currently supported by EaselJS.
         * @method hitTest
         * @param {Number} x The x position to check in the display object's local coordinates.
         * @param {Number} y The y position to check in the display object's local coordinates.
         * @return {Boolean} A Boolean indicting whether a visible portion of the DisplayObject intersect the specified
         * local Point.
         */
        DisplayObject.prototype.hitTest = function (x, y) {
            if (this.isHitable) {
                // TODO: update with support for .hitArea & .mask and update hitArea / mask docs?
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
        /**
         * Provides a chainable shortcut method for setting a number of properties on the instance.
         *
         * <h4>Example</h4>
         *
         *      var myGraphics = new createjs.Graphics().beginFill("#ff0000").drawCircle(0, 0, 25);
         *      var shape = stage.addChild(new Shape())
         *          .set({graphics:myGraphics, x:100, y:100, alpha:0.5});
         *
         * @method set
         * @param {Object} props A generic object containing properties to copy to the DisplayObject instance.
         * @return {DisplayObject} Returns the instance the method is called on (useful for chaining calls.)
         *
         * @todo remove this functionality, it completely removes efficient jit compile optimizations in v8 and other engines.
         */
        DisplayObject.prototype.set = function (props) {
            for (var n in props) {
                this[n] = props[n];
            }
            return this;
        };
        /**
         * Returns a rectangle representing this object's bounds in its local coordinate system (ie. with no transformation).
         * Objects that have been cached will return the bounds of the cache.
         *
         * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
         * {{#crossLink "DisplayObject/setBounds"}}{{/crossLink}} so that they are included when calculating Container
         * bounds.
         *
         * <table>
         *    <tr><td><b>All</b></td><td>
         *        All display objects support setting bounds manually using setBounds(). Likewise, display objects that
         *        have been cached using cache() will return the bounds of their cache. Manual and cache bounds will override
         *        the automatic calculations listed below.
         *    </td></tr>
         *    <tr><td><b>Bitmap</b></td><td>
         *        Returns the width and height of the sourceRect (if specified) or image, extending from (x=0,y=0).
         *    </td></tr>
         *    <tr><td><b>Sprite</b></td><td>
         *        Returns the bounds of the current frame. May have non-zero x/y if a frame registration point was specified
         *        in the spritesheet data. See also {{#crossLink "SpriteSheet/getFrameBounds"}}{{/crossLink}}
         *    </td></tr>
         *    <tr><td><b>Container</b></td><td>
         *        Returns the aggregate (combined) bounds of all children that return a non-null value from getBounds().
         *    </td></tr>
         *    <tr><td><b>Shape</b></td><td>
         *        Does not currently support automatic bounds calculations. Use setBounds() to manually define bounds.
         *    </td></tr>
         *    <tr><td><b>Text</b></td><td>
         *        Returns approximate bounds. Horizontal values (x/width) are quite accurate, but vertical values (y/height) are
         *        not, especially when using textBaseline values other than "top".
         *    </td></tr>
         *    <tr><td><b>BitmapText</b></td><td>
         *        Returns approximate bounds. Values will be more accurate if spritesheet frame registration points are close
         *        to (x=0,y=0).
         *    </td></tr>
         * </table>
         *
         * Bounds can be expensive to calculate for some objects (ex. text, or containers with many children), and
         * are recalculated each time you call getBounds(). You can prevent recalculation on static objects by setting the
         * bounds explicitly:
         *
         *    var bounds = obj.getBounds();
         *    obj.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
         *    // getBounds will now use the set values, instead of recalculating
         *
         * To reduce memory impact, the returned Rectangle instance may be reused internally; clone the instance or copy its
         * values if you need to retain it.
         *
         *    var myBounds = obj.getBounds().clone();
         *    // OR:
         *    myRect.copy(obj.getBounds());
         *
         * @method getBounds
         * @return {Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this
         * object.
         **/
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
        /**
         * Returns a rectangle representing this object's bounds in its parent's coordinate system (ie. with transformations applied).
         * Objects that have been cached will return the transformed bounds of the cache.
         *
         * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
         * {{#crossLink "DisplayObject/setBounds"}}{{/crossLink}} so that they are included when calculating Container
         * bounds.
         *
         * To reduce memory impact, the returned Rectangle instance may be reused internally; clone the instance or copy its
         * values if you need to retain it.
         *
         * Container instances calculate aggregate bounds for all children that return bounds via getBounds.
         * @method getTransformedBounds
         * @return {Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this object.
         **/
        DisplayObject.prototype.getTransformedBounds = function () {
            return this._getBounds();
        };
        /**
         * Allows you to manually specify the bounds of an object that either cannot calculate their own bounds (ex. Shape &
         * Text) for future reference, or so the object can be included in Container bounds. Manually set bounds will always
         * override calculated bounds.
         *
         * The bounds should be specified in the object's local (untransformed) coordinates. For example, a Shape instance
         * with a 25px radius circle centered at 0,0 would have bounds of (-25, -25, 50, 50).
         * @method setBounds
         * @param {Number} x The x origin of the bounds. Pass null to remove the manual bounds.
         * @param {Number} y The y origin of the bounds.
         * @param {Number} width The width of the bounds.
         * @param {Number} height The height of the bounds.
         **/
        DisplayObject.prototype.setBounds = function (x, y, width, height) {
            if (x == null) {
                this._bounds = null;
            }
            this._bounds = (this._bounds || new Rectangle(x, y, width, height));
        };
        /**
         * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
         * reverted to their defaults (for example .parent). Also note that caches are not maintained across clones.
         * @method clone
         * @return {DisplayObject} A clone of the current DisplayObject instance.
         **/
        DisplayObject.prototype.clone = function (recursive) {
            var o = new DisplayObject();
            this.cloneProps(o);
            return o;
        };
        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {String} a string representation of the instance.
         **/
        DisplayObject.prototype.toString = function () {
            return "[DisplayObject (name=" + this.name + ")]";
        };
        // private methods:
        // separated so it can be used more easily in subclasses:
        /**
         * @method cloneProps
         * @protected
         * @param {DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
         * instance copied into.
         **/
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
        /**
         * @method _applyShadow
         * @protected
         * @param {CanvasRenderingContext2D} ctx
         * @param {Shadow} shadow
         **/
        DisplayObject.prototype._applyShadow = function (ctx, shadow) {
            shadow = shadow || Shadow.identity;
            ctx.shadowColor = shadow.color;
            ctx.shadowOffsetX = shadow.offsetX;
            ctx.shadowOffsetY = shadow.offsetY;
            ctx.shadowBlur = shadow.blur;
        };
        /**
         * @method _tick
         * @param {number} delta
         * @protected
         **/
        DisplayObject.prototype.onTick = function (delta) {
            if (this.isDirty) {
                if (this.parent) {
                    this.onResize(this.parent.width, this.parent.height);
                }
            }
        };
        /**
         * @method _testHit
         * @protected
         * @param {CanvasRenderingContext2D} ctx
         * @return {Boolean}
         **/
        DisplayObject.prototype._testHit = function (ctx) {
            var hit = false;
            if (this.isHitable) {
                hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
            }
            return hit;
        };
        /**
         * @method _applyFilters
         * @protected
         **/
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
        /**
         * @method _applyFilterBounds
         * @param {Number} x
         * @param {Number} y
         * @param {Number} width
         * @param {Number} height
         * @return {Rectangle}
         * @protected
         **/
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
        /**
         * @method _getBounds
         * @param {Matrix2D} matrix
         * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
         * @return {Rectangle}
         * @protected
         **/
        DisplayObject.prototype._getBounds = function (matrix, ignoreTransform) {
            return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
        };
        /**
         * @method _transformBounds
         * @param {Rectangle} bounds
         * @param {Matrix2D} matrix
         * @param {Boolean} ignoreTransform
         * @return {Rectangle}
         * @protected
         **/
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
        /**
         * Indicates whether the display object has any mouse event listeners or a cursor.
         *
         * @method _hasMouseEventListener
         * @return {Boolean}
         * @protected
         **/
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
            // is no longer dirty
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
        /**
         *
         * @type {string}
         */
        DisplayObject.EVENT_MOUSE_MOVE = 'mousemove';
        DisplayObject.EVENT_PRESS_MOVE = 'pressmove';
        DisplayObject.EVENT_PRESS_UP = 'pressup';
        DisplayObject.EVENT_ROLL_OUT = 'rollout';
        DisplayObject.EVENT_ROLL_OVER = 'rollover';
        /**
         * @todo replace mouse events with pointer events
         */
        DisplayObject.EVENT_POINTER_CLICK = 'click';
        DisplayObject.EVENT_POINTER_DOWN = 'mousedown';
        DisplayObject.EVENT_POINTER_MOVE = 'mousemove';
        DisplayObject.EVENT_POINTER_UP = 'pressup';
        DisplayObject.EVENT_POINTER_CANCEL = 'mousedown';
        DisplayObject.EVENT_POINTER_ENTER = 'mouseover';
        DisplayObject.EVENT_POINTER_LEAVE = 'mouseout';
        DisplayObject.EVENT_POINTER_OUT = 'mouseout';
        DisplayObject.EVENT_POINTER_OVER = 'mouseover';
        /**
         * Listing of mouse event names. Used in _hasMouseEventListener.
         * @property _MOUSE_EVENTS
         * @protected
         * @static
         * @type {string[]}
         **/
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
        /**
         * Suppresses errors generated when using features like hitTest, mouse events, and {{#crossLink "getObjectsUnderPoint"}}{{/crossLink}}
         * with cross domain content.
         * @property suppressCrossDomainErrors
         * @static
         * @type {Boolean}
         * @default false
         **/
        DisplayObject.suppressCrossDomainErrors = false;
        /**
         * @property _snapToPixelEnabled
         * @protected
         * @static
         * @type {Boolean}
         * @default false
         **/
        DisplayObject._snapToPixelEnabled = false; // stage.snapToPixelEnabled is temporarily copied here during a draw to provide global access.
        /**
         * @property _hitTestCanvas
         * @type {HTMLCanvasElement | Object}
         * @static
         * @protected
         **/
        DisplayObject._hitTestCanvas = Methods.createCanvas();
        /**
         * @property _hitTestContext
         * @type {CanvasRenderingContext2D}
         * @static
         * @protected
         **/
        DisplayObject._hitTestContext = DisplayObject._hitTestCanvas.getContext('2d');
        /**
         * @property _nextCacheID
         * @type {Number}
         * @static
         * @protected
         **/
        DisplayObject._nextCacheID = 1;
        return DisplayObject;
    })(EventDispatcher);
    return DisplayObject;
});
