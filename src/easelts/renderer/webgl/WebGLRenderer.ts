import {DisplayObject} from "../../display/DisplayObject";
import {Canvas2DElement} from "../Canvas2DElement";
import {Signal} from "../../../core/event/Signal";
import {Stats} from "../../component/Stats";
import {Rectangle} from "../../geom/Rectangle";
import {CanvasWebGLElement} from "../CanvasWebGLElement";

export class WebGLRenderer
{
	_context:WebGLRenderingContext;
	_element:CanvasWebGLElement;
	_currentRenderer:any = null;
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

	protected _initContext():void
	{
		var gl = this._context;
		gl.disable(gl.DEPTH_TEST);
		gl.disable(gl.CULL_FACE);
		gl.enable(gl.BLEND);
	}

	public setElement(element:CanvasWebGLElement)
	{
		this._element = element;
		this._context = element.getContext();
	}

	public setObjectRenderer(objectRenderer)
{
    if (this.currentRenderer === objectRenderer)
    {
        return;
    }

    this.currentRenderer.stop();
    this.currentRenderer = objectRenderer;
    this.currentRenderer.start();
}

	public render(item:DisplayObject):void
	{
		var gl = this._context;
		var element = this._element;
		var autoClear = this._autoClear;

		this.drawstartSignal.emit();

		if (autoClear)
		{
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}

		// render the scene!
		// item.renderWebGL(this);

		this.drawendSignal.emit();
	}
}
