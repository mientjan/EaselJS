import {DisplayObject} from "../../display/DisplayObject";
import {Canvas2DElement} from "../Canvas2DElement";
import Signal from "../../../core/event/Signal";

export class Context2dRenderer
{
	_context:CanvasRenderingContext2D;
	_element:Canvas2DElement;

	_autoClear:boolean = true;

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

	public setElement(element:Canvas2DElement)
	{
		this._element = element;
		this._context = element.getContext();
	}

	public render(item:DisplayObject):void
	{
		var ctx = this._context;
		var element = this._element;
		var autoClear = this._autoClear;

		this.drawstartSignal.emit();

		// DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;

		ctx.setTransform(1, 0, 0, 1, 0, 0 );

		if(autoClear)
		{
			element.clear();
		}

		ctx.save();
		// if(this.drawRect)
		// {
		// 	ctx.beginPath();
		// 	ctx.rect(r.x, r.y, r.width, r.height);
		// 	ctx.clip();
		// }

		item.updateContext(ctx);
		item.draw(ctx, false);
		ctx.restore();

		this.drawendSignal.emit();
	}
}