import Shape = require('../display/Shape');
import Size = require('../geom/Size');

/**
 * @class BackgroundColor
 */
class SquareColor extends Shape
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
		constructor(color:string = '#000000', width:any = '100%', height:any = '100%', x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super(undefined, width, height, x, y, regX, regY);

		this._color = color;
	}

	private setColor():void
	{
		this.graphics.clear().beginFill(this._color).drawRect(0, 0, this.width, this.height);
	}

	public onResize(width:number, height:number):void
	{
		super.onResize(width, height);
		this.setColor();
	}
}

export  = SquareColor;