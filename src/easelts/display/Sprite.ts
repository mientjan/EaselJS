import {Rectangle} from "../geom/Rectangle";
import {Texture} from "./Texture";
export class Sprite
{
	protected _texture:Texture;
	protected _uv:Rectangle;
	
	constructor(texture:Texture, uv:Rectangle|Array<number>)
	{

	}
}