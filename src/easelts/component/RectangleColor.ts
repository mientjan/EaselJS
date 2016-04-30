import {Shape} from "../display/Shape";
import {Size} from "../geom/Size";

/**
 * @class BackgroundColor
 */
export class RectangleColor extends Shape
{
	public set color(value:string)
	{
		this._color = value;
		this.setColor();
	}

	public get color()
	{
		return this._color;
	}

	private _color:string;

	/**
	 *
	 * @param {string} color
	 * @param {string|number} width
	 * @param {string|number} height
	 * @param {string|number} x
	 * @param {string|number} y
	 * @param {string|number} regX
	 * @param {string|number} regY
	 */
	constructor(color:string = '#000000', width:number|string = '100%', height:number|string = '100%', x:number|string = 0, y:number|string = 0, regX:number|string = 0, regY:number|string = 0)
	{
		super(void 0, width, height, x, y, regX, regY);

		this._color = color;
		this.setColor();
	}

	/**
	 * @method setColor
	 * @param {string} color
	 */
	public setColor(color:string = this._color):void
	{
		this._color = color;
		this.graphics.clear().beginFill(this._color).drawRect(0, 0, this.width, this.height);
	}

	/**
	 * @method onResize
	 * @param {width} width
	 * @param {height} height
	 */
	public onResize(width:number, height:number):void
	{
		super.onResize(width, height);
		this.setColor();
	}
}

