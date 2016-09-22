import {Rectangle} from "../geom/Rectangle";
import {Texture} from "./Texture";
import {DisplayObject} from "./DisplayObject";

export class Sprite extends DisplayObject
{
	protected _texture:Texture;
	protected _uvRectangle:Rectangle;
	protected _uv:Uint16Array;

	constructor(texture:Texture, uv:Rectangle|Array<number> = [])
	{
		super();

		this._texture = texture;

		if(uv instanceof Rectangle)
		{
			this._uvRectangle = uv;
		} else {
			this._uvRectangle;
			this._uv = new Uint16Array(uv);
		}
	}

	public draw(ctx:CanvasRenderingContext2D, ignoreCache?:boolean):boolean
	{
		var rectangle = this._uvRectangle, texture = this._texture;

		if(texture.hasLoaded())
		{
			if(!rectangle){
				var uv = this._uv;
				var x = Math.min(uv[0], uv[6]) * texture.width,
					y = Math.min(uv[1], uv[7]) * texture.height,
					width = (Math.max(uv[2], uv[4]) - x) * texture.width,
					height = (Math.max(uv[6], uv[5]) - y) * texture.height;

				rectangle = this._uvRectangle = new Rectangle(x, y, width, height);
			}
		}

		texture.draw(ctx, rectangle.x, rectangle.y, rectangle.width, rectangle.height, 0, 0, this.width, this.height);

		return true;
	}

	public getTexture():Texture
	{
		return this._texture;
	}
}