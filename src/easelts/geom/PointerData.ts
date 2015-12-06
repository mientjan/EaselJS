/*
 * Point
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

import IPoint from "./../../core/interface/IVector2";
import NumberUtil from "./../util/NumberUtil";

/**
 * @module easelts
 */

/**
 * Represents a point on a 2 dimensional x / y coordinate system.
 *
 * <h4>Example</h4>
 *
 *      var point = new createjs.Point(0, 100);
 *
 * @class Point
 * @param {Number} [x=0] X position.
 * @param {Number} [y=0] Y position.
 * @constructor
 **/
class PointerData implements IPoint
{
	/**
	 * X position.
	 * @property x
	 * @type Number
	 **/
	public x:number;

	/**
	 * Y position.
	 * @property y
	 * @type number
	 **/
	public y:number;

	/**
	 * @property inBounds
	 * @type boolean
	 */
	public inBounds:boolean = false;
	public target:any = null;
	posEvtObj:any = null;
	rawX = 0;
	rawY = 0;

	constructor(x:number, y:number)
	{
		this.x = x;
		this.y = y;
	}
}

export default PointerData;