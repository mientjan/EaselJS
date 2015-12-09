
import DisplayObject from "../../display/DisplayObject";
import {ICanvasBufferOptions} from "../buffer/CanvasBuffer";
import {CanvasBuffer} from "../buffer/CanvasBuffer";


class RendererCanvas extends CanvasBuffer
{
	constructor(width:number, height:number, options:ICanvasBufferOptions)
	{
		super(width, height, options);
	}

	public render(item:DisplayObject):void
	{
		item.draw(this.context);
	}
}