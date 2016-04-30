import {Rectangle} from "../geom/Rectangle";
import {Texture} from "./Texture";
import {DisplayObject} from "./DisplayObject";

export class Sprite extends DisplayObject
{
	protected _texture:Texture;
	protected _uvRectangle:Rectangle;
	protected _uv:Array<number>;

	constructor(texture:Texture, uv:Rectangle|Array<number>)
	{
		this._texture = texture;

		if(uv instanceof Rectangle)
		{
			this._uvRectangle
		}
		
		this._uv = texture;
	}
}