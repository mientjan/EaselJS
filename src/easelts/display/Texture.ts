import ILoadable from "../interface/ILoadable";
import Promise from "../../core/util/Promise";
import Size from "../geom/Size";
import MathUtil from "../../core/math/MathUtil";

/**
 * Base class For all bitmap type drawing.
 *
 * @class Texture
 */
class Texture implements ILoadable<Texture>
{
	public static createFromString(source:string, autoload:boolean = false):Texture
	{
		var img = document.createElement('img');
		return new Texture(img, autoload);
	}

	protected source:HTMLCanvasElement|HTMLImageElement;
	protected webGLTexture:WebGLTexture = null;

	public width:number = 0;
	public height:number = 0;

	protected _loadPromise:Promise<Texture> = null;
	protected _hasLoaded:boolean = false;

	constructor(source:HTMLCanvasElement|HTMLImageElement, autoload:boolean = false)
	{
		this.source = source;

		if(autoload)
		{
			this.load();
		}
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public hasLoaded():boolean
	{
		return this._hasLoaded;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	public isLoading():boolean
	{
		return this._loadPromise != null;
	}

	public load(onProgress?:(progress:number) => any):Promise<Texture>
	{
		if(!this._hasLoaded)
		{
			if(!this._loadPromise)
			{
				this._loadPromise = new Promise<Texture>((resolve:(result:Texture) => any, reject:() => any) =>
					this._load((scope) =>
					{
						resolve(scope);
						this._loadPromise = null;
					}, reject)
				);
			}

			return this._loadPromise;
		}

		if(onProgress)
		{
			onProgress(1);
		}
		return Promise.resolve(this);
	}

	protected _load(onComplete:(result:Texture) => any, onError?:() => any):void
	{
		var bitmap:any = this.source;
		var tagName:string = '';

		if(bitmap)
		{
			tagName = bitmap.tagName.toLowerCase();
		}

		switch(tagName)
		{
			case 'img':
			{
				if((bitmap['complete'] || bitmap['readyState'] >= 2))
				{
					this.initImage(bitmap);
				}
				else
				{
					( <HTMLImageElement> bitmap).onload = (function(scope){
						return function(ev:Event)
						{
							scope.initImage(this);
							onComplete(scope);
						}
					})(this);

					if(onError)
					{
						( <HTMLImageElement> bitmap).onerror = <any> onerror;
					}
				}
				break;
			}

			case 'canvas':
			{
				this.initCanvas(bitmap);
				onComplete(this);
				break;
			}
		}
	}

	protected initImage(image:HTMLImageElement):void
	{
		this.width = image.naturalWidth;
		this.height = image.naturalHeight;

		this._hasLoaded = true;
	}


	protected initCanvas(canvas:HTMLCanvasElement):void
	{
		this.width = canvas.width;
		this.height = canvas.height;

		this._hasLoaded = true;
	}

	public getWidth():number
	{
		return this.width;
	}

	public getHeight():number
	{
		return this.height;
	}

	public draw(ctx:CanvasRenderingContext2D, sx:number, sy:number, sw:number, sh:number, dx:number, dy:number, dw:number, dh:number):boolean
	{
		ctx.drawImage(<HTMLImageElement> this.source, sx, sy, sw, sh, dx, dy, dw, dh);
		return true;
	}

	/**
	 * @method drawWebGL
	 * @alpha
	 * @param ctx
	 * @param sx
	 * @param sy
	 * @param sw
	 * @param sh
	 * @param dx
	 * @param dy
	 * @param dw
	 * @param dh
	 * @returns {boolean}
	 */
	public drawWebGL(ctx:WebGLRenderingContext, sx:number, sy:number, sw:number, sh:number, dx:number, dy:number, dw:number, dh:number):boolean
	{
		//ctx.drawImage( <HTMLImageElement> this.bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
		return true;
	}

	public bindTexture(ctx:WebGLRenderingContext)
	{
		var bitmap = this.source;

		if(this.hasLoaded())
		{
			if( !(MathUtil.isPowerOfTwo(this.width) && MathUtil.isPowerOfTwo(this.height)) )
			{
				if(console && console.warn) console.warn(`Texture ${this.width}x${this.height} is not power of 2`, this)
			}

			// Create and use a new texture for this image if it doesn't already have one:
			if(!this.webGLTexture)
			{
				var texture:WebGLTexture = this.webGLTexture = ctx.createTexture();
				ctx.bindTexture(ctx.TEXTURE_2D, texture);
				ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, <any> bitmap);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
			}

			return texture;
		}
	}

	/**
	 * returns source size of texture
	 * @returns {Size}
	 */
	public getSize():Size
	{
		return new Size(this.width, this.height);
	}

	public destruct()
	{
		this.source = null;
		if(this.webGLTexture)
		{
			delete this.webGLTexture;
		}

		this._loadPromise = null;
	}
}

export default Texture;