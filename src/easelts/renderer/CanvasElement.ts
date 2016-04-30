/**
 * Creates a Canvas element of the given size.
 *
 * @class CanvasElement
 * @param width {number} the width for the newly created canvas
 * @param height {number} the height for the newly created canvas
 */
export class CanvasElement
{
	/**
	 * The Canvas object that belongs to this CanvasBuffer.
	 *
	 * @member {HTMLCanvasElement}
	 */
	protected _domElement:HTMLCanvasElement;

	protected _width:number;
	protected _height:number;

	constructor(width:number, height:number, domElement:HTMLCanvasElement = document.createElement('canvas'))
	{
		this._domElement = domElement;

		this.setSize(width, height);
	}

	set width(value:number)
	{
		this.setWidth(value);
	}

	get width():number
	{
		return this._width;
	}

	public setWidth(value:number):void
	{
		this._width = value;
		this._domElement.width = value;
	}

	public getWidth():number
	{
		return this._width;
	}

	set height(value:number)
	{
		this.setHeight(value);
	}

	get height():number
	{
		return this._height;
	}

	public setHeight(value:number):void
	{
		this._height = value;
		this._domElement.height = value;
	}

	public getHeight():number
	{
		return this._height;
	}
	
	public getDomElement():HTMLCanvasElement
	{
		return this._domElement;
	}

	/**
	 *
	 * @param width
	 * @param height
	 */
	public setSize(width:number, height:number):void
	{
		this.setWidth(width);
		this.setHeight(height);
	}

	public getDomElement():HTMLCanvasElement
	{
		return this._domElement;
	}


	/**
	 *
	 */
	public destruct():void
	{
		this._domElement = null;
	}
}