/*
 * Bitmap
 * Visit http://createjs.com/ for documentation, updates and examples.
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

import DisplayObject = require('./DisplayObject');
import DisplayType = require('../enum/DisplayType');
import BitmapType = require('../enum/BitmapType');
import Rectangle = require('../geom/Rectangle');
import Signal = require('../../createts/event/Signal');
import Size = require('../geom/Size');

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
class Bitmap extends DisplayObject
{

	public static EVENT_ONLOAD:string = 'onload';
	// public properties:

	public type:DisplayType = DisplayType.BITMAP;
	public bitmapType:BitmapType = BitmapType.UNKNOWN;

	/**
	 * is Bitmap Loaded
	 * @type {boolean}
	 */
	public loaded:boolean = false;

	/**
	 * The image to render. This can be an Image, a Canvas, or a Video.
	 * @property image
	 * @type HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
	 **/
	public image:HTMLImageElement|HTMLCanvasElement|HTMLVideoElement = null;

	protected _imageNaturalWidth:number = null;
	protected _imageNaturalHeight:number = null;

	/**
	 * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
	 * @property sourceRect
	 * @type Rectangle
	 * @default null
	 */
	public sourceRect:Rectangle = null;

	/**
	 * Specifies an area of the destination wil be drawn to.
	 * @property destinationRect
	 * @type Rectangle
	 * @default null
	 */
	public destinationRect:Rectangle = null;

	/**
	 * @class Bitmap
	 * @constructor
	 * @param {string|HTMLImageElement} imageOrUri The source object or URI to an image to
	 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
	 * If it is a URI, a new Image object will be constructed and assigned to the `.image` property.
	 * @param {string|number} width
	 * @param {string|number} height
	 * @param {string|number} x
	 * @param {string|number} y
	 * @param {string|number} regX
	 * @param {string|number} regY
	 */
	constructor(imageOrUri?:HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|string, width:any = 0, height:any = 0, x?:any, y?:any, regX?:any, regY?:any)
	{
		super(width, height, x, y, regX, regY);

		var image:any;

		if(typeof imageOrUri == "string")
		{
			image = <HTMLImageElement> document.createElement("img");
			image.src = <string> imageOrUri;
		} else {
			image = imageOrUri;
		}


		var tagName:string = '';

		if( image ){
			tagName = image.tagName.toLowerCase();
		}



		switch(tagName)
		{
			case 'img':
			{
				this.image = <HTMLImageElement> image;
				this.bitmapType = BitmapType.IMAGE;

				if( this.image && (this.image['complete'] || this.image['getContext'] || this.image.readyState >= 2) ){
					this.onLoad();
				} else {
					( <HTMLImageElement> this.image).addEventListener('load', this.onLoad );
				}
				break;
			}

			case 'video':
			{
				this.image = <HTMLVideoElement> image;
				this.bitmapType = BitmapType.VIDEO;

				if( this.width == 0 || this.height == 0 ){
					throw new Error('width and height must be set when using canvas / video');
				}

				this.onLoad();
				break;
			}

			case 'canvas':
			{
				this.image = <HTMLCanvasElement> image;
				this.bitmapType = BitmapType.IMAGE;

				if( this.width == 0 || this.height == 0 ){
					throw new Error('width and height must be set when using canvas / video');
				}

				this.onLoad();
				break;
			}
		}

	}

	public onLoad = ():void =>
	{
		if(this.bitmapType == BitmapType.IMAGE )
		{
			this._imageNaturalWidth = (<HTMLImageElement>this.image).naturalWidth;
			this._imageNaturalHeight = (<HTMLImageElement>this.image).naturalHeight;

			if(!this.width)
			{
				this.width = this._imageNaturalWidth;
			}

			if(!this.height)
			{
				this.height = this._imageNaturalHeight;
			}
		} else {
			if(!this.width)
			{
				this.width = this.image.width;
			}

			if(!this.height)
			{
				this.height = this.image.height;
			}
		}

		this.isDirty = true;
		this.dispatchEvent(Bitmap.EVENT_ONLOAD);

		this.loaded = true;
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
		var hasContent = this.cacheCanvas || this.loaded;
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
		if(this.isVisible())
		{
			if(super.draw(ctx, ignoreCache))
			{
				return true;
			}

			var sourceRect = this.sourceRect;
			var destRect = this.destinationRect;

			if(sourceRect && !destRect)
			{
				ctx.drawImage(this.image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, 0, 0, this.width, this.height);
			}
			else if(!sourceRect && destRect)
			{
				ctx.drawImage(this.image, 0, 0, this.width, this.height, destRect.x, destRect.y, destRect.width, destRect.height);
			}
			else if(sourceRect && destRect)
			{
				ctx.drawImage(this.image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
			}
			else
			{
				if( this.bitmapType == BitmapType.IMAGE ){
					ctx.drawImage(this.image, 0, 0, this._imageNaturalWidth, this._imageNaturalHeight, 0, 0, this.width, this.height);
				} else {
					ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.width, this.height );
				}
			}


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
		var o = <{width:number;height:number;}> this.sourceRect || this.image;
		return this.loaded ? this._rectangle.setProperies(0, 0, o.width, o.height) : null;
	}

	/**
	 * Returns a clone of the Bitmap instance.
	 * @method clone
	 * @return {Bitmap} a clone of the Bitmap instance.
	 **/
	public clone():Bitmap
	{
		var o = new Bitmap(this.image);

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
		this.image = null;
		this.sourceRect = null;
		this.destinationRect = null;

		super.destruct();
	}

}
export = Bitmap;