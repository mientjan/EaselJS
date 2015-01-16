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

// event
import EventDispatcher = require('../../createts/event/EventDispatcher');
import Event = require('../../createts/event/Event');
import TimeEvent = require('../../createts/event/TimeEvent');

// utils
import UID = require('../util/UID');
import Methods = require('../util/Methods');

// display
import Shape = require('./Shape');
import Shadow = require('./Shadow');
import Stage = require('./Stage');
import Container = require('./Container');

// filter
import Filter = require('../filters/Filter');

// enum
import CalculationType = require('../enum/CalculationType');
import DisplayType = require('../enum/DisplayType');

// geom
import FluidCalculation = require('../geom/FluidCalculation');
import FluidMeasurementsUnit = require('../geom/FluidMeasurementsUnit');
import m2 = require('../geom/Matrix2');
import Rectangle = require('../geom/Rectangle');
import Size = require('../geom/Size');
import Point = require('../geom/Point');

import IVector2 = require('../interface/IVector2');
import ISize = require('../interface/ISize');
import IDisplayType = require('../interface/IDisplayType');

import AbstractBehavior = require('../behavior/AbstractBehavior');

/**
 * @author Mient-jan Stelling <mientjan.stelling@gmail.com>
 * @class DisplayObject
 */
class DisplayObject extends EventDispatcher implements IVector2, ISize, IDisplayType
{
	public static EVENT_MOUSE_CLICK = 'click';
	public static EVENT_MOUSE_DOWN = 'mousedown';
	public static EVENT_MOUSE_OUT = 'mouseout';
	public static EVENT_MOUSE_OVER = 'mouseover';

	/**
	 *
	 * @type {string}
	 */
	public static EVENT_MOUSE_MOVE = 'mousemove';

	public static EVENT_PRESS_MOVE = 'pressmove';
	public static EVENT_PRESS_UP = 'pressup';
	public static EVENT_ROLL_OUT = 'rollout';
	public static EVENT_ROLL_OVER = 'rollover';

	/**
	 * @todo replace mouse events with pointer events
	 */
	public static EVENT_POINTER_CLICK = 'click';
	public static EVENT_POINTER_DOWN = 'mousedown';
	public static EVENT_POINTER_MOVE = 'mousemove';
	public static EVENT_POINTER_UP = 'pressup';
	public static EVENT_POINTER_CANCEL = 'mousedown';
	public static EVENT_POINTER_ENTER = 'mouseover';
	public static EVENT_POINTER_LEAVE = 'mouseout';
	public static EVENT_POINTER_OUT = 'mouseout';
	public static EVENT_POINTER_OVER = 'mouseover';

	/**
	 * Listing of mouse event names. Used in _hasMouseEventListener.
	 * @property _MOUSE_EVENTS
	 * @protected
	 * @static
	 * @type {string[]}
	 **/
	public static _MOUSE_EVENTS = [
		DisplayObject.EVENT_MOUSE_CLICK,
		DisplayObject.EVENT_MOUSE_DOWN,
		DisplayObject.EVENT_MOUSE_OUT,
		DisplayObject.EVENT_MOUSE_OVER,
		DisplayObject.EVENT_PRESS_MOVE,
		DisplayObject.EVENT_PRESS_UP,
		DisplayObject.EVENT_ROLL_OUT,
		DisplayObject.EVENT_ROLL_OVER,
		"dblclick" // @todo make depricated
	];

	public static COMPOSITE_OPERATION_SOURCE_ATOP = 'source-atop';
	public static COMPOSITE_OPERATION_SOURCE_IN = 'source-in';
	public static COMPOSITE_OPERATION_SOURCE_OUT = 'source-out';
	public static COMPOSITE_OPERATION_SOURCE_OVER = 'source-over';

	public static COMPOSITE_OPERATION_DESTINATION_ATOP = 'destination-atop';
	public static COMPOSITE_OPERATION_DESTINATION_IN = 'destination-in';
	public static COMPOSITE_OPERATION_DESTINATION_OUT = 'destination-out';
	public static COMPOSITE_OPERATION_DESTINATION_OVER = 'destination-over';

	public static COMPOSITE_OPERATION_LIGHTER = 'lighter';
	public static COMPOSITE_OPERATION_DARKER = 'darker';
	public static COMPOSITE_OPERATION_XOR = 'xor';
	public static COMPOSITE_OPERATION_COPY = 'copy';

	/**
	 * Suppresses errors generated when using features like hitTest, mouse events, and {{#crossLink "getObjectsUnderPoint"}}{{/crossLink}}
	 * with cross domain content.
	 * @property suppressCrossDomainErrors
	 * @static
	 * @type {Boolean}
	 * @default false
	 **/
	public static suppressCrossDomainErrors = false;

	/**
	 * @property _snapToPixelEnabled
	 * @protected
	 * @static
	 * @type {Boolean}
	 * @default false
	 **/
	public static _snapToPixelEnabled = false; // stage.snapToPixelEnabled is temporarily copied here during a draw to provide global access.

	/**
	 * @property _hitTestCanvas
	 * @type {HTMLCanvasElement | Object}
	 * @static
	 * @protected
	 **/
	public static _hitTestCanvas:HTMLCanvasElement = Methods.createCanvas();

	/**
	 * @property _hitTestContext
	 * @type {CanvasRenderingContext2D}
	 * @static
	 * @protected
	 **/
	public static _hitTestContext:CanvasRenderingContext2D = <CanvasRenderingContext2D> DisplayObject._hitTestCanvas.getContext('2d');

	/**
	 * @property _nextCacheID
	 * @type {Number}
	 * @static
	 * @protected
	 **/
	public static _nextCacheID:number = 1;

	// public properties:

	public type:DisplayType = DisplayType.DISPLAYOBJECT;

	/**
	 * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
	 * @property alpha
	 * @type {Number}
	 * @default 1
	 **/
	public alpha:number = 1;

	/**
	 * If a cache is active, this returns the canvas that holds the cached version of this display object. See {{#crossLink "cache"}}{{/crossLink}}
	 * for more information.
	 * @property cacheCanvas
	 * @type {HTMLCanvasElement | Object}
	 * @default null
	 * @readonly
	 **/
	public cacheCanvas:HTMLCanvasElement = null;

	/**
	 * Unique ID for this display object. Makes display objects easier for some uses.
	 * @property id
	 * @type {Number}
	 * @default -1
	 **/
	public id:number = UID.get();

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
	public mouseEnabled:boolean = false;

	/**
	 * If false, the tick will not run on this display object (or its children). This can provide some performance benefits.
	 * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
	 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
	 * @property tickEnabled
	 * @type Boolean
	 * @default true
	 **/
	public tickEnabled:boolean = true;

	/**
	 * An optional name for this display object. Included in {{#crossLink "DisplayObject/toString"}}{{/crossLink}} . Useful for
	 * debugging.
	 * @property name
	 * @type {String}
	 * @default null
	 **/
	public name:string = null;

	/**
	 * A reference to the {{#crossLink "Container"}}{{/crossLink}} or {{#crossLink "Stage"}}{{/crossLink}} object that
	 * contains this display object, or null if it has not been added
	 * to one.
	 * @property parent
	 * @final
	 * @type {Container}
	 * @default null
	 * @readonly
	 **/
	public parent:Container = null;

	/**
	 * The left offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate
	 * around its center, you would set regX and {{#crossLink "DisplayObject/regY:property"}}{{/crossLink}} to 50.
	 * @property regX
	 * @type {Number}
	 * @default 0
	 **/
	public regX:number = 0;

	/**
	 * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
	 * its center, you would set {{#crossLink "DisplayObject/regX:property"}}{{/crossLink}} and regY to 50.
	 * @property regY
	 * @type {Number}
	 * @default 0
	 **/
	public regY:number = 0;

	/**
	 * The rotation in degrees for this display object.
	 * @property rotation
	 * @type {Number}
	 * @default 0
	 **/
	public rotation:number = 0;

	/**
	 * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
	 * object to twice its nominal width. To horizontally flip an object, set the scale to a negative number.
	 * @property scaleX
	 * @type {Number}
	 * @default 1
	 **/
	public scaleX:number = 1;

	/**
	 * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
	 * object to half its nominal height. To vertically flip an object, set the scale to a negative number.
	 * @property scaleY
	 * @type {Number}
	 * @default 1
	 **/
	public scaleY:number = 1;

	/**
	 * The factor to skew this display object horizontally.
	 * @property skewX
	 * @type {Number}
	 * @default 0
	 **/
	public skewX:number = 0;

	/**
	 * The factor to skew this display object vertically.
	 * @property skewY
	 * @type {Number}
	 * @default 0
	 **/
	public skewY:number = 0;

	/**
	 * A shadow object that defines the shadow to render on this display object. Set to `null` to remove a shadow. If
	 * null, this property is inherited from the parent container.
	 * @property shadow
	 * @type {Shadow}
	 * @default null
	 **/
	public shadow:Shadow = null;

	/**
	 * Indicates whether this display object should be rendered to the canvas and included when running the Stage
	 * {{#crossLink "Stage/getObjectsUnderPoint"}}{{/crossLink}} method.
	 * @property visible
	 * @type {Boolean}
	 * @default true
	 **/
	public visible:boolean = true;

	/**
	 * The x (horizontal) position of the display object, relative to its parent.
	 * @property x
	 * @type {Number}
	 * @default 0
	 **/
	public x:number = 0;

	/** The y (vertical) position of the display object, relative to its parent.
	 * @property y
	 * @type {Number}
	 * @default 0
	 **/
	public y:number = 0;

	public stage:Stage = null;

	/** When true the geom of this object will be updated when its parent resizes.
	 *
	 * @property updateGeomOnResize
	 * @type {Boolean}
	 * @default true
	 **/
	public updateGeomOnResize = true;

	public width:number = 0;
	public height:number = 0;

	public _x_type:CalculationType = CalculationType.STATIC;
	public _x_procent:number = .0;
	public _x_calc:FluidMeasurementsUnit[];

	public _y_type:CalculationType;
	public _y_procent:number = .0;
	public _y_calc:FluidMeasurementsUnit[];

	public _width_type:CalculationType = CalculationType.STATIC;
	public _width_procent:number = .0;
	public _width_calc:FluidMeasurementsUnit[];

	public _height_type:CalculationType = CalculationType.STATIC;
	public _height_procent:number = .0;
	public _height_calc:FluidMeasurementsUnit[];

	public _regX_type:CalculationType = CalculationType.STATIC;
	public _regX_procent:number = .0;
	public _regX_calc:FluidMeasurementsUnit[];

	public _regY_type:CalculationType = CalculationType.STATIC;
	public _regY_procent:number = .0;
	public _regY_calc:FluidMeasurementsUnit[];

	public _behaviorList:AbstractBehavior[] = null;
	public _parentSizeIsKnown:boolean = false;

	public minimumContainerSize:Rectangle = null;
	public maximumContainerSize:Rectangle = null;

	/**
	 * The composite operation indicates how the pixels of this display object will be composited with the elements
	 * behind it. If `null`, this property is inherited from the parent container. For more information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
	 * whatwg spec on compositing</a>.
	 * @property compositeOperation
	 * @type {String}
	 * @default null
	 **/
	public compositeOperation:string = null;

	/**
	 * Indicates whether the display object should be drawn to a whole pixel when
	 * {{#crossLink "Stage/snapToPixelEnabled"}}{{/crossLink}} is true. To enable/disable snapping on whole
	 * categories of display objects, set this value on the prototype (Ex. Text.prototype.snapToPixel = true).
	 * @property snapToPixel
	 * @type {Boolean}
	 * @default true
	 **/
	public snapToPixel:boolean = true;

	/**
	 * An array of Filter objects to apply to this display object. Filters are only applied / updated when {{#crossLink "cache"}}{{/crossLink}}
	 * or {{#crossLink "updateCache"}}{{/crossLink}} is called on the display object, and only apply to the area that is
	 * cached.
	 * @property filters
	 * @type {Array}
	 * @default null
	 **/
	public filters:Filter[] = null;

	/**
	 * Returns an ID number that uniquely identifies the current cache for this display object. This can be used to
	 * determine if the cache has changed since a previous check.
	 * @property cacheID
	 * @type {Number}
	 * @default 0
	 */
	public cacheID = 0;

	/**
	 * A Shape instance that defines a vector mask (clipping path) for this display object.  The shape's transformation
	 * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
	 * @property mask
	 * @type {Shape}
	 * @default null
	 */
	public mask:Shape = null;

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
	public hitArea:DisplayObject = null;

	/**
	 * A CSS cursor (ex. "pointer", "help", "text", etc) that will be displayed when the user hovers over this display
	 * object. You must enable mouseover events using the {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}} method to
	 * use this property. Setting a non-null cursor on a Container will override the cursor set on its descendants.
	 * @property cursor
	 * @type {String}
	 * @default null
	 */
	public cursor:string = null;

	// private properties:

	/**
	 * @property _cacheOffsetX
	 * @protected
	 * @type {Number}
	 * @default 0
	 **/
	public _cacheOffsetX:number = 0;

	/**
	 * @property _cacheOffsetY
	 * @protected
	 * @type {Number}
	 * @default 0
	 **/
	public _cacheOffsetY:number = 0;

	/**
	 * @property _cacheScale
	 * @protected
	 * @type {Number}
	 * @default 1
	 **/
	public _cacheWidth:number;
	public _cacheHeight:number;
	public _cacheX:number;
	public _cacheY:number;
	public _cacheScale:number = 1;

	/**
	 * @property _cacheDataURLID
	 * @protected
	 * @type {Number}
	 * @default 0
	 */
	public _cacheDataURLID:number = 0;

	/**
	 * @property _cacheDataURL
	 * @protected
	 * @type {String}
	 * @default null
	 */
	public _cacheDataURL:string = null;

	/**
	 * @property _matrix
	 * @protected
	 * @type {Matrix2D}
	 * @default null
	 **/
	public _matrix:m2.Matrix2 = new m2.Matrix2(0, 0, 0, 0, 0, 0);

	/**
	 * @property _rectangle
	 * @protected
	 * @type {Rectangle}
	 * @default null
	 **/
	public _rectangle:Rectangle = new Rectangle(0, 0, 0, 0);

	/**
	 * @property _bounds
	 * @protected
	 * @type {Rectangle}
	 * @default null
	 **/
	public _bounds:Rectangle = null;

	constructor(width:any = '100%', height:any = '100%', x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super();

		this.setGeomTransform(width, height, x, y, regX, regY);
	}

	public initialize(){
		// has something to do with the createjs toolkit needing to call initialize.
	}

	/**
	 * @method dot
	 * @param v
	 * @returns {number}
	 */
	public dot(v:IVector2):number
	{
		return this.x * v.x + this.y * v.y;
	}

	public distanceToSquared(v:IVector2):number
	{
		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	}

	public distanceTo(v:IVector2):number
	{
		return Math.sqrt(this.distanceToSquared(v));
	}

	/**
	 * @method setWidth
	 * @param {string|number} width
	 */
	public setWidth(width:string):any;
	public setWidth(width:number):any;
	public setWidth(width:any):any
	{
		if(typeof(width) == 'string')
		{
			if(width.substr(-1) == '%')
			{
				this._width_procent = parseFloat(width.substr(0, width.length - 1)) / 100;
				this._width_type = CalculationType.PROCENT;
			}
			else
			{
				this._width_calc = FluidCalculation.dissolveCalcElements(width);
				this._width_type = CalculationType.CALC;
			}

		}
		else
		{
			this.width = width;
			this._width_type = CalculationType.STATIC;
		}

		if(this._parentSizeIsKnown)
		{
			this.onResize(new Size(this.parent.width, this.parent.height));
		}
		return this;
	}

	/**
	 * @method getWidth
	 * @returns {number}
	 */
	public getWidth()
	{
		return this.width;
	}

	/**
	 * @method setHeight
	 * @param {string|number} height
	 */
	public setHeight(height:string):any;
	public setHeight(height:number):any;
	public setHeight(height:any):any
	{
		if(typeof(height) == 'string')
		{
			// @todo check if only procent unit.
			if(height.substr(-1) == '%')
			{
				this._height_procent = parseFloat(height.substr(0, height.length - 1)) / 100;
				this._height_type = CalculationType.PROCENT;
			}
			else
			{
				this._height_calc = FluidCalculation.dissolveCalcElements(height);
				this._height_type = CalculationType.CALC;
			}
		}
		else
		{
			this.height = height;
			this._height_type = CalculationType.STATIC;
		}

		if(this._parentSizeIsKnown)
		{
			this.onResize(new Size(this.parent.width, this.parent.height));
		}
		return this;
	}

	/**
	 * @method getHeight
	 * @param {number} height
	 */
	public getHeight()
	{
		return this.height;
	}


	/**
	 * @method setX
	 * @param {string|number} x
	 */
	public setX(x:string):any;
	public setX(x:number):any;
	public setX(x:any):any
	{
		if(typeof(x) == 'string')
		{
			if(x.substr(-1) == '%')
			{
				this._x_procent = parseFloat(x.substr(0, x.length - 1)) / 100;
				this._x_type = CalculationType.PROCENT;
			}
			else
			{
				this._x_calc = FluidCalculation.dissolveCalcElements(x);
				this._x_type = CalculationType.CALC;
			}

		}
		else
		{
			this.x = x;
			this._x_type = CalculationType.STATIC;
		}

		if(this._parentSizeIsKnown)
		{
			this.onResize(new Size(this.parent.width, this.parent.height));
		}

		return this;
	}

	public getX()
	{
		return this.x;
	}

	public setY(y:string):any;

	public setY(y:number):any;

	public setY(y:any):any
	{
		if(typeof(y) == 'string')
		{
			if(y.substr(-1) == '%')
			{
				this._y_procent = parseFloat(y.substr(0, y.length - 1)) / 100;
				this._y_type = CalculationType.PROCENT;
			}
			else
			{
				this._y_calc = FluidCalculation.dissolveCalcElements(y);
				this._y_type = CalculationType.CALC;
			}

		}
		else
		{
			this.y = y;
			this._y_type = CalculationType.STATIC;
		}

		if(this._parentSizeIsKnown)
		{
			this.onResize(new Size(this.parent.width, this.parent.height));
		}
		return this;
	}


	public getY()
	{
		return this.y;
	}

	public setRegX(x:string):any;

	public setRegX(x:number):any;

	public setRegX(x:any):any
	{
		if(typeof(x) == 'string')
		{
			if(x.substr(-1) == '%')
			{
				this._regX_procent = parseFloat(x.substr(0, x.length - 1)) / 100;
				this._regX_type = CalculationType.PROCENT;
			}
			else
			{
				this._regX_calc = FluidCalculation.dissolveCalcElements(x);
				this._regX_type = CalculationType.CALC;
			}

		}
		else
		{
			this.regX = x;
			this._regX_type = CalculationType.STATIC;
		}

		if(this._parentSizeIsKnown)
		{
			this.onResize(new Size(this.parent.width, this.parent.height));
		}

		return this;
	}

	public getRegX()
	{
		return this.regX;
	}

	public setRegY(y:string):any;

	public setRegY(y:number):any;

	public setRegY(y:any):any
	{
		if(typeof(y) == 'string')
		{
			if(y.substr(-1) == '%')
			{
				this._regY_procent = parseFloat(y.substr(0, y.length - 1)) / 100;
				this._regY_type = CalculationType.PROCENT;
			}
			else
			{
				this._regY_calc = FluidCalculation.dissolveCalcElements(y);
				this._regY_type = CalculationType.CALC;
			}

		}
		else
		{
			this.regY = y;
			this._regY_type = CalculationType.STATIC;
		}

		if(this._parentSizeIsKnown)
		{
			this.onResize(new Size(this.parent.width, this.parent.height));
		}
		return this;
	}

	public getRegY()
	{
		return this.regY;
	}

	public addBehavior(behavior:AbstractBehavior):DisplayObject
	{
		if(!this._behaviorList)
		{
			this._behaviorList = [];
		}
		this._behaviorList.push(behavior);
		behavior.initialize(this);
		return this;
	}

	public removeBehavior(behavior:AbstractBehavior):DisplayObject
	{
		var behaviorList = this._behaviorList;
		if(behaviorList)
		{
			var length = behaviorList.length;
			for(var i = 0; i < behaviorList.length; i++)
			{
				var behaviorItem = behaviorList[i];
				if(behaviorItem === behavior)
				{
					behaviorList.splice(i, 1);
					length--;
					i--;
				}
			}
		}
		return this;
	}

	/**
	 * Removes all be behaviors
	 *
	 * @method removeAllBehaviors
	 * @return void
	 */
	public removeAllBehaviors():void
	{
		if(this._behaviorList)
		{
			while(this._behaviorList.length)
			{
				this._behaviorList.pop().destruct();
			}
		}
	}

	/**
	 * @method enableMouseInteraction
	 * @return void
	 */
	public enableMouseInteraction()
	{
		this.mouseEnabled = true;
	}

	/**
	 * @method disableMouseInteraction
	 * @return void
	 */
	public disableMouseInteraction()
	{
		this.mouseEnabled = false;
	}

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	public isVisible()
	{
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
	}

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
	public draw(ctx:CanvasRenderingContext2D, ignoreCache?:boolean):boolean
	{

		var cacheCanvas = this.cacheCanvas;
		if(ignoreCache || !cacheCanvas)
		{
			return false;
		}

		var scale = this._cacheScale;
		var offX = this._cacheOffsetX;
		var offY = this._cacheOffsetY;
		var fBounds;
		if(fBounds = this._applyFilterBounds(offX, offY, 0, 0))
		{
			offX = fBounds.x;
			offY = fBounds.y;
		}
		ctx.drawImage(cacheCanvas, offX, offY, cacheCanvas.width / scale, cacheCanvas.height / scale);
		return true;
	}

	public DisplayObject_draw = this.draw;

	/**
	 * Applies this display object's transformation, alpha, globalCompositeOperation, clipping path (mask), and shadow
	 * to the specified context. This is typically called prior to {{#crossLink "DisplayObject/draw"}}{{/crossLink}}.
	 *
	 * @method updateContext
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
	 **/
	public updateContext(ctx:CanvasRenderingContext2D):void
	{
		var mtx, mask = this.mask, o = this;

		if(mask && mask.graphics && !mask.graphics.isEmpty())
		{
			mtx = mask.getMatrix(mask._matrix);
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);

			mask.graphics.drawAsPath(ctx);
			ctx.clip();

			mtx.invert();
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		}

		mtx = o._matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
		var tx = mtx.tx, ty = mtx.ty;
		if(DisplayObject._snapToPixelEnabled && o.snapToPixel)
		{
			tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
			ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
		}
		ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, tx, ty);
		ctx.globalAlpha *= o.alpha;
		if(o.compositeOperation)
		{
			ctx.globalCompositeOperation = o.compositeOperation;
		}
		if(o.shadow)
		{
			this._applyShadow(ctx, o.shadow);
		}
	}

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
	public cache(x:number, y:number, width:number, height:number, scale = 1):void
	{
		// draw to canvas.
		//		scale = scale||1;
		if(!this.cacheCanvas)
		{
			this.cacheCanvas = Methods.createCanvas();
		}
		this._cacheWidth = width;
		this._cacheHeight = height;
		this._cacheOffsetX = x;
		this._cacheOffsetY = y;
		this._cacheScale = scale;
		this.updateCache();
	}

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
	public updateCache(compositeOperation?:string):void
	{
		var cacheCanvas = this.cacheCanvas, scale = this._cacheScale, offX = this._cacheOffsetX * scale, offY = this._cacheOffsetY * scale;
		var w = this._cacheWidth, h = this._cacheHeight, fBounds;
		if(!cacheCanvas)
		{
			throw "cache() must be called before updateCache()";
		}
		var ctx = cacheCanvas.getContext("2d");

		// update bounds based on filters:
		if(fBounds = this._applyFilterBounds(offX, offY, w, h))
		{
			offX = fBounds.x;
			offY = fBounds.y;
			w = fBounds.width;
			h = fBounds.height;
		}

		w = Math.ceil(w * scale);
		h = Math.ceil(h * scale);
		if(w != cacheCanvas.width || h != cacheCanvas.height)
		{
			// TODO: it would be nice to preserve the content if there is a compositeOperation.
			cacheCanvas.width = w;
			cacheCanvas.height = h;
		}
		else if(!compositeOperation)
		{
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
	}

	/**
	 * Clears the current cache. See {{#crossLink "DisplayObject/cache"}}{{/crossLink}} for more information.
	 * @method uncache
	 **/
	public uncache():void
	{
		this._cacheDataURL = this.cacheCanvas = null;
		this.cacheID = this._cacheOffsetX = this._cacheOffsetY = 0;
		this._cacheScale = 1;
	}

	/**
	 * Returns a data URL for the cache, or null if this display object is not cached.
	 * Uses cacheID to ensure a new data URL is not generated if the cache has not changed.
	 * @method getCacheDataURL
	 * @return {String} The image data url for the cache.
	 **/
	public getCacheDataURL():string
	{
		if(!this.cacheCanvas)
		{
			return null;
		}

		if(this.cacheID != this._cacheDataURLID)
		{
			this._cacheDataURL = this.cacheCanvas.toDataURL();
		}

		return this._cacheDataURL;
	}

	/**
	 * Returns the stage that this display object will be rendered on, or null if it has not been added to one.
	 * @method getStage
	 * @return {Stage} The Stage instance that the display object is a descendent of. null if the DisplayObject has not
	 * been added to a Stage.
	 **/
	public getStage():Stage
	{
		var o = this;
		while(o.parent)
		{
			o = o.parent;
		}

		// using dynamic access to avoid circular dependencies;
		if(o.type == DisplayType.STAGE)
		{
			return <Stage> o;
		}

		return null;
	}

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
	public localToGlobal(x:number, y:number):Point
	{
		var mtx = this.getConcatenatedMatrix(this._matrix);
		if(mtx == null)
		{
			return null;
		}
		mtx.append(1, 0, 0, 1, x, y);
		return new Point(mtx.tx, mtx.ty);
	}

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
	public globalToLocal(x:number, y:number)
	{
		var mtx = this.getConcatenatedMatrix(this._matrix);
		if(mtx == null)
		{
			return null;
		}
		mtx.invert();
		mtx.append(1, 0, 0, 1, x, y);
		return new Point(mtx.tx, mtx.ty);
	}

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
	public localToLocal(x, y, target)
	{
		var pt = this.localToGlobal(x, y);
		return target.globalToLocal(pt.x, pt.y);
	}

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
	public setTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.scaleX = scaleX == null ? 1 : scaleX;
		this.scaleY = scaleY == null ? 1 : scaleY;
		this.rotation = rotation || 0;
		this.skewX = skewX || 0;
		this.skewY = skewY || 0;
		this.regX = regX || 0;
		this.regY = regY || 0;

		return this;
	}

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
	public setGeomTransform(w:any = null, h:any = null, x:any = null, y:any = null, rx:any = null, ry:any = null):any
	{
		var parentIsKnown = this._parentSizeIsKnown;
		this._parentSizeIsKnown = false;

		if(x != null)
		{
			this.setX(x);
		}
		if(y != null)
		{
			this.setY(y);
		}
		if(w != null)
		{
			this.setWidth(w);
		}
		if(h != null)
		{
			this.setHeight(h);
		}
		if(rx != null)
		{
			this.setRegX(rx);
		}
		if(ry != null)
		{
			this.setRegY(ry);
		}

		this._parentSizeIsKnown = parentIsKnown;

		if(this._parentSizeIsKnown)
		{
			this.onResize(new Size(this.parent.width, this.parent.height))
		}

		return this;
	}

	/**
	 * Returns a matrix based on this object's transform.
	 * @method getMatrix
	 * @param {Matrix2D} matrix Optional. A Matrix2D object to populate with the calculated values. If null, a new
	 * Matrix object is returned.
	 * @return {Matrix2D} A matrix representing this display object's transform.
	 **/
	public getMatrix(matrix?:m2.Matrix2)
	{
		var o = this;
		return (matrix ? matrix.identity() : new m2.Matrix2(0, 0, 0, 0, 0, 0))
			.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
			.appendProperties(o.alpha, o.shadow, o.compositeOperation, 1);
	}

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
	public getConcatenatedMatrix(matrix:m2.Matrix2):m2.Matrix2
	{
		if(matrix)
		{
			matrix.identity();
		}
		else
		{
			matrix = new m2.Matrix2(0, 0, 0, 0, 0, 0);
		}
		var o = this;
		while(o != null)
		{
			matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha, o.shadow, o.compositeOperation, o.visible);
			o = o.parent;
		}
		return matrix;
	}

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
	public hitTest(x:number, y:number)
	{
		// TODO: update with support for .hitArea & .mask and update hitArea / mask docs?
		var ctx = DisplayObject._hitTestContext;
		ctx.setTransform(1, 0, 0, 1, -x, -y);
		this.draw(ctx);

		var hit = this._testHit(ctx);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, 2, 2);
		return hit;
	}

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
	public set(props:any)
	{
		for(var n in props)
		{
			this[n] = props[n];
		}
		return this;
	}

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
	public getBounds():Rectangle
	{
		if(this._bounds)
		{
			return this._rectangle.copy(this._bounds);
		}
		var cacheCanvas = <HTMLCanvasElement> this.cacheCanvas;
		if(cacheCanvas)
		{
			var scale = this._cacheScale;
			return this._rectangle.initialize(this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width / scale, cacheCanvas.height / scale);
		}

		return null;
	}

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
	public getTransformedBounds():Rectangle
	{
		return this._getBounds();
	}

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
	public setBounds(x:number, y:number, width:number, height:number):void
	{
		if(x == null)
		{
			this._bounds = null;
		}

		this._bounds = (this._bounds || new Rectangle(x, y, width, height) );
	}

	/**
	 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example .parent). Also note that caches are not maintained across clones.
	 * @method clone
	 * @return {DisplayObject} A clone of the current DisplayObject instance.
	 **/
	public clone(recursive?:boolean)
	{
		var o = new DisplayObject();
		this.cloneProps(o);
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	public toString()
	{
		return "[DisplayObject (name=" + this.name + ")]";
	}

	// private methods:

	// separated so it can be used more easily in subclasses:
	/**
	 * @method cloneProps
	 * @protected
	 * @param {DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
	 * instance copied into.
	 **/
	public cloneProps(o:DisplayObject)
	{
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
	}

	/**
	 * @method _applyShadow
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Shadow} shadow
	 **/
	public _applyShadow(ctx:CanvasRenderingContext2D, shadow:Shadow)
	{
		shadow = shadow || Shadow.identity;
		ctx.shadowColor = shadow.color;
		ctx.shadowOffsetX = shadow.offsetX;
		ctx.shadowOffsetY = shadow.offsetY;
		ctx.shadowBlur = shadow.blur;
	}

	/**
	 * @method _tick
	 * @param {Object} props Props to copy to the tick event object. This will usually include the
	 * properties from the {{#crossLink "Ticker"}}{{/crossLink}} "tick" event, such as `delta` and `paused`, but may
	 * be undefined or contain other values depending on the usage by the application.
	 * @protected
	 **/
	public onTick(e:TimeEvent)
	{
	}

	/**
	 * @method _testHit
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @return {Boolean}
	 **/
	public _testHit(ctx)
	{
		try
		{
			var hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
		} catch(e)
		{
			if(!DisplayObject.suppressCrossDomainErrors)
			{
				throw new Error('An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.');
			}
		}

		return hit;
	}

	/**
	 * @method _applyFilters
	 * @protected
	 **/
	public _applyFilters()
	{
		if(!this.filters || this.filters.length == 0 || !this.cacheCanvas)
		{
			return;
		}
		var l = this.filters.length;
		var ctx = this.cacheCanvas.getContext("2d");
		var w = this.cacheCanvas.width;
		var h = this.cacheCanvas.height;
		for(var i = 0; i < l; i++)
		{
			this.filters[i].applyFilter(ctx, 0, 0, w, h);
		}
	}

	/**
	 * @method _applyFilterBounds
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 * @return {Rectangle}
	 * @protected
	 **/
	public _applyFilterBounds(x, y, width, height)
	{
		var bounds, l, filters = this.filters;
		if(!filters || !(l = filters.length))
		{
			return null;
		}

		for(var i = 0; i < l; i++)
		{
			var f = this.filters[i];
			var fBounds = f.getBounds && f.getBounds();
			if(!fBounds)
			{
				continue;
			}
			if(!bounds)
			{
				bounds = this._rectangle.initialize(x, y, width, height);
			}
			bounds.x += fBounds.x;
			bounds.y += fBounds.y;
			bounds.width += fBounds.width;
			bounds.height += fBounds.height;
		}
		return bounds;
	}

	/**
	 * @method _getBounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
	 * @return {Rectangle}
	 * @protected
	 **/
	public _getBounds(matrix?:m2.Matrix2, ignoreTransform?:boolean)
	{
		return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
	}

	public DisplayObject_getBounds = this._getBounds;


	/**
	 * @method _transformBounds
	 * @param {Rectangle} bounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform
	 * @return {Rectangle}
	 * @protected
	 **/
	public _transformBounds(bounds:Rectangle, matrix:m2.Matrix2, ignoreTransform:boolean)
	{
		if(!bounds)
		{
			return bounds;
		}
		var x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
		var mtx = ignoreTransform ? this._matrix.identity() : this.getMatrix(this._matrix);

		if(x || y)
		{
			mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
		}
		if(matrix)
		{
			mtx.prependMatrix(matrix);
		}

		var x_a = width * mtx.a, x_b = width * mtx.b;
		var y_c = height * mtx.c, y_d = height * mtx.d;
		var tx = mtx.tx, ty = mtx.ty;

		var minX = tx, maxX = tx, minY = ty, maxY = ty;

		if((x = x_a + tx) < minX)
		{
			minX = x;
		}
		else if(x > maxX)
		{
			maxX = x;
		}
		if((x = x_a + y_c + tx) < minX)
		{
			minX = x;
		}
		else if(x > maxX)
		{
			maxX = x;
		}
		if((x = y_c + tx) < minX)
		{
			minX = x;
		}
		else if(x > maxX)
		{
			maxX = x;
		}

		if((y = x_b + ty) < minY)
		{
			minY = y;
		}
		else if(y > maxY)
		{
			maxY = y;
		}
		if((y = x_b + y_d + ty) < minY)
		{
			minY = y;
		}
		else if(y > maxY)
		{
			maxY = y;
		}
		if((y = y_d + ty) < minY)
		{
			minY = y;
		}
		else if(y > maxY)
		{
			maxY = y;
		}

		return bounds.initialize(minX, minY, maxX - minX, maxY - minY);
	}

	/**
	 * Indicates whether the display object has any mouse event listeners or a cursor.
	 *
	 * @method _hasMouseEventListener
	 * @return {Boolean}
	 * @protected
	 **/
	public _hasMouseEventListener():boolean
	{
		var evts = DisplayObject._MOUSE_EVENTS;
		for(var i = 0, l = evts.length; i < l; i++)
		{
			if(this.hasEventListener(evts[i]))
			{
				return true;
			}
		}

		return this.cursor != null;
	}

	public onStageSet():void
	{}

	public onResize(e:Size):void
	{
		this._parentSizeIsKnown = true;

		if(this.updateGeomOnResize)
		{
			if(this.minimumContainerSize || this.maximumContainerSize)
			{
				// size object is cloned because we are going to change the value.
				// and this object is used by multiple display objects.
				var mincs = this.minimumContainerSize;
				this.scaleX = this.scaleY = Math.min(1, e.width / mincs.width, e.height / mincs.height);
			}

			if(this._width_type == CalculationType.PROCENT)
			{
				this.width = this._width_procent * e.width;
			}
			else if(this._width_type == CalculationType.CALC)
			{
				this.width = FluidCalculation.calcUnit(e.width, this._width_calc);
			}

			if(this._height_type == CalculationType.PROCENT)
			{
				this.height = this._height_procent * e.height;
			}
			else if(this._height_type == CalculationType.CALC)
			{
				this.height = FluidCalculation.calcUnit(e.height, this._height_calc);
			}

			if(this._regX_type == CalculationType.PROCENT)
			{
				this.regX = this._regX_procent * this.width;
			}
			else if(this._regX_type == CalculationType.CALC)
			{
				this.regX = FluidCalculation.calcUnit(this.width, this._regX_calc);
			}

			if(this._regY_type == CalculationType.PROCENT)
			{
				this.regY = this._regY_procent * this.height;
			}
			else if(this._regY_type == CalculationType.CALC)
			{
				this.regY = FluidCalculation.calcUnit(this.height, this._height_calc);
			}

			if(this._x_type == CalculationType.PROCENT)
			{
				this.x = Math.round(this._x_procent * e.width);
			}
			else if(this._x_type == CalculationType.CALC)
			{
				this.x = Math.round(FluidCalculation.calcUnit(e.width, this._x_calc));
			}

			if(this._y_type == CalculationType.PROCENT)
			{
				this.y = Math.round(this._y_procent * e.height);
			}
			else if(this._y_type == CalculationType.CALC)
			{
				this.y = Math.round(FluidCalculation.calcUnit(e.height, this._y_calc));
			}
		}

	}

	public destruct()
	{
		this.parent = null;
		this.removeAllBehaviors();

		super.destruct();
	}
}

export = DisplayObject;
