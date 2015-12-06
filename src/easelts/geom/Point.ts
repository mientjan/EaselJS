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
class Point implements IPoint
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
	 * @type Number
	 **/
	public y:number;

	/**
	 * Initialization method. Can also be used to reinitialize the instance.
	 * @method initialize
	 * @param {Number} [x=0] X position.
	 * @param {Number} [y=0] Y position.
	 * @return {Point} This instance. Useful for chaining method calls.
	 */
	constructor(x:number, y:number)
	{
		this.x = x;
		this.y = y;
	}

	/**
	 *
	 * @param x
	 * @param y
	 * @returns {Point}
	 */
	public setXY(x:number,y:number):Point
	{
		this.x = x;
		this.y = y;

		return this;
	}

	/**
	 * Copies all properties from the specified point to this point.
	 * @method copy
	 * @param {Point} point The point to copy properties from.
	 * @return {Point} This point. Useful for chaining method calls.
	 */
	public copy(point):Point
	{
		return new Point(point.x, point.y);
	}

	public toNumber():number
	{
		return NumberUtil.pair(this.x, this.y);
	}

	public fromNumber(value:number):void
	{
		var xy = NumberUtil.depair(value);
		this.x = xy[0];
		this.y = xy[1];
	}

	/**
	 * Returns a clone of the Point instance.
	 * @method clone
	 * @return {Point} a clone of the Point instance.
	 **/
	public clone():Point
	{
		return new Point(this.x, this.y);
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	public toString():string
	{
		return "[Point (x=" + this.x + " y=" + this.y + ")]";
	}
}

export default Point;