/// <reference path="./Filter.ts" />
/// <reference path="../util/Methods.ts" />


/*
 * AlphaMapFilter
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
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

import * as Methods from "../util/Methods";
import Filter from "./Filter";

/**
 * Applies a greyscale alpha map image (or canvas) to the target, such that the alpha channel of the result will
 * be copied from the red channel of the map, and the RGB channels will be copied from the target.
 *
 * Generally, it is recommended that you use {{#crossLink "AlphaMaskFilter"}}{{/crossLink}}, because it has much
 * better performance.
 *
 * <h4>Example</h4>
 * This example draws a red->blue box, caches it, and then uses the cache canvas as an alpha map on a 100x100 image.
 *
 *       var box = new Shape();
 *       box.graphics.beginLinearGradientFill(["#ff0000", "#0000ff"], [0, 1], 0, 0, 0, 100)
 *       box.graphics.drawRect(0, 0, 100, 100);
 *       box.cache(0, 0, 100, 100);
 *
 *       var bmp = new Bitmap("path/to/image.jpg");
 *       bmp.filters = [
 *           new AlphaMapFilter(box.cacheCanvas)
 *       ];
 *       bmp.cache(0, 0, 100, 100);
 *       stage.addChild(bmp);
 *
 * See {{#crossLink "Filter"}}{{/crossLink}} for more information on applying filters.
 * @class AlphaMapFilter
 * @extends Filter
 * @constructor
 * @param {Image|HTMLCanvasElement} alphaMap The greyscale image (or canvas) to use as the alpha value for the
 * result. This should be exactly the same dimensions as the target.
 **/
class AlphaMapFilter extends Filter
{

	// constructor:
	constructor(alphaMap)
	{
		super();
		this.alphaMap = alphaMap;
	}

	// public properties:

	/**
	 * The greyscale image (or canvas) to use as the alpha value for the result. This should be exactly the same
	 * dimensions as the target.
	 * @property alphaMap
	 * @type Image|HTMLCanvasElement
	 **/
	public alphaMap:HTMLCanvasElement = null;

	// private properties:
	private _alphaMap = null;
	private _mapData:number[] = null;

	// public methods:

	public applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY):boolean
	{
		if(!this.alphaMap)
		{
			return true;
		}
		if(!this._prepAlphaMap())
		{
			return false;
		}
		targetCtx = targetCtx || ctx;
		if(targetX == null)
		{
			targetX = x;
		}
		if(targetY == null)
		{
			targetY = y;
		}

		try
		{
			var imageData = ctx.getImageData(x, y, width, height);
		} catch(e)
		{
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
		var data = imageData.data;
		var map = this._mapData;
		var l = data.length;
		for(var i = 0; i < l; i += 4)
		{
			data[i + 3] = map[i] || 0;
		}
		targetCtx.putImageData(imageData, targetX, targetY);
		return true;
	}

	/**
	 * Returns a clone of this object.
	 * @method clone
	 * @return {AlphaMapFilter} A clone of the current AlphaMapFilter instance.
	 **/
	public clone():AlphaMapFilter
	{
		return new AlphaMapFilter(this.alphaMap);
	}

	public toString():string
	{
		return "[AlphaMapFilter]";
	}

	// private methods:
	private _prepAlphaMap():boolean
	{
		if(!this.alphaMap)
		{
			return false;
		}
		if(this.alphaMap == this._alphaMap && this._mapData)
		{
			return true;
		}

		this._mapData = null;
		var map = this._alphaMap;
		var canvas = map;
		var ctx;
		if(map instanceof HTMLCanvasElement)
		{
			ctx = canvas.getContext("2d");
		}
		else
		{
			canvas = Methods.createCanvas ? Methods.createCanvas() : document.createElement("canvas");
			canvas.width = map.width;
			canvas.height = map.height;
			ctx = canvas.getContext("2d");
			ctx.drawImage(map, 0, 0);
		}

		try
		{
			var imgData = <ImageData> ctx.getImageData(0, 0, map.width, map.height);
			this._mapData = <any> imgData.data;
			return true;
		} catch(e)
		{
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}

	}
}

export default AlphaMapFilter;
