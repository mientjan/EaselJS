import AbstractBehavior = require('./AbstractBehavior');
import DisplayObject = require('../display/DisplayObject');
import Stage = require('../display/Stage');
import Container = require('../display/Container');
import PointerEvent = require('../event/PointerEvent');
import DisplayType = require('../enum/DisplayType');
import MouseEvent = require('../event/MouseEvent');
import Size = require('../geom/Size');
import Scroller = require('../../zynga/Scroller');
import Animate = require('../../zynga/Animate');
import IScrollerOptions = require('../../zynga/IScrollerOptions');

class ScrollerBehavior extends AbstractBehavior
{
	protected _scroller:Scroller = null;
	protected _mousedown:boolean = false;

	public owner:Container;
	public holder:Container;

	public options:IScrollerOptions;

	constructor(options:IScrollerOptions = {})
	{
		super();

		this.options = options;
	}

	public initialize(container:Container):void
	{
		super.initialize(container);

		this.owner.enableMouseInteraction();
		this.owner.cursor = 'pointer';

		if(this.owner.children.length == 0
			|| this.owner.children.length > 1)
		{
			throw new Error('owner can have only one child that holds all the gallery items');
		}

		this.holder = this.owner.children[0];
		this._scroller = new Scroller(this.onChange.bind(this), this.options);


		// hijack onResize of owner.
		// @todo needs event
		//var onResize = this.owner.onResize;
		//this.owner.onResize = (e) => {
		//	onResize.call(this.owner, e);
		//	this.onResize(e);
		//}
		//
		//if( this.owner._parentSizeIsKnown){
		//	this.onResize(new Size(this.owner.parent.width, this.owner.parent.height));
		//}

		this.owner.addEventListener(Container.EVENT_MOUSE_DOWN, this.onMouseDown );
		this.owner.addEventListener(Container.EVENT_PRESS_MOVE, this.onMouseMove );
		this.owner.addEventListener(Container.EVENT_PRESS_UP, this.onMouseUp );

		//container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
		//	scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
		//}, false);

		//console.log('initialize', container);


	}

	protected onMouseDown = (e:MouseEvent) =>
	{

		this._scroller.doTouchStart([{
			pageX: e.stageX,
			pageY: e.stageY
		}], e.timeStamp);


		this._mousedown = true;
	}

	protected onMouseMove = (e:MouseEvent) =>
	{
		if(!this._mousedown)
		{
			return;
		}

		this._scroller.doTouchMove([{
			pageX: e.stageX,
			pageY: e.stageY
		}], e.timeStamp);

		this._mousedown = true;
	}

	protected onMouseUp = (e:MouseEvent) =>
	{
		if(!this._mousedown)
		{
			return;
		}
		//console.log('onMouseUp', e.timeStamp, e.pageX, e.pageY);

		this._scroller.doTouchEnd(e.timeStamp);

		this._mousedown = false;
	}

	public setDimensions(containerWidth:number, containerHeight:number, contentWidth:number, contentHeight:number)
	{
		this._scroller.setDimensions(containerWidth, containerHeight, contentWidth, contentHeight);
	}

	public scrollTo(x:number, y:number, animate:boolean = true)
	{
		this._scroller.scrollTo(x, y, animate);
	}

	public setSnapSize(width:number, height:number)
	{
		this._scroller.setSnapSize(width, height);
	}

	protected onChange(left:number, top:number, zoom:number)
	{
		this.holder.x = -left;
		this.holder.y = -top;

		// zoom?;
	}

	public destruct(){

		this.owner.removeEventListener(Container.EVENT_MOUSE_DOWN, this.onMouseDown );
		this.owner.removeEventListener(Container.EVENT_PRESS_UP, this.onMouseUp );
		this.owner.removeEventListener(Container.EVENT_PRESS_MOVE, this.onMouseMove );

		super.destruct();
	}
}

export = ScrollerBehavior;