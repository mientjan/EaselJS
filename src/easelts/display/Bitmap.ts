/*
 * Bitmap
 *
 * Copyright (c) 2010 gskinner.com, inc.
 * Copyright (c) 2014-2015 Mient-jan Stelling.
 * Copyright (c) 2015 mediamonks.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import {DisplayObject} from "./DisplayObject";
import {Texture} from "./Texture";
import {Promise} from "../../core/util/Promise";
import {DisplayType} from "../enum/DisplayType";
import {BitmapType} from "../enum/BitmapType";
import {Rectangle} from "../geom/Rectangle";
import {Signal} from "../../core/event/Signal";
import {Size} from "../geom/Size";
import {ILoadable} from "../../core/interface/ILoadable";

/**
 * A Bitmap represents an Image, Canvas, or Video in the display list. A Bitmap can be instantiated using an existing
 * HTML element, or a string.
 *
 * <h4>Example</h4>
 *
 *      var bitmap = new createjs.Bitmap("imagePath.jpg");
 *
 * <strong>Notes:</strong>
 * <ol>
 *     <li>When a string path or image tag that is not yet loaded is used, the stage may need to be redrawn before it
 *      will be displayed.</li>
 *     <li>Bitmaps with an SVG source currently will not respect an alpha value other than 0 or 1. To get around this,
 *     the Bitmap can be cached.</li>
 *     <li>Bitmaps with an SVG source will taint the canvas with cross-origin data, which prevents interactivity. This
 *     happens in all browsers except recent Firefox builds.</li>
 *     <li>Images loaded cross-origin will throw cross-origin security errors when interacted with using a mouse, using
 *     methods such as `getObjectUnderPoint`, or using filters, or caching. You can get around this by setting
 *     `crossOrigin` flags on your images before passing them to EaselJS, eg: `img.crossOrigin="Anonymous";`</li>
 * </ol>
 *
 * @class Bitmap
 * @extends DisplayObject
 * @constructor
 * @author Mient-jan Stelling <mientjan.stelling@gmail.com>
 * @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
 * If it is a URI, a new Image object will be constructed and assigned to the .image property.
 **/
export class Bitmap extends DisplayObject implements ILoadable<Bitmap>
{
	public type:DisplayType = DisplayType.BITMAP;

	/**
	 * The image to render. This can be an Image, a Canvas, or a Video.
	 * @property image
	 * @type HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
	 **/
	public source:Texture = null;

	// protected _imageNaturalWidth:number = null;
	// protected _imageNaturalHeight:number = null;
	protected _isTiled:boolean = false;

	/**
	 * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
	 * @property sourceRect
	 * @type Rectangle
	 * @default null
	 */
	public sourceRect:Rectangle = null;

	/**
	 * Specifies an area of the destination will be drawn to.
	 * @property destinationRect
	 * @type Rectangle
	 * @default null
	 */
	public destinationRect:Rectangle = null;

	/**
	 * @class Bitmap
	 * @constructor
	 * @param {HTMLImageElement|HTMLCanvasElement|string} imageOrUri The source object or URI to an image to
	 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
	 * If it is a URI, a new Image object will be constructed and assigned to the `.image` property.
	 * @param {string|number} width
	 * @param {string|number} height
	 * @param {string|number} x
	 * @param {string|number} y
	 * @param {string|number} regX
	 * @param {string|number} regY
	 */
	constructor(imageOrUri?:HTMLImageElement|HTMLCanvasElement|Texture|string, width:any = 0, height:any = 0, x?:any, y?:any, regX?:any, regY?:any)
	{
		super(width, height, x, y, regX, regY);

		if(typeof imageOrUri == 'string')
		{
			this.source = Texture.createFromString( <string> imageOrUri, false);
		}
		else if(imageOrUri instanceof Texture)
		{
			this.source = imageOrUri;
		}
		else
		{
			this.source = new Texture( <HTMLImageElement|HTMLCanvasElement> imageOrUri);
		}

		this.source.load();
	}

	public hasLoaded():boolean
	{
		return this.source.hasLoaded();
	}

	/**
	 * @method load
	 * @param onProgress
	 * @returns {Promise<Bitmap>}
	 */
	public load(onProgress:(progress:number)=>any):Promise<Bitmap>
	{
		return this.source.load(onProgress).then(() => {
			return this;
		});
	}

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 *
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	public isVisible():boolean
	{
		var hasContent = this.cacheCanvas || this.hasLoaded();
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 * @return {Boolean}
	 **/
	public draw(ctx:CanvasRenderingContext2D, ignoreCache:boolean):boolean
	{
		if(super.draw(ctx, ignoreCache))
		{
			return true;
		}

		var sourceRect = this.sourceRect;
		var destRect = this.destinationRect;
		var width = this.width;
		var height = this.height;
		var source = this.source;

		if(sourceRect && !destRect)
		{
			source.draw(ctx, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, 0, 0, width, height );
		}
		else if(!sourceRect && destRect)
		{
			source.draw(ctx, 0, 0, source.getWidth(), source.getHeight(), destRect.x, destRect.y, destRect.width, destRect.height );
		}
		else if(sourceRect && destRect)
		{
			source.draw(ctx, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height );
		}
		else
		{
			if(!width)
			{
				width = source.width;
			}

			if(!height)
			{
				height = source.height;
			}

			source.draw(ctx, 0, 0, source.getWidth(), source.getHeight(), 0, 0, width, height );
		}

		return true;
	}

	/**
	 * Docced in superclass.
	 */
	public getBounds():Rectangle
	{
		var rect = super.getBounds();
		if(rect)
		{
			return rect;
		}
		var obj = <{width:number;height:number;}> this.sourceRect || this.source;
		return this.hasLoaded() ? this._rectangle.setProperies(0, 0, obj.width, obj.height) : null;
	}

	/**
	 * returns source size of texture
	 * @returns {Size}
	 */
	public getImageSize():Size
	{
		if(!this.hasLoaded())
		{
			throw new Error('bitmap has not yet been loaded, getImageSize can only be called when bitmap has been loaded');
		}

		return this.source.getSize();
	}

	/**
	 * Returns a clone of the Bitmap instance.
	 * @method clone
	 * @return {Bitmap} a clone of the Bitmap instance.
	 **/
	public clone():Bitmap
	{
		var o = new Bitmap(this.source);

		if(this.sourceRect) o.sourceRect = this.sourceRect.clone();
		if(this.destinationRect) o.destinationRect = this.destinationRect.clone();

		this.cloneProps(o);

		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	public toString():string
	{
		return "[Bitmap (name=" + this.name + ")]";
	}

	public destruct():void
	{
		this.source.destruct();
		this.source = null;
		this.sourceRect = null;
		this.destinationRect = null;

		super.destruct();
	}
}