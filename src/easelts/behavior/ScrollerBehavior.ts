import AbstractBehavior from "./AbstractBehavior";
import {DisplayObject} from "../display/DisplayObject";
import Stage from "../display/Stage";
import Container from "../display/Container";
import PointerEvent from "../event/PointerEvent";
import DisplayType from "../enum/DisplayType";
import MouseEvent from "../event/MouseEvent";
import Size from "../geom/Size";
import Scroller from "../../zynga/Scroller";
import Animate from "../../zynga/Animate";
import IScrollerOptions from "../../zynga/IScrollerOptions";

class ScrollerBehavior extends AbstractBehavior
{
	protected _scroller:Scroller = null;
	protected _mousedown:boolean = false;

	public owner:Container<DisplayObject>;
	public holder:Container<DisplayObject>;

	public options:IScrollerOptions;

	constructor(options:IScrollerOptions = {})
	{
		super();

		this.options = options;
	}

	public initialize(container:Container<DisplayObject>):void
	{
		super.initialize(container);

		this.owner.setMouseInteraction(true);
		this.owner.cursor = 'pointer';

		if(this.owner.children.length == 0
			|| this.owner.children.length > 1)
		{
			throw new Error('owner can have only one child that holds all the gallery items');
		}

		this.holder = <Container<DisplayObject>> this.owner.children[0];
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

export default ScrollerBehavior;