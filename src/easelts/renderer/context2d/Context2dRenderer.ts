import {DisplayObject} from "../../display/DisplayObject";
import {Canvas2DElement} from "../Canvas2DElement";

export class Context2dRenderer
{
	_context;
	_element;

	public setElement(element:Canvas2DElement)
	{
		this._element = element;
		this._context = element.getContext();
	}

	public render(item:DisplayObject):void
	{
		item.draw(this._context);
	}
}