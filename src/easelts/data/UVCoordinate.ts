import {Texture} from "../display/Texture";
import {Rectangle} from "../geom/Rectangle";
/**
 * Clockwise
 *
 * @class UVCoordinate
 */
export class UVCoordinate {

	public x0:number = 0.0;
	public y0:number = 0.0;
	public x1:number = 1.0;
	public y1:number = 0.0;
	public x2:number = 1.0;
	public y2:number = 1.0;
	public x3:number = 0.0;
	public y3:number = 1.0;

	constructor(arr?:Array<number>, offset?:number)
	{
		if(arr){
			this.setByArray(arr, offset);
		}
	}

	public setByArray(arr:Array<number>, offset:number = 0):void
	{
		if( arr.length < (offset + 8))
		{
			throw new Error('Array out of scope.');
		}

		this.x0 = arr[0];
		this.y0 = arr[1];

		this.x1 = arr[2];
		this.y1 = arr[3];

		this.x2 = arr[4];
		this.y2 = arr[5];

		this.x3 = arr[6];
		this.y3 = arr[7];
	}

	public setByTexture(texture:Texture, rectangle:Rectangle)
	{
		var tw = texture.width;
		var th = texture.height;

		this.x0 = rectangle.x / tw;
		this.y0 = rectangle.y / th;

		this.x1 = (rectangle.x + rectangle.width) / tw;
		this.y1 = rectangle.y / th;

		this.x2 = (rectangle.x + rectangle.width) / tw;
		this.y2 = (rectangle.y + rectangle.height) / th;

		this.x3 = rectangle.x / tw;
		this.y3 = (rectangle.y + rectangle.height) / th;
	}
}