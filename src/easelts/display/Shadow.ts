/*
 * Shadow
 *
 * Copyright (c) 2010 gskinner.com, inc.
 * Copyright (c) 2015 Mient-jan Stelling
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

/**
 * @module EaselJS
 */

/**
 * This class encapsulates the properties required to define a shadow to apply to a {{#crossLink "DisplayObject"}}{{/crossLink}}
 * via its <code>shadow</code> property.
 *
 * <h4>Example</h4>
 *
 *      myImage.shadow = new createjs.Shadow("#000000", 5, 5, 10);
 *
 * @class Shadow
 * @constructor
 * @param {String} color The color of the shadow.
 * @param {Number} offsetX The x offset of the shadow in pixels.
 * @param {Number} offsetY The y offset of the shadow in pixels.
 * @param {Number} blur The size of the blurring effect.
 **/

export class Shadow
{
	/**
	 * An identity shadow object (all properties are set to 0).
	 * @property identity
	 * @type Shadow
	 * @static
	 * @final
	 * @readonly
	 **/
	public static identity:Shadow = null; // set at bottom of class definition.

	// public properties:
	/** The color of the shadow.
	 * property color
	 * @type String
	 * @default null
	 */
	public color:string = null;

	/** The x offset of the shadow.
	 * property offsetX
	 * @type Number
	 * @default 0
	 */
	public offsetX:number = 0;

	/** The y offset of the shadow.
	 * property offsetY
	 * @type Number
	 * @default 0
	 */
	public offsetY:number = 0;

	/** The blur of the shadow.
	 * property blur
	 * @type Number
	 * @default 0
	 */
	public blur:number = 0;

	// constructor:
	/**
	 * @class Shadow
	 * @constructor
	 * @protected
	 * @param {String} color The color of the shadow.
	 * @param {Number} offsetX The x offset of the shadow.
	 * @param {Number} offsetY The y offset of the shadow.
	 * @param {Number} blur The size of the blurring effect.
	 **/
	constructor(color:string, offsetX:number, offsetY:number, blur:number)
	{
		this.color = color;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.blur = blur;
	}

	// public methods:
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	public toString()
	{
		return "[Shadow]";
	}

	/**
	 * Returns a clone of this Shadow instance.
	 * @method clone
	 * @return {Shadow} A clone of the current Shadow instance.
	 **/
	public clone():Shadow
	{
		return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
	}
}

Shadow.identity = new Shadow("transparent", 0, 0, 0);

