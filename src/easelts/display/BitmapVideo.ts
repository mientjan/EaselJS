/*
 * Bitmap
 *
 * Copyright (c) 2015 Mient-jan Stelling
 * Copyright (c) 2015 MediaMonksB.V
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
import Rectangle = require('../geom/Rectangle');
import Size = require('../geom/Size');

class BitmapVideo extends DisplayObject
{
	public static EVENT_ONLOAD = 'onload';

	public type:DisplayType = DisplayType.BITMAP;
	public loaded:boolean = true;

	/**
	 * The image to render. This can be an Image, a Canvas, or a Video.
	 * @property image
	 * @type Image | HTMLCanvasElement | HTMLVideoElement
	 **/
	public video:HTMLVideoElement = null;

	/**
	 * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
	 * @property sourceRect
	 * @type Rectangle
	 * @default null
	 */
	public sourceRect:Rectangle = null;

	/**
	 * Initialization method.
	 * @method initialize
	 * @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
	 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
	 * If it is a URI, a new Image object will be constructed and assigned to the `.image` property.
	 * @protected
	 **/

	/**
	 * @class Bitmap
	 * @constructor
	 * @param {string|HTMLImageElement} imageOrUri
	 * @param {string|number} width
	 * @param {string|number} height
	 * @param {string|number} x
	 * @param {string|number} y
	 * @param {string|number} regX
	 * @param {string|number} regY
	 */
	constructor(videoElement:HTMLVideoElement, width:any = 0, height:any = 0, x?:any, y?:any, regX?:any, regY?:any)
	{
		super(width, height, x, y, regX, regY);

		this.video = videoElement;
	}

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 *
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	public isVisible()
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
	public draw(ctx, ignoreCache)
	{

		if(super.draw(ctx, ignoreCache))
		{
			return true;
		}

		if(this.loaded)
		{
			var rect = this.sourceRect;
			if(rect)
			{
				ctx.drawImage(this.video, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
			}
			else
			{
				ctx.drawImage(this.video, 0, 0);
			}
		}

		return true;
	}

	public getBounds()
	{
		var rect = super.getBounds();
		if(rect)
		{
			return rect;
		}
		var o = <{width:number;height:number;
		}> this.sourceRect || this.video;
		return this.loaded ? this._rectangle.setProperies(0, 0, o.width, o.height) : null;
	}

	public clone()
	{
		var o = new BitmapVideo(this.video);
		if(this.sourceRect)
		{
			o.sourceRect = this.sourceRect.clone();
		}
		this.cloneProps(o);
		return o;
	}

	public toString()
	{
		return "[Bitmap (name=" + this.name + ")]";
	}

}
export = BitmapVideo;