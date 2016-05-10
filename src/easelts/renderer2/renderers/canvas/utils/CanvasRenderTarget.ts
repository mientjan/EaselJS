/**
 * Creates a Canvas element of the given size.
 *
 * @class
 * @memberof PIXI
 * @param width {number} the width for the newly created canvas
 * @param height {number} the height for the newly created canvas
 */
export class CanvasRenderTarget
{


	/**
	 * The Canvas object that belongs to this CanvasRenderTarget.
	 *
	 * @member {HTMLCanvasElement}
	 */
	public canvas = document.createElement('canvas');

	/**
	 * A CanvasRenderingContext2D object representing a two-dimensional rendering context.
	 *
	 * @member {CanvasRenderingContext2D}
	 */
	public context = this.canvas.getContext('2d');

	public resolution:number;

	constructor(width:number, height:number, resolution:number)
	{
		this.resolution = resolution || 1;

		this.resize(width, height);
	}

	/**
	 * The width of the canvas buffer in pixels.
	 *
	 * @member {number}
	 * @memberof PIXI.CanvasRenderTarget#
	 */
	get width():number
	{
		return this.canvas.width;
	}

	set width(value:number)
	{
		this.canvas.width = value;
	}

	/**
	 * The height of the canvas buffer in pixels.
	 *
	 * @member {number}
	 * @memberof PIXI.CanvasRenderTarget#
	 */
	get height():number
	{
		return this.canvas.height;
	}

	set height(value:number)
	{
		this.canvas.height = value;
	}

	/**
	 * Clears the canvas that was created by the CanvasRenderTarget class.
	 *
	 * @private
	 */
	public clear():void
	{
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Resizes the canvas to the specified width and height.
	 *
	 * @param width {number} the new width of the canvas
	 * @param height {number} the new height of the canvas
	 */
	public resize(width:number, height:number):void
	{

		this.canvas.width = width * this.resolution;
		this.canvas.height = height * this.resolution;
	}

	/**
	 * Destroys this canvas.
	 *
	 */
	public destroy():void
	{
		this.context = null;
		this.canvas = null;
	}
}