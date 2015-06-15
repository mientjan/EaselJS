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

import Ticker = require('../../createts/util/Ticker');
import TouchInjectProperties = require('../ui/TouchInjectProperties');

// display
import DisplayObject = require('./DisplayObject');
import Container = require('./Container');

import Methods = require('../../easelts/util/Methods');

// interfaces
import IVector2 = require('../interface/IVector2');

// geom
import Rectangle = require('../geom/Rectangle');
import Size = require('../geom/Size');
import PointerData = require('../geom/PointerData');

// enum
import QualityType = require('../enum/QualityType');
import DisplayType = require('../enum/DisplayType');

// event / signal
import PointerEvent = require('../event/PointerEvent');
import TimeEvent = require('../../createts/event/TimeEvent');
import Signal1 = require('../../createts/event/Signal1');
import Signal = require('../../createts/event/Signal');
import SignalConnection = require('../../createts/event/SignalConnection');

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

class Stage extends Container
{
	// events:

	public static EVENT_MOUSE_LEAVE = 'mouseleave';
	public static EVENT_MOUSE_ENTER = 'mouseenter';
	public static EVENT_STAGE_MOUSE_MOVE = 'stagemousemove';


	/**
	 * Dispatched when the user moves the mouse over the canvas.
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event stagemousemove
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the user presses their left mouse button on the canvas. See the {{#crossLink "MouseEvent"}}{{/crossLink}}
	 * class for a listing of event properties.
	 * @event stagemousedown
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the user the user releases the mouse button anywhere that the page can detect it (this varies slightly between browsers).
	 * You can use {{#crossLink "Stage/mouseInBounds:property"}}{{/crossLink}} to check whether the mouse is currently within the stage bounds.
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event stagemouseup
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the mouse moves from within the canvas area (mouseInBounds == true) to outside it (mouseInBounds == false).
	 * This is currently only dispatched for mouse input (not touch). See the {{#crossLink "MouseEvent"}}{{/crossLink}}
	 * class for a listing of event properties.
	 * @event mouseleave
	 * @since 0.7.0
	 */

	/**
	 * Dispatched when the mouse moves into the canvas area (mouseInBounds == false) from outside it (mouseInBounds == true).
	 * This is currently only dispatched for mouse input (not touch). See the {{#crossLink "MouseEvent"}}{{/crossLink}}
	 * class for a listing of event properties.
	 * @event mouseenter
	 * @since 0.7.0
	 */

	/**
	 * Dispatched each update immediately before the tick event is propagated through the display list.
	 * You can call preventDefault on the event object to cancel propagating the tick event.
	 * @event tickstart
	 * @since 0.7.0
	 */
//	protected _ticker:Ticker = new Ticker();

	public tickstartSignal:Signal = new Signal();

	/**
	 * Dispatched each update immediately after the tick event is propagated through the display list. Does not fire if
	 * tickOnUpdate is false. Precedes the "drawstart" event.
	 * @event tickend
	 * @since 0.7.0
	 */
	public tickendSignal:Signal = new Signal();

	/**
	 * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it.
	 * You can call preventDefault on the event object to cancel the draw.
	 * @event drawstart
	 * @since 0.7.0
	 */
	public drawstartSignal:Signal = new Signal();

	/**
	 * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is restored.
	 * @event drawend
	 * @since 0.7.0
	 */
	public drawendSignal:Signal = new Signal();

	// public properties:
	public type:DisplayType = DisplayType.STAGE;

	public _isRunning:boolean = false;
	public _tickSignalConnection:SignalConnection = null;
	public _fps:number = 60;

	public _eventListeners:{
		[name:string]: {
			window: any;
			fn: (e) => void;
		}
	} = null;

	public _onResizeEventListener:Function = null;

	/**
	 * Indicates whether the stage should automatically clear the canvas before each render. You can set this to <code>false</code>
	 * to manually control clearing (for generative art, or when pointing multiple stages at the same canvas for
	 * example).
	 *
	 * <h4>Example</h4>
	 *
	 *      var stage = new Stage("canvasId");
	 *      stage.autoClear = false;
	 *
	 * @property autoClear
	 * @type Boolean
	 * @default true
	 **/
	public autoClear = true;

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
	public canvas:HTMLCanvasElement = null;
	public ctx:CanvasRenderingContext2D = null;

	/**
	 *
	 */
	public holder:HTMLBlockElement = null;

	/**
	 * The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
	 * position over the canvas, and mouseInBounds will be set to false.
	 * @property mouseX
	 * @type Number
	 * @readonly
	 **/
	public mouseX = 0;

	/**
	 * The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
	 * position over the canvas, and mouseInBounds will be set to false.
	 * @property mouseY
	 * @type Number
	 * @readonly
	 **/
	public mouseY = 0;

	private _mouseOverY:number;
	private _mouseOverX:number;
	private _mouseOverTarget:any[];

	/**
	 * Indicates whether onResize should be called when the window is resized.
	 * @property triggerResizeOnWindowResize
	 * @type {boolean}
	 * @default false
	 */
	public triggerResizeOnWindowResize:boolean = false;

	/**
	 * Specifies the area of the stage to affect when calling update. This can be use to selectively
	 * re-render only active regions of the canvas. If null, the whole canvas area is affected.
	 * @property drawRect
	 * @type {Rectangle}
	 */
	public drawRect:Rectangle = null;

	/**
	 * Indicates whether display objects should be rendered on whole pixels. You can set the
	 * {{#crossLink "DisplayObject/snapToPixel"}}{{/crossLink}} property of
	 * display objects to false to enable/disable this behaviour on a per instance basis.
	 * @property snapToPixelEnabled
	 * @type Boolean
	 * @default false
	 **/
	public snapToPixelEnabled = false;

	/**
	 * Indicates whether the mouse is currently within the bounds of the canvas.
	 * @property mouseInBounds
	 * @type Boolean
	 * @default false
	 **/
	public mouseInBounds = false;

	/**
	 * If true, tick callbacks will be called on all display objects on the stage prior to rendering to the canvas.
	 * @property tickOnUpdate
	 * @type Boolean
	 * @default true
	 **/
	public tickOnUpdate = true;

	/**
	 * If true, mouse move events will continue to be called when the mouse leaves the target canvas. See
	 * {{#crossLink "Stage/mouseInBounds:property"}}{{/crossLink}}, and {{#crossLink "MouseEvent"}}{{/crossLink}}
	 * x/y/rawX/rawY.
	 * @property mouseMoveOutside
	 * @type Boolean
	 * @default false
	 **/
	public mouseMoveOutside = false;

	/**
	 * The hitArea property is not supported for Stage.
	 * @property hitArea
	 * @type {DisplayObject}
	 * @default null
	 */

	public __touch:TouchInjectProperties;

	// getter / setters:
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
	public get nextStage()
	{
		return this._nextStage;
	}

	public set nextStage(value:Stage)
	{
		if(this._nextStage)
		{
			this._nextStage._prevStage = null;
		}
		if(value)
		{
			value._prevStage = this;
		}
		this._nextStage = value;
	}

	/**
	 * Holds objects with data for each active pointer id. Each object has the following properties:
	 * x, y, event, target, overTarget, overX, overY, inBounds, posEvtObj (native event that last updated position)
	 * @property _pointerData
	 * @type {Object}
	 * @private
	 */
	public _pointerData:any = {};

	/**
	 * Number of active pointers.
	 * @property _pointerCount
	 * @type {number}
	 * @private
	 */
	public _pointerCount:number = 0;

	/**
	 * The ID of the primary pointer.
	 * @property _primaryPointerID
	 * @type {Object}
	 * @private
	 */
	public _primaryPointerID = null;

	/**
	 * @property _mouseOverIntervalID
	 * @protected
	 * @type Number
	 **/
	public _mouseOverIntervalID = null;

	/**
	 * @property _nextStage
	 * @protected
	 * @type Stage
	 **/
	public _nextStage:Stage = null;

	/**
	 * @property _prevStage
	 * @protected
	 * @type Stage
	 **/
	public _prevStage = null;

	/**
	 * @class Stage
	 * @constructor
	 * @param {HTMLCanvasElement|HTMLBlockElement} element A canvas or div element. If it's a div element, a canvas object will be created and appended to the div.
	 * @param {boolean} [triggerResizeOnWindowResize=false] Indicates whether onResize should be called when the window is resized
	 **/

	constructor(element:HTMLBlockElement|HTMLDivElement|HTMLCanvasElement, triggerResizeOnWindowResize:any = false)
	{
		super('100%', '100%', 0, 0, 0, 0);

		this.triggerResizeOnWindowResize = triggerResizeOnWindowResize;
		var size:Size;

		switch(element.tagName)
		{
			case 'CANVAS':
			{
				this.canvas = <HTMLCanvasElement> element;
				this.holder = <HTMLBlockElement> element.parentElement;

				size = new Size(this.canvas.width, this.canvas.height);
				break;
			}

			default:
			{
				var canvas = document.createElement('canvas');

				this.canvas = <HTMLCanvasElement> canvas;
				this.holder = <HTMLBlockElement> element;
				this.holder.appendChild(canvas);

				size = new Size(this.holder.offsetWidth, this.holder.offsetHeight);
				break;
			}
		}

		this.enableDOMEvents(true);
		this.setFps(this._fps);
		this.ctx = this.canvas.getContext('2d');
		this.setQuality(QualityType.LOW);
		this.stage = this;

		if( triggerResizeOnWindowResize ){
			this.enableAutoResize();
		}

		this.onResize(size.width, size.height);
	}


	/**
	 * @method setQuality
	 * @param {QualityType} value
	 * @public
	 */
	public setQuality(value:QualityType):void
	{

		switch(value)
		{
			case QualityType.LOW:
			{
				this.ctx['mozImageSmoothingEnabled'] = false;
				this.ctx['webkitImageSmoothingEnabled'] = false;
				this.ctx['msImageSmoothingEnabled'] = false;
				this.ctx['imageSmoothingEnabled'] = false;
				break;
			}

			case QualityType.NORMAL:
			{
				this.ctx['mozImageSmoothingEnabled'] = true;
				this.ctx['webkitImageSmoothingEnabled'] = true;
				this.ctx['msImageSmoothingEnabled'] = true;
				this.ctx['imageSmoothingEnabled'] = true;
				break;
			}
		}
	}

	/**
	 * Each time the update method is called, the stage will call {{#crossLink "Stage/tick"}}{{/crossLink}}
	 * unless {{#crossLink "Stage/tickOnUpdate:property"}}{{/crossLink}} is set to false,
	 * and then render the display list to the canvas.
	 *
	 * @method update
	 * @param {TimeEvent} [timeEvent=0]
	 **/
	public update = (delta:number):void =>
	{
		if(!this.canvas)
		{
			return;
		}

		if(this.tickOnUpdate)
		{
			// update this logic in SpriteStage when necessary
			this.onTick.call(this, delta);
		}

		this.drawstartSignal.emit();

		DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;

		var r = this.drawRect,
			ctx = this.ctx;


		/**
		 *
		 */
		ctx.setTransform(
			1, 0, 0,
			1, 0.5, 0.5
		);
		//ctx.translate(0.5, 0.5);

		if(this.autoClear)
		{
			if(r)
			{
				ctx.clearRect(r.x, r.y, r.width, r.height);
			}
			else
			{
				ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
			}
		}

		ctx.save();
		if(this.drawRect)
		{
			ctx.beginPath();
			ctx.rect(r.x, r.y, r.width, r.height);
			ctx.clip();
		}

		this.updateContext(ctx);
		this.draw(ctx, false);
		ctx.restore();

		this.drawendSignal.emit();
	}

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
	public tick(delta:number):void
	{
		if(!this.tickEnabled)
		{
			return;
		}

		this.tickstartSignal.emit();
		this.onTick(delta);
		this.tickendSignal.emit();
	}

	/**
	 * Clears the target canvas. Useful if {{#crossLink "Stage/autoClear:property"}}{{/crossLink}} is set to `false`.
	 * @method clear
	 **/
	public clear():void
	{
		if(!this.canvas)
		{
			return;
		}
		var ctx = this.canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
	}

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
	public toDataURL(backgroundColor:string, mimeType:string):string
	{
		if(!mimeType)
		{
			mimeType = "image/png";
		}

		var ctx = this.canvas.getContext('2d');
		var w = this.canvas.width;
		var h = this.canvas.height;

		var data;

		if(backgroundColor)
		{

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
		var dataURL = this.canvas.toDataURL(mimeType);

		if(backgroundColor)
		{
			//clear the canvas
			ctx.clearRect(0, 0, w + 1, h + 1);

			//restore it with original settings
			ctx.putImageData(data, 0, 0);

			//reset the globalCompositeOperation to what it was
			ctx.globalCompositeOperation = compositeOperation;
		}

		return dataURL;
	}

	/**
	 * <h4>Example</h4>
	 *
	 *      var stage = new Stage("canvasId");
	 *      stage.enableMouseOver(10); // 10 updates per second
	 *
	 * @method enableMouseOver
	 * @param {Number} [frequency=20] Optional param specifying the maximum number of times per second to broadcast
	 * mouse over/out events. Set to 0 to disable mouse over events completely. Maximum is 50. A lower frequency is less
	 * responsive, but uses less CPU.
	 * @todo remove setInterval
	 **/
	public enableMouseOver(frequency:number = null):void
	{
		if(this._mouseOverIntervalID)
		{
			clearInterval(this._mouseOverIntervalID);
			this._mouseOverIntervalID = null;
			if(frequency == 0)
			{
				this._testMouseOver(true);
			}
		}
		if(frequency == null)
		{
			frequency = 20;
		}
		else if(frequency <= 0)
		{
			return void 0;
		}
		this.enableMouseInteraction();


		this._mouseOverIntervalID = setInterval(() =>
		{
			this._testMouseOver();
		}, 1000 / Math.min(50, frequency));


	}

	/**
	 * Enables or disables the event listeners that stage adds to DOM elements (window, document and canvas). It is good
	 * practice to disable events when disposing of a Stage instance, otherwise the stage will continue to receive
	 * events from the page.
	 *
	 * When changing the canvas property you must disable the events on the old canvas, and enable events on the
	 * new canvas or mouse events will not work as expected. For example:
	 *
	 *      myStage.enableDOMEvents(false);
	 *      myStage.canvas = anotherCanvas;
	 *      myStage.enableDOMEvents(true);
	 *
	 * @method enableDOMEvents
	 * @param {Boolean} [enable=true] Indicates whether to enable or disable the events. Default is true.
	 **/
	public enableDOMEvents(enable:boolean = true):void
	{
		var name, o, eventListeners = this._eventListeners;
		if(!enable && eventListeners)
		{
			for(name in eventListeners)
			{
				o = eventListeners[name];
				o.window.removeEventListener(name, o.fn, false);
			}
			this._eventListeners = null;
		}
		else if(enable && !eventListeners && this.canvas)
		{
			var windowsObject = window['addEventListener'] ? <any> window : <any> document;
			eventListeners = this._eventListeners = {};

			//			Stage.EVENT_MOUSE
			eventListeners["mouseup"] = {
				window: windowsObject,
				fn: e => this._handleMouseUp(e)
			};

			eventListeners["mousemove"] = {
				window: windowsObject,
				fn: e => this._handleMouseMove(e)
			};

			eventListeners["mousedown"] = {
				window: this.canvas,
				fn: e => this._handleMouseDown(e)
			};

			//			eventListeners["dblclick"] = {
			//				window: this.canvas,
			//				fn: (e) =>
			//				{
			//					this._handleDoubleClick(e)
			//				}
			//			};


			for(name in eventListeners)
			{
				o = eventListeners[name];
				o.window.addEventListener(name, o.fn, false);
			}
		}
	}

	/**
	 * Returns a clone of this Stage.
	 * @method clone
	 * @return {Stage} A clone of the current Container instance.
	 **/
	public clone():Stage
	{
		var o = new Stage(null, this.triggerResizeOnWindowResize);
		this.cloneProps(o);
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 *
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	public toString():string
	{
		return "[Stage (name=" + this.name + ")]";
	}

	public tryCatch

	/**
	 * @method _getElementRect
	 * @protected
	 * @param {HTMLElement} element
	 **/
	public _getElementRect(element:HTMLElement)
	{
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

		var styles = window.getComputedStyle ? getComputedStyle(element, null) : element.currentStyle; // IE <9 compatibility.
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
		}
	}

	/**
	 * @method _getPointerData
	 * @protected
	 * @param {Number} id
	 **/
	public _getPointerData(id):PointerData
	{
		var data = this._pointerData[id];
		if(!data)
		{
			data = this._pointerData[id] = new PointerData(0, 0);

			// if it's the first new touch, then make it the primary pointer id:
			if(this._primaryPointerID == null)
			{
				this._primaryPointerID = id;
			}

			// if it's the mouse (id == -1) or the first new touch, then make it the primary pointer id:
			if(this._primaryPointerID == null || this._primaryPointerID == -1)
			{
				this._primaryPointerID = id;
			}
		}
		return data;
	}

	/**
	 * @method _handleMouseMove
	 * @protected
	 * @param {MouseEvent} e
	 **/
	public _handleMouseMove(e:MouseEvent = <any> window['event'])
	{
		//		if(!e){
		//			var b = <MouseEvent> window['event'];
		//		 }

		this._handlePointerMove(-1, e, e.pageX, e.pageY);
	}

	/**
	 * @method _handlePointerMove
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 **/
	public _handlePointerMove(id:number, e:MouseEvent, pageX:number, pageY:number, owner?:Stage)
	{
		if(this._prevStage && owner === undefined)
		{
			return;
		}

		// redundant listener.
		if(!this.canvas)
		{
			return;
		}


		var nextStage = this._nextStage;
		var pointerData = this._getPointerData(id);

		var inBounds = pointerData.inBounds;
		this._updatePointerPosition(id, e, pageX, pageY
		);
		if(inBounds || pointerData.inBounds || this.mouseMoveOutside)
		{
			if(id == -1 && pointerData.inBounds == !inBounds)
			{
				this._dispatchMouseEvent(this, (inBounds ? "mouseleave" : "mouseenter"), false, id, pointerData, e);
			}

			this._dispatchMouseEvent(this, "stagemousemove", false, id, pointerData, e);
			this._dispatchMouseEvent(pointerData.target, "pressmove", true, id, pointerData, e);
		}

		nextStage && nextStage._handlePointerMove(id, e, pageX, pageY, null);
	}

	/**
	 * @method _updatePointerPosition
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 **/
	public _updatePointerPosition(id:number, e:MouseEvent, pageX:number, pageY:number)
	{
		var rect = this._getElementRect(this.canvas);
		pageX -= rect.left;
		pageY -= rect.top;

		var w = this.canvas.width;
		var h = this.canvas.height;
		pageX /= (rect.right - rect.left) / w;
		pageY /= (rect.bottom - rect.top) / h;
		var pointerData = this._getPointerData(id);
		if(pointerData.inBounds = (pageX >= 0 && pageY >= 0 && pageX <= w - 1 && pageY <= h - 1))
		{
			pointerData.x = pageX;
			pointerData.y = pageY;
		}
		else if(this.mouseMoveOutside)
		{
			pointerData.x = pageX < 0 ? 0 : (pageX > w - 1 ? w - 1 : pageX);
			pointerData.y = pageY < 0 ? 0 : (pageY > h - 1 ? h - 1 : pageY);
		}

		pointerData.posEvtObj = e;
		pointerData.rawX = pageX;
		pointerData.rawY = pageY;

		if(id == this._primaryPointerID)
		{
			this.mouseX = pointerData.x;
			this.mouseY = pointerData.y;
			this.mouseInBounds = pointerData.inBounds;
		}
	}

	/**
	 * @method _handleMouseUp
	 * @protected
	 * @param {MouseEvent} e
	 **/
	public _handleMouseUp(e):void
	{
		this._handlePointerUp(-1, e, false);
	}

	/**
	 * @method _handlePointerUp
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Boolean} clear
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 **/
	public _handlePointerUp(id, e, clear, owner?:Stage):void
	{
		var nextStage = this._nextStage, o = this._getPointerData(id);
		if(this._prevStage && owner === undefined)
		{
			return;
		} // redundant listener.

		this._dispatchMouseEvent(this, "stagemouseup", false, id, o, e);

		var target = null, oTarget = o.target;
		if(!owner && (oTarget || nextStage))
		{
			target = this._getObjectsUnderPoint(o.x, o.y, null, true);
		}
		if(target == oTarget)
		{
			this._dispatchMouseEvent(oTarget, "click", true, id, o, e);
		}
		this._dispatchMouseEvent(oTarget, "pressup", true, id, o, e);

		if(clear)
		{
			if(id == this._primaryPointerID)
			{
				this._primaryPointerID = null;
			}
			delete(this._pointerData[id]);
		}
		else
		{
			o.target = null;
		}

		nextStage && nextStage._handlePointerUp(id, e, clear, owner || target && this);
	}

	/**
	 * @method _handleMouseDown
	 * @protected
	 * @param {MouseEvent} e
	 **/
	public _handleMouseDown(e):void
	{
		this._handlePointerDown(-1, e, e.pageX, e.pageY);
	}

	/**
	 * @method _handlePointerDown
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 **/
	public _handlePointerDown(id, e, pageX, pageY, owner?:Stage):void
	{
		if(pageY != null)
		{
			this._updatePointerPosition(id, e, pageX, pageY);
		}

		var target = null;
		var nextStage = this._nextStage;
		var pointerData = this._getPointerData(id);


		if(pointerData.inBounds)
		{
			this._dispatchMouseEvent(this, "stagemousedown", false, id, pointerData, e);
		}

		if(!owner)
		{
			target = pointerData.target = this._getObjectsUnderPoint(pointerData.x, pointerData.y, null, true);

			this._dispatchMouseEvent(pointerData.target, "mousedown", true, id, pointerData, e);
		}

		nextStage && nextStage._handlePointerDown(id, e, pageX, pageY, owner || target && this);
	}

	/**
	 * @method _testMouseOver
	 * @param {Boolean} clear If true, clears the mouseover / rollover (ie. no target)
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 * @param {Stage} eventTarget The stage that the cursor is actively over.
	 * @protected
	 **/
	public _testMouseOver(clear?:boolean, owner?:Stage, eventTarget?:Stage)
	{
		if(this._prevStage && owner === undefined)
		{
			return;
		} // redundant listener.

		var nextStage = this._nextStage;
		if(!this._mouseOverIntervalID)
		{
			// not enabled for mouseover, but should still relay the event.
			nextStage && nextStage._testMouseOver(clear, owner, eventTarget);
			return;
		}


		// only update if the mouse position has changed. This provides a lot of optimization, but has some trade-offs.
		if(this._primaryPointerID != -1 || (!clear && this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds))
		{
			return;
		}


		var o = this._getPointerData(-1), e = o.posEvtObj;


		var isEventTarget = eventTarget || e && (e.target == this.canvas);
		var target = null, common = -1, cursor = "", t, i, l;

		if(!owner && (clear || this.mouseInBounds && isEventTarget))
		{
			target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
			this._mouseOverX = this.mouseX;
			this._mouseOverY = this.mouseY;
		}


		var oldList = this._mouseOverTarget || [];
		var oldTarget = oldList[oldList.length - 1];
		var list = this._mouseOverTarget = [];

		// generate ancestor list and check for cursor:
		t = target;
		while(t)
		{
			list.unshift(t);
			if(t.cursor != null)
			{
				cursor = t.cursor;
			}
			t = t.parent;
		}
		this.canvas.style.cursor = cursor;
		if(!owner && eventTarget)
		{
			eventTarget.canvas.style.cursor = cursor;
		}

		// find common ancestor:
		for(i = 0, l = list.length; i < l; i++)
		{
			if(list[i] != oldList[i])
			{
				break;
			}
			common = i;
		}

		if(oldTarget != target)
		{
			this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e);
		}

		for(i = oldList.length - 1; i > common; i--)
		{
			this._dispatchMouseEvent(oldList[i], "rollout", false, -1, o, e);
		}

		for(i = list.length - 1; i > common; i--)
		{
			this._dispatchMouseEvent(list[i], "rollover", false, -1, o, e);
		}

		if(oldTarget != target)
		{
			this._dispatchMouseEvent(target, "mouseover", true, -1, o, e);
		}

		nextStage && nextStage._testMouseOver(clear, owner || target && this, eventTarget || isEventTarget && this);
	}

	/**
	 * @method _handleDoubleClick
	 * @protected
	 * @param {MouseEvent} e
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 **/
	public _handleDoubleClick(e:MouseEvent, owner?:Stage)
	{
		var target = null, nextStage = this._nextStage, o = this._getPointerData(-1);
		if(!owner)
		{
			target = this._getObjectsUnderPoint(o.x, o.y, null, true);
			this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
		}
		nextStage && nextStage._handleDoubleClick(e, owner || target && this);
	}

	/**
	 * @method _handleWindowResize
	 * @protected
	 **/
	public _handleWindowResize(e)
	{
		this.onResize(this.holder.offsetWidth, this.holder.offsetHeight);
	}

	/**
	 *
	 * @todo what is the o param
	 *
	 * @method _dispatchMouseEvent
	 * @protected
	 * @param {DisplayObject} target
	 * @param {String} type
	 * @param {Boolean} bubbles
	 * @param {Number} pointerId
	 * @param {Object} o
	 * @param {MouseEvent} [nativeEvent]
	 **/
	public _dispatchMouseEvent(target:DisplayObject, type:string, bubbles:boolean, pointerId:number, o:any, nativeEvent:MouseEvent)
	{

		// TODO: might be worth either reusing MouseEvent instances, or adding a willTrigger method to avoid GC.
		if(!target || (!bubbles && !target.hasEventListener(type)))
		{
			return;
		}


		/*
		 // TODO: account for stage transformations:
		 this._mtx = this.getConcatenatedMatrix(this._mtx).invert();
		 var pt = this._mtx.transformPoint(o.x, o.y);
		 var evt = new createts.MouseEvent(type, bubbles, false, pt.x, pt.y, nativeEvent, pointerId, pointerId==this._primaryPointerID, o.rawX, o.rawY);
		 */
		var evt = new PointerEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId == this._primaryPointerID, o.rawX, o.rawY);
		target.dispatchEvent(evt);
	}


	/**
	 * So you can specify the fps of the animation. This operation sets
	 * the fps for all createjs operations and tweenlite.
	 *
	 * @method setFps
	 * @param value
	 */
	public setFps(value:number):void
	{
		this._fps = value;
		Ticker.getInstance().setFPS(value);
	}

	/**
	 * Return the current fps of this stage.
	 *
	 * @returns {number}
	 */
	public getFps():number
	{
		return this._fps;
	}

	public enableAutoResize()
	{
		this._onResizeEventListener = (e) => this._handleWindowResize(e)
		window.addEventListener('resize', <any> this._onResizeEventListener);
	}

	public disableAutoResize()
	{
		window.removeEventListener('resize', <any> this._onResizeEventListener);
	}

	/**
	 * Start the update loop.
	 *
	 * @method start
	 * @returns {boolean}
	 */
	public start():boolean
	{
		if(!this._isRunning)
		{
			this.update(0);
			this._tickSignalConnection = Ticker.getInstance().addTickListener(<any> this.update);
			Ticker.getInstance().start();

			this._isRunning = true;
			return true;
		}

		return false;
	}

	/**
	 * Will stop all animation and updates to the stage.
	 *
	 * @method stop
	 * @returns {boolean}
	 */
	public stop():boolean
	{
		if(this._isRunning)
		{
			// remove Signal connection
			this._tickSignalConnection.dispose();
			this._tickSignalConnection = null;

			// update stage for a last tick, solves rendering
			// issues when having slowdown. Last frame is sometimes not rendered. When using createjsAnimations
			setTimeout(this.update, 1000 / this._fps);

			this._isRunning = false;
			return true;
		}

		return false;
	}

	/**
	 * Check if stage is running
	 *
	 * @method isRunning
	 * @returns {boolean}
	 */
	public isRunning():boolean
	{
		return this._isRunning;
	}

	/**
	 * Is triggered when the stage (canvas) is resized.
	 * Will give this new information to all children.
	 *
	 * @method onResize
	 * @param {Size} size
	 */
	public onResize(width:number, height:number):void
	{
		// anti-half pixel fix
		width = width + 1 >> 1 << 1;
		height = height + 1 >> 1 << 1;

		if(this.width != width || this.height != height)
		{
			this.canvas.width = width;
			this.canvas.height = height;

			super.onResize(width, height);

			if(!this._isRunning)
			{
				this.update(0);
			}
		}
	}

	public destruct():void
	{
		this.stop();
		this.enableDOMEvents(false);

		super.destruct();
	}
}

export = Stage;
