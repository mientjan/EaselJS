import Stage from "../display/Stage";
import IHashMap from "../interface/IHashMap";
import Interval from "../../createts/util/Interval";
import PointerData from "../geom/PointerData";
import DisplayObject from "../display/DisplayObject";

class UIDefault
{
	private _stage:Stage;
	private _eventListeners:IHashMap<{window:any, fn: Function}> = {};
	private _mouseoverInterval:Interval = null;
	private _pointerData:IHashMap<PointerData> = {};
	private _primaryPointerID:number = 0;
	private mouseMoveOutside:boolean = false;
	private mouseInBounds:boolean = false;
	private _mouseOverX:number = 0;
	private _mouseOverY:number = 0;
	private mouseX:number = 0;
	private mouseY:number = 0;

	constructor(stage:Stage)
	{
		this._stage = stage;

		this.setDOMEvents(true);
	}

	/**
	 * <h4>Example</h4>
	 *
	 *      var stage = new Stage(element);
	 *      stage.setUI( new UIDefault().enableMouseOver(20) );
	 *
	 * @method enableMouseOver
	 * @param {Number} [frequency=20] Optional param specifying the maximum number of times per second to broadcast
	 * mouse over/out events. Set to 0 to disable mouse over events completely. Maximum is 50. A lower frequency is less
	 * responsive, but uses less CPU.
	 * @todo remove setInterval
	 **/
	public enableMouseOver(frequency:number = 20):UIDefault
	{
		if(this._mouseoverInterval)
		{
			this._mouseoverInterval.destruct();
		}

		this._mouseoverInterval = new Interval(frequency);
		this._mouseoverInterval.attach(this._testMouseOver.bind(this));
		return this;
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
	public setDOMEvents(enable:boolean = true):void
	{
		var element = this._stage.ctx.canvas;
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
		else if(enable && !eventListeners && element)
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
				window: this._stage.ctx.canvas,
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
	public _getPointerData(id:number):PointerData
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

			this._dispatchMouseEvent(this._stage, "stagemousemove", false, id, pointerData, e);
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
		var rect = this._getElementRect(this.ctx.canvas);
		pageX -= rect.left;
		pageY -= rect.top;

		var w = this.ctx.canvas.width;
		var h = this.ctx.canvas.height;
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
	protected _handleMouseDown(e):void
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
	protected _handlePointerDown(id, e, pageX, pageY, owner?:Stage):void
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
	protected _testMouseOver(clear?:boolean, owner?:Stage, eventTarget?:Stage)
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


		var isEventTarget = eventTarget || e && (e.target == this.ctx.canvas);
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
		this._stage.ctx.canvas.style.cursor = cursor;

		//if(!owner && eventTarget)
		//{
		//	eventTarget.ctx.canvas.style.cursor = cursor;
		//}

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
	//protected _handleDoubleClick(e:MouseEvent, owner?:Stage)
	//{
	//	var target = null, o = this._getPointerData(-1);
	//	if(!owner)
	//	{
	//		target = this._getObjectsUnderPoint(o.x, o.y, null, true);
	//		this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
	//	}
	//	nextStage && nextStage._handleDoubleClick(e, owner || target && this);
	//}

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
	protected _dispatchMouseEvent(target:DisplayObject, type:string, bubbles:boolean, pointerId:number, o:any, nativeEvent:MouseEvent)
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
	 * @method _getObjectsUnderPoint
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Array} arr
	 * @param {Boolean} mouse If true, it will respect mouse interaction properties like mouseEnabled, mouseChildren, and active listeners.
	 * @param {Boolean} activeListener If true, there is an active mouse event listener.
	 * @return {Array}
	 * @protected
	 **/
	public _getObjectsUnderPoint(x, y, arr?:Array<T>, mouse?:boolean, activeListener?:boolean):Container<T> | T
	{
		var ctx = DisplayObject._hitTestContext;
		var mtx = this._matrix;
		activeListener = activeListener || (mouse && this.hasMouseEventListener());

		// draw children one at a time, and check if we get a hit:
		var children = this.children;
		var l = children.length;
		for(var i = l - 1; i >= 0; i--)
		{
			var child = children[i];
			var hitArea = child.hitArea;
			var mask = child.mask;


			if(!child.visible || (!child.isVisible()) || (mouse && !child.mouseEnabled))
			{
				continue;
			}


			if(!hitArea && mask && mask.graphics && !mask.graphics.isEmpty())
			{
				var maskMtx = mask.getMatrix(mask._matrix).prependMatrix(this.getConcatenatedMatrix(mtx));
				ctx.setTransform(maskMtx.a, maskMtx.b, maskMtx.c, maskMtx.d, maskMtx.tx - x, maskMtx.ty - y);

				// draw the mask as a solid fill:
				mask.graphics.drawAsPath(ctx);
				ctx.fillStyle = "#000";
				ctx.fill();

				// if we don't hit the mask, then no need to keep looking at this DO:

				if(!this._testHit(ctx))
				{
					continue;
				}
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, 2, 2);
			}

			// if a child container has a hitArea then we only need to check its hitArea, so we can treat it as a normal DO:
			if(!hitArea && child.type == DisplayType.CONTAINER)
			{
				var result:any = (<any> child)._getObjectsUnderPoint(x, y, arr, mouse, activeListener);
				if(!arr && result)
				{
					return (mouse && !this.mouseChildren) ? this : <T> result;
				}
			}
			else
			{


				if(mouse && !activeListener && !child.hasMouseEventListener())
				{
					continue;
				}


				child.getConcatenatedMatrix(mtx);

				if(hitArea)
				{
					mtx.appendTransform(hitArea.x, hitArea.y, hitArea.scaleX, hitArea.scaleY, hitArea.rotation, hitArea.skewX, hitArea.skewY, hitArea.regX, hitArea.regY);
					mtx.alpha = hitArea.alpha;
				}

				ctx.globalAlpha = mtx.alpha;
				ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
				(hitArea || child).draw(ctx);


				if(!this.testHit(ctx))
				{
					continue;
				}
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, 2, 2);


				if(arr)
				{
					arr.push(child);
				}
				else
				{
					return // (mouse && !this.mouseChildren) ? (<Container<T>> this) : (<T> child);
				}
			}
		}

		return null;
	}

}