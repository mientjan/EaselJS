import {CanvasElement} from "./CanvasElement";
import {Rectangle} from "../geom/Rectangle";

export interface ICanvas2DElementOptions {
	domElement?:HTMLCanvasElement;
	transparent:boolean;
	backgroundColor?:string;
}

export enum Canvas2DElementQuality {
	LOW, NORMAL
}

/**
 * Creates a Canvas element of the given size.
 *
 * @class CanvasElement
 * @param width {number} the width for the newly created canvas
 * @param height {number} the height for the newly created canvas
 */
export class Canvas2DElement extends CanvasElement
{
	protected _context:CanvasRenderingContext2D;
	protected _transparent:boolean;
	protected _backgroundColor:string;
	protected _quality:Canvas2DElementQuality;

	constructor(width:number, height:number, options:ICanvas2DElementOptions = {
		transparent:true,
		backgroundColor:'#000000'
	})
	{
		if(!options.transparent && !options.backgroundColor)
		{
			throw new Error('options.backgroundColor is required when transparent is false or not defined');
		}

		super(width, height, options.domElement);

		this._transparent = options.transparent;
		this._backgroundColor = options.backgroundColor;

		this._context = <CanvasRenderingContext2D> this._domElement.getContext('2d', {alpha: this._transparent});

		this.setSize(width, height);
	}

	public draw(ctx:CanvasRenderingContext2D, ignoreCache?:boolean):void
	{
		var w = this._width, h = this._height;
		ctx.drawImage(this._domElement, 0, 0, w, h, 0, 0, w, h);
	}

	public reset():void
	{
		this._context.setTransform(1, 0, 0, 1, 0, 0);
		this.clear();
	}

	public clear():void
	{
		if(this._transparent)
		{
			this._context.clearRect(0, 0, this._width, this._height);
		} else {
			this._context.fillStyle = this._backgroundColor;
			this._context.fillRect(0, 0, this._width, this._height);
		}
	}

	/**
	 * @method toDataURL
	 * @param backgroundColor
	 * @param mimeType The standard MIME type for the image format to return. If you do not specify this parameter, the default value is a PNG format image.
	 * @param quality Quality of the image 0.1 low, 1.0 high
	 * @returns {string}
	 */
	public toDataURL(backgroundColor?:string, mimeType:string = "image/png", quality:number = 1.0):string
	{
		var ctx = this.getContext();
		var w = this._width;
		var h = this._height;

		var data;

		if(backgroundColor)
		{

			//get the current ImageData for the canvas.
			data = ctx.getImageData(0, 0, w, h);

			//store the current globalCompositeOperation
			var compositeOperation = ctx.globalCompositeOperation;

			//set to draw behind current content
			ctx.globalCompositeOperation = "destination-over";

			//set background color
			ctx.fillStyle = backgroundColor;

			//draw background on entire canvas
			ctx.fillRect(0, 0, w, h);
		}

		//get the image data from the canvas
		var dataURL = this._domElement.toDataURL(mimeType, quality);

		if(backgroundColor)
		{
			//clear the canvas
			ctx.clearRect(0, 0, w + 1, h + 1);

			//restore it with original settings
			ctx.putImageData(data, 0, 0);

			//reset the globalCompositeOperation to what it was
			ctx.globalCompositeOperation = compositeOperation;
		}

		return dataURL;
	}

	/**
	 * @method getImageData
	 * @returns {Rectangle}
	 */
	public getImageData(x:number = 0, y:number = 0, width:number = this._width, height:number = this._height):ImageData
	{
		return this._context.getImageData(x, y, width, height);
	}

	/**
	 * @method getDrawBounds
	 * @returns {Rectangle}
	 */
	public getDrawBounds():Rectangle
	{
		var width = Math.ceil(this._width);
		var height = Math.ceil(this._height);

		var pixels = this.getImageData();

		var data = pixels.data,
			x0 = width,
			y0 = height,
			x1 = 0,
			y1 = 0;

		for(var i = 3, l = data.length, p = 0; i < l; i += 4, ++p)
		{
			var px = p % width;
			var py = Math.floor(p / width);

			if(data[i - 3] > 0 ||
				data[i - 2] > 0 ||
				data[i - 1] > 0 ||
				data[i] > 0)
			{
				x0 = Math.min(x0, px);
				y0 = Math.min(y0, py);
				x1 = Math.max(x1, px);
				y1 = Math.max(y1, py);
			}
		}

		return new Rectangle(x0, y0, x1 - x0, y1 - y0);
	}

	public getContext():CanvasRenderingContext2D
	{
		return this._context;
	}

	/**
	 *
	 * @param width
	 * @param height
	 */
	public setSize(width:number, height:number):void
	{
		this._domElement.width = this._width = width;
		this._domElement.height = this._height = height;
		this.setQuality(this._quality);
	}

	public setWidth(value:number):void
	{
		super.setWidth(value);
		this.setQuality(this._quality);
	}

	public setHeight(value:number):void
	{
		super.setHeight(value);
		this.setQuality(this._quality);
	}

	/**
	 * @method setQuality
	 * @param {string} name
	 */
	public setQuality(name:Canvas2DElementQuality):void
	{
		var ctx = this._context;

		switch(name)
		{
			case Canvas2DElementQuality.LOW:
			{
				this._quality = name;
				ctx['mozImageSmoothingEnabled'] = false;
				ctx['webkitImageSmoothingEnabled'] = false;
				ctx['msImageSmoothingEnabled'] = false;
				ctx['imageSmoothingEnabled'] = false;
				break;
			}

			case Canvas2DElementQuality.NORMAL:
			{
				this._quality = name;
				ctx['mozImageSmoothingEnabled'] = true;
				ctx['webkitImageSmoothingEnabled'] = true;
				ctx['msImageSmoothingEnabled'] = true;
				ctx['imageSmoothingEnabled'] = true;
				break;
			}
		}

	}

	/**
	 *
	 */
	public destruct():void
	{
		this._context = null;
		this._domElement = null;
	}
}