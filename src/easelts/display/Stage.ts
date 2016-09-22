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

import TouchInjectProperties from "../ui/TouchInjectProperties";

// display
import {DisplayObject} from "./DisplayObject";
import Container from "./Container";

import * as Methods from "../../easelts/util/Methods";

// interfaces
import IVector2 from "../../core/interface/IVector2";
import {IStageOption} from "../interface/IStageOption";
import IDisplayObject from "../interface/IDisplayObject";
// geom
import Rectangle from "../geom/Rectangle";
import Size from "../geom/Size";
import PointerData from "../geom/PointerData";

// enum
import QualityType from "../enum/QualityType";
import DisplayType from "../enum/DisplayType";

// event / signal
import PointerEvent from "../event/PointerEvent";
import TimeEvent from "../../core/event/TimeEvent";
import Signal1 from "../../core/event/Signal1";
import Signal from "../../core/event/Signal";
import SignalConnection from "../../core/event/SignalConnection";
import Interval from "../../core/util/Interval";
import Stats from "../component/Stats";
import {StageOption} from "../data/StageOption";
import IContext2D from "../interface/IContext2D";
import IHashMap from "../../core/interface/IHashMap";
import {CanvasBuffer} from "../renderer/buffer/CanvasBuffer";
import RendererCanvas from "../renderer/canvas/RendererCanvas";



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
 *      var stage = new Stage("canvasElementId");
 *      var image = new Bitmap("imagePath.png");
 *      stage.addChild(image);
 *      stage.start();
 *
 * @namespace easelts.display
 * @class Stage
 * @extends Container
 * @constructor
 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the Stage will render to, or the string id
 * of a canvas object in the current document.
 **/

class Stage extends Container<IDisplayObject>
{
	// events:

	public static EVENT_MOUSE_LEAVE = 'mouseleave';
	public static EVENT_MOUSE_ENTER = 'mouseenter';
	public static EVENT_STAGE_MOUSE_MOVE = 'stagemousemove';

	public tickstartSignal:Signal = new Signal();

	/**
	 * Dispatched each update immediately after the tick event is propagated through the display list. Does not fire if
	 * tickOnUpdate is false. Precedes the "drawstart" event.
	 * @event tickend
	 */
	public tickendSignal:Signal = new Signal();

	/**
	 * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it.
	 * You can call preventDefault on the event object to cancel the draw.
	 * @event drawstart
	 */
	public drawstartSignal:Signal = new Signal();

	/**
	 * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is restored.
	 * @event drawend
	 */
	public drawendSignal:Signal = new Signal();

	// public properties:
	public type:DisplayType = DisplayType.STAGE;

	protected _option:StageOption;
	protected _isRunning:boolean = false;
	protected _fps:number = 60;
	protected _fpsCounter:Stats = null;
	protected _ticker:Interval;
	protected _buffer:RendererCanvas = null;

	public _eventListeners:IHashMap<{
		window: any;
		fn: (e) => void;
	}> = null;

	public _onResizeEventListener:Function = null;

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
	public mouseX:number = 0;

	/**
	 * The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
	 * position over the canvas, and mouseInBounds will be set to false.
	 * @property mouseY
	 * @type Number
	 * @readonly
	 **/
	public mouseY:number = 0;

	private _mouseOverY:number;
	private _mouseOverX:number;
	private _mouseOverTarget:any[];

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
	constructor(element:HTMLBlockElement|HTMLDivElement|HTMLCanvasElement, option:IStageOption)
	{
		super('100%', '100%', 0, 0, 0, 0);

		this._option = new StageOption(option);

		var canvas:HTMLCanvasElement, width:number, height:number;

		if(element.tagName == 'CANVAS')
		{
			canvas = <HTMLCanvasElement> element;
			this.holder = <HTMLBlockElement> element.parentElement;
			if(this._option.autoResize){
				width = this.holder.offsetWidth;
				height = this.holder.offsetHeight;
			} else {
				width = canvas.width;
				height = canvas.height;
			}
		} else {
			canvas = document.createElement('canvas');
			this.holder = <HTMLBlockElement> element;

			width = this.holder.offsetWidth;
			height = this.holder.offsetHeight;
		}

		this.setBuffer(new RendererCanvas(width, height, {
			domElement:canvas,
			transparent:this._option.transparent
		}), this._option.autoResize );

		if(element.tagName != 'CANVAS')
		{
			this.holder.appendChild(canvas);
		}

		this.enableDOMEvents(true);
		this.setFps(this._fps);

		this.stage = this;

		if( this._option.autoResize ){
			this.enableAutoResize();
		}

		this.onResize(this._buffer.width, this._buffer.height);
	}


	/**
	 * @method setQuality
	 * @param {QualityType} value
	 * @public
	 */
	public setQuality(value:string):Stage
	{
		this._buffer.setQuality(value);
		return this;
	}

	public setFpsCounter(value:boolean):Stage
	{
		if(value){
			this._fpsCounter = new Stats;
		} else {
			this._fpsCounter = null;
		}

		return this;
	}

	/**
	 * Each time the update method is called, the stage will call {{#crossLink "Stage/tick"}}{{/crossLink}}
	 * unless {{#crossLink "Stage/tickOnUpdate:property"}}{{/crossLink}} is set to false,
	 * and then render the display list to the canvas.
	 *
	 * @method update
	 * @param {TimeEvent} [timeEvent=0]
	 **/
	public update(delta:number):void
	{
		var autoClear = this._option.autoClear;
		var autoClearColor = this._option.autoClearColor;
		var ctx = this.getContext();
		var r = this.drawRect,
			pixelRatio = this._option.pixelRatio;

		if(this.tickOnUpdate)
		{
			// update this logic in SpriteStage when necessary
			this.onTick.call(this, Math.min(delta, 100));
		}

		this.drawstartSignal.emit();

		DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;


		/**
		 *
		 */
		ctx.setTransform(this._option.pixelRatio, 0, 0, this._option.pixelRatio, 0, 0 ); 

		if(autoClear)
		{
			if(autoClearColor)
			{
				ctx.fillStyle = autoClearColor;
				ctx.fillRect(0,0,ctx.canvas.width + 1, ctx.canvas.height + 1);
			}

			if(r)
			{
				ctx.clearRect(r.x, r.y, r.width, r.height);
			}
			else
			{
				ctx.clearRect(0, 0, ctx.canvas.width + 1, ctx.canvas.height + 1);
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

		if(this._fpsCounter)
		{
			this._fpsCounter.update();

			ctx.save();
			//this._fpsCounter.updateContext(ctx);
			this._fpsCounter.draw(ctx, false);
			ctx.restore();
		}

		this.drawendSignal.emit();
	}



	/**
	 * Clears the target canvas. Useful if {{#crossLink "Stage/autoClear:property"}}{{/crossLink}} is set to `false`.
	 * @method clear
	 **/
	public clear():void
	{
		this._buffer.clear();
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
		return this._buffer.toDataURL(backgroundColor, mimeType);
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

		this.setMouseInteraction(true);

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
		var canvas = this._buffer.domElement;

		if(!enable && eventListeners)
		{
			for(name in eventListeners)
			{
				o = eventListeners[name];
				o.window.removeEventListener(name, o.fn, false);
			}
			this._eventListeners = null;
		}
		else if(enable && !eventListeners && canvas)
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
				window: canvas,
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

	public getContext():CanvasRenderingContext2D
	{
		return this._buffer.getContext();
	}

	/**
	 * Returns a clone of this Stage.
	 * @method clone
	 * @return {Stage} A clone of the current Container instance.
	 **/
	public clone():Stage
	{
		var o = new Stage(null, this._option.autoResize);
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

	/**
	 * @method _getElementRect
	 * @protected
	 * @param {HTMLElement} element
	 **/
	protected _getElementRect(element:HTMLElement)
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

		e.pageX *= this._option.pixelRatio;
		e.pageY *= this._option.pixelRatio;

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
		//
		//// redundant listener.
		//if(!this.ctx)
		//{
		//	return;
		//}

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
		var buffer = this._buffer;

		var rect = this._getElementRect(buffer.domElement);
		pageX -= rect.left;
		pageY -= rect.top;

		var w = buffer.width;
		var h = buffer.height;
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
		e.pageX *= this._option.pixelRatio;
		e.pageY *= this._option.pixelRatio;

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


		var isEventTarget = eventTarget || e && (e.target == this._buffer.domElement);
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

		this._buffer.domElement.style.cursor = cursor;
		if(!owner && eventTarget)
		{
			eventTarget.getContext().canvas.style.cursor = cursor;
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
	public setFps(value:number):Stage
	{
		this._fps = value;
		return this;
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

	public setMouseInteraction(value:boolean):void
	{
		this.enableDOMEvents(value);

		super.setMouseInteraction(value);
	}

	/**
	 * Start the update loop.
	 *
	 * @method start
	 * @returns {boolean}
	 */
	public start():Stage
	{
		if(this._ticker)
		{
			this._ticker.destruct();
			this._ticker = null;
		}

		this._ticker = new Interval(this.getFps())
				.attach(this.update.bind(this));

		this._isRunning = true;

		return this;
	}

	/**
	 * Will stop all animation and updates to the stage.
	 *
	 * @method stop
	 * @returns {boolean}
	 */
	public stop():Stage
	{
		// remove Signal connection
		if(this._ticker)
		{
			this._ticker.destruct();
			this._ticker = null;
		}

		this._isRunning = false;

		return this;
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
		var pixelRatio = this._option.pixelRatio;
		// anti-half pixel fix
		width = width + 1 >> 1 << 1;
		height = height + 1 >> 1 << 1;

		if(this.width != width || this.height != height)
		{
			this._buffer.width = width * pixelRatio;
			this._buffer.height = height * pixelRatio;

			this._buffer.domElement.style.width = '' + width + 'px';
			this._buffer.domElement.style.height = '' + height + 'px';

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

export default Stage;
