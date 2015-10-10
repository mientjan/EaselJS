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
    /**
     * @module createts
     */
    /**
     * A stage is the root level {{#crossLink "Container"}}{{/crossLink}} for a display list. Each time its {{#crossLink "Stage/tick"}}{{/crossLink}}
     * method is called, it will render its display list to its target canvas.
     *
     * <h4>Example</h4>
     * This example creates a stage, adds a child to it, then uses {{#crossLink "Ticker"}}{{/crossLink}} to update the child
     * and redraw the stage using {{#crossLink "Stage/update"}}{{/crossLink}}.
     *
     *      var stage = new createjs.Stage("canvasElementId");
     *      var image = new createjs.Bitmap("imagePath.png");
     *      stage.addChild(image);
     *      createjs.Ticker.addEventListener("tick", handleTick);
     *      function handleTick(event) {
     *          image.x += 10;
     *          stage.update();
     *      }
     *
     * @namespace easelts.display
     * @class Stage
     * @extends Container
     * @constructor
     * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the Stage will render to, or the string id
     * of a canvas object in the current document.
     **/
    var Stage = (function (_super) {
        __extends(Stage, _super);
        /**
         * @class Stage
         * @constructor
         * @param {HTMLCanvasElement|HTMLBlockElement} element A canvas or div element. If it's a div element, a canvas object will be created and appended to the div.
         * @param {boolean} [triggerResizeOnWindowResize=false] Indicates whether onResize should be called when the window is resized
         **/
        function Stage(element, option) {
            var _this = this;
            _super.call(this, '100%', '100%', 0, 0, 0, 0);
            this.tickstartSignal = new Signal_1.default();
            /**
             * Dispatched each update immediately after the tick event is propagated through the display list. Does not fire if
             * tickOnUpdate is false. Precedes the "drawstart" event.
             * @event tickend
             */
            this.tickendSignal = new Signal_1.default();
            /**
             * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it.
             * You can call preventDefault on the event object to cancel the draw.
             * @event drawstart
             */
            this.drawstartSignal = new Signal_1.default();
            /**
             * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is restored.
             * @event drawend
             */
            this.drawendSignal = new Signal_1.default();
            // public properties:
            this.type = 2 /* STAGE */;
            this._isRunning = false;
            this._fps = 60;
            this._fpsCounter = null;
            this._eventListeners = null;
            this._onResizeEventListener = null;
            /**
             * The canvas the stage will render to. Multiple stages can share a single canvas, but you must disable autoClear for all but the
             * first stage that will be ticked (or they will clear each other's render).
             *
             * When changing the canvas property you must disable the events on the old canvas, and enable events on the
             * new canvas or mouse events will not work as expected. For example:
             *
             *      myStage.enableDOMEvents(false);
             *      myStage.canvas = anotherCanvas;
             *      myStage.enableDOMEvents(true);
             *
             * @property canvas
             * @type HTMLCanvasElement
             **/
            this.ctx = null;
            /**
             *
             */
            this.holder = null;
            /**
             * Specifies the area of the stage to affect when calling update. This can be use to selectively
             * re-render only active regions of the canvas. If null, the whole canvas area is affected.
             * @property drawRect
             * @type {Rectangle}
             */
            this.drawRect = null;
            /**
             * Indicates whether display objects should be rendered on whole pixels. You can set the
             * {{#crossLink "DisplayObject/snapToPixel"}}{{/crossLink}} property of
             * display objects to false to enable/disable this behaviour on a per instance basis.
             * @property snapToPixelEnabled
             * @type Boolean
             * @default false
             **/
            this.snapToPixelEnabled = false;
            this.ui = null;
            /**
             * If true, tick callbacks will be called on all display objects on the stage prior to rendering to the canvas.
             * @property tickOnUpdate
             * @type Boolean
             * @default true
             **/
            this.tickOnUpdate = true;
            /**
             * Holds objects with data for each active pointer id. Each object has the following properties:
             * x, y, event, target, overTarget, overX, overY, inBounds, posEvtObj (native event that last updated position)
             * @property _pointerData
             * @type {Object}
             * @private
             */
            this._pointerData = {};
            /**
             * Number of active pointers.
             * @property _pointerCount
             * @type {number}
             * @private
             */
            this._pointerCount = 0;
            /**
             * The ID of the primary pointer.
             * @property _primaryPointerID
             * @type {Object}
             * @private
             */
            this._primaryPointerID = null;
            /**
             * @property _mouseOverIntervalID
             * @protected
             * @type Number
             **/
            this._mouseOverIntervalID = null;
            /**
             * @property _nextStage
             * @protected
             * @type Stage
             **/
            this._nextStage = null;
            /**
             * @property _prevStage
             * @protected
             * @type Stage
             **/
            this._prevStage = null;
            /**
             * Each time the update method is called, the stage will call {{#crossLink "Stage/tick"}}{{/crossLink}}
             * unless {{#crossLink "Stage/tickOnUpdate:property"}}{{/crossLink}} is set to false,
             * and then render the display list to the canvas.
             *
             * @method update
             * @param {TimeEvent} [timeEvent=0]
             **/
            this.update = function (delta) {
                var autoClear = _this._option.autoClear;
                var autoClearColor = _this._option.autoClearColor;
                if (!_this.ctx) {
                    return;
                }
                if (_this.tickOnUpdate) {
                    // update this logic in SpriteStage when necessary
                    _this.onTick.call(_this, Math.min(delta, 100));
                }
                _this.drawstartSignal.emit();
                DisplayObject_1.default._snapToPixelEnabled = _this.snapToPixelEnabled;
                var r = _this.drawRect, ctx = _this.ctx, pixelRatio = _this._option.pixelRatio;
                /**
                 *
                 */
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
                    //this._fpsCounter.updateContext(ctx);
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
            this.setQuality(1 /* LOW */);
            this.stage = this;
            if (this._option.autoResize) {
                this.enableAutoResize();
            }
            this.onResize(size.width, size.height);
        }
        Object.defineProperty(Stage.prototype, "nextStage", {
            /**
             * Specifies a target stage that will have mouse / touch interactions relayed to it after this stage handles them.
             * This can be useful in cases where you have multiple layered canvases and want user interactions
             * events to pass through. For example, this would relay mouse events from topStage to bottomStage:
             *
             *      topStage.nextStage = bottomStage;
             *
             * To disable relaying, set nextStage to null.
             *
             * MouseOver, MouseOut, RollOver, and RollOut interactions are also passed through using the mouse over settings
             * of the top-most stage, but are only processed if the target stage has mouse over interactions enabled.
             * Considerations when using roll over in relay targets:<OL>
             * <LI> The top-most (first) stage must have mouse over interactions enabled (via enableMouseOver)</LI>
             * <LI> All stages that wish to participate in mouse over interaction must enable them via enableMouseOver</LI>
             * <LI> All relay targets will share the frequency value of the top-most stage</LI>
             * </OL>
             * To illustrate, in this example the targetStage would process mouse over interactions at 10hz (despite passing
             * 30 as it's desired frequency):
             *    topStage.nextStage = targetStage;
             *    topStage.enableMouseOver(10);
             *    targetStage.enableMouseOver(30);
             *
             * If the target stage's canvas is completely covered by this stage's canvas, you may also want to disable its
             * DOM events using:
             *
             *    targetStage.enableDOMEvents(false);
             *
             * @property nextStage
             * @type {Stage}
             **/
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
        /**
         * @method setQuality
         * @param {QualityType} value
         * @public
         */
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
        /**
         * Propagates a tick event through the display list. This is automatically called by {{#crossLink "Stage/update"}}{{/crossLink}}
         * unless {{#crossLink "Stage/tickOnUpdate:property"}}{{/crossLink}} is set to false.
         *
         * Any parameters passed to `tick()` will be included as an array in the "param" property of the event object dispatched
         * to {{#crossLink "DisplayObject/tick:event"}}{{/crossLink}} event handlers. Additionally, if the first parameter
         * is a {{#crossLink "Ticker/tick:event"}}{{/crossLink}} event object (or has equivalent properties), then the delta,
         * time, runTime, and paused properties will be copied to the event object.
         *
         * Some time-based features in EaselJS (for example {{#crossLink "Sprite/framerate"}}{{/crossLink}} require that
         * a {{#crossLink "Ticker/tick:event"}}{{/crossLink}} event object (or equivalent) be passed as the first parameter
         * to tick(). For example:
         *
         *        Ticker.on("tick", handleTick);
         *        function handleTick(evtObj) {
         * 	    	// do some work here, then update the stage, passing through the tick event object as the first param
         * 	    	// and some custom data as the second and third param:
         * 	    	myStage.update(evtObj, "hello", 2014);
         * 	    }
         *
         *        // ...
         *        myDisplayObject.on("tick", handleDisplayObjectTick);
         *        function handleDisplayObjectTick(evt) {
         * 	    	console.log(evt.params[0]); // the original tick evtObj
         * 	    	console.log(evt.delta, evt.paused); // ex. "17 false"
         * 	    	console.log(evt.params[1], evt.params[2]); // "hello 2014"
         * 	    }
         *
         * @method onTick
         * @param {*} [params]* Params to include when ticking descendants. The first param should usually be a tick event.
         **/
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
        /**
         * Clears the target canvas. Useful if {{#crossLink "Stage/autoClear:property"}}{{/crossLink}} is set to `false`.
         * @method clear
         **/
        Stage.prototype.clear = function () {
            if (!this.ctx) {
                return;
            }
            var ctx = this.ctx.canvas.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.ctx.canvas.width + 1, this.ctx.canvas.height + 1);
        };
        /**
         * Returns a data url that contains a Base64-encoded image of the contents of the stage. The returned data url can
         * be specified as the src value of an image element.
         * @method toDataURL
         * @param {String} backgroundColor The background color to be used for the generated image. The value can be any value HTML color
         * value, including HEX colors, rgb and rgba. The default value is a transparent background.
         * @param {String} mimeType The MIME type of the image format to be create. The default is "image/png". If an unknown MIME type
         * is passed in, or if the browser does not support the specified MIME type, the default value will be used.
         * @return {String} a Base64 encoded image.
         **/
        Stage.prototype.toDataURL = function (backgroundColor, mimeType) {
            if (!mimeType) {
                mimeType = "image/png";
            }
            var ctx = this.ctx;
            var w = this.ctx.canvas.width;
            var h = this.ctx.canvas.height;
            var data;
            if (backgroundColor) {
                //get the current ImageData for the canvas.
                data = ctx.getImageData(0, 0, w, h);
                //store the current globalCompositeOperation
                var compositeOperation = ctx.globalCompositeOperation;
                //set to draw behind current content
                ctx.globalCompositeOperation = "destination-over";
                //set background color
                ctx.fillStyle = backgroundColor;
                //draw background on entire canvas
                ctx.fillRect(0, 0, w, h);
            }
            //get the image data from the canvas
            var dataURL = this.ctx.canvas.toDataURL(mimeType);
            if (backgroundColor) {
                //clear the canvas
                ctx.clearRect(0, 0, w + 1, h + 1);
                //restore it with original settings
                ctx.putImageData(data, 0, 0);
                //reset the globalCompositeOperation to what it was
                ctx.globalCompositeOperation = compositeOperation;
            }
            return dataURL;
        };
        /**
         * Returns a clone of this Stage.
         * @method clone
         * @return {Stage} A clone of the current Container instance.
         **/
        Stage.prototype.clone = function () {
            var o = new Stage(null, this._option.autoResize);
            this.cloneProps(o);
            return o;
        };
        /**
         * Returns a string representation of this object.
         *
         * @method toString
         * @return {String} a string representation of the instance.
         **/
        Stage.prototype.toString = function () {
            return "[Stage (name=" + this.name + ")]";
        };
        /**
         * @method getElementRect
         * @protected
         * @param {HTMLElement} element
         **/
        Stage.prototype.getElementRect = function (element) {
            var bounds;
            //		try
            //		{
            bounds = element.getBoundingClientRect();
            //		} // this can fail on disconnected DOM elements in IE9
            //		catch(err)
            //		{
            //			bounds = {top: e.offsetTop, left: e.offsetLeft, width: e.offsetWidth, height: e.offsetHeight};
            //		}
            var offX = (window.pageXOffset || document['scrollLeft'] || 0) - (document['clientLeft'] || document.body.clientLeft || 0);
            var offY = (window.pageYOffset || document['scrollTop'] || 0) - (document['clientTop'] || document.body.clientTop || 0);
            var styles = window.getComputedStyle ? getComputedStyle(element, null) : element['currentStyle']; // IE <9 compatibility.
            var padL = parseInt(styles.paddingLeft) + parseInt(styles.borderLeftWidth);
            var padT = parseInt(styles.paddingTop) + parseInt(styles.borderTopWidth);
            var padR = parseInt(styles.paddingRight) + parseInt(styles.borderRightWidth);
            var padB = parseInt(styles.paddingBottom) + parseInt(styles.borderBottomWidth);
            // note: in some browsers bounds properties are read only.
            return {
                left: bounds.left + offX + padL,
                right: bounds.right + offX - padR,
                top: bounds.top + offY + padT,
                bottom: bounds.bottom + offY - padB
            };
        };
        /**
         * @method _handleWindowResize
         * @protected
         **/
        Stage.prototype._handleWindowResize = function (e) {
            this.onResize(this.holder.offsetWidth, this.holder.offsetHeight);
        };
        /**
         * So you can specify the fps of the animation. This operation sets
         * the fps for all createjs operations and tweenlite.
         *
         * @method setFps
         * @param value
         */
        Stage.prototype.setFps = function (value) {
            this._fps = value;
            return this;
        };
        /**
         * Return the current fps of this stage.
         *
         * @returns {number}
         */
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
        /**
         * Start the update loop.
         *
         * @method start
         * @returns {boolean}
         */
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
        /**
         * Will stop all animation and updates to the stage.
         *
         * @method stop
         * @returns {boolean}
         */
        Stage.prototype.stop = function () {
            // remove Signal connection
            if (this._ticker) {
                this._ticker.destruct();
                this._ticker = null;
            }
            this._isRunning = false;
            return this;
        };
        /**
         * Check if stage is running
         *
         * @method isRunning
         * @returns {boolean}
         */
        Stage.prototype.isRunning = function () {
            return this._isRunning;
        };
        /**
         * Is triggered when the stage (canvas) is resized.
         * Will give this new information to all children.
         *
         * @method onResize
         * @param {Size} size
         */
        Stage.prototype.onResize = function (width, height) {
            var pixelRatio = this._option.pixelRatio;
            // anti-half pixel fix
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
        // events:
        Stage.EVENT_MOUSE_LEAVE = 'mouseleave';
        Stage.EVENT_MOUSE_ENTER = 'mouseenter';
        Stage.EVENT_STAGE_MOUSE_MOVE = 'stagemousemove';
        return Stage;
    })(Container_1.default);
    exports.default = Stage;
});
