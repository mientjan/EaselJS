/*
 * The MIT License
 *
 * Copyright &copy; 2010-2014 three.js authors
 * Copyright &copy; 2014-2015 easelts
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import IVector2 = require('./../interface/IVector2');
import NumberUtil = require('./../util/NumberUtil');

/**
 * @module easelts
 */

/**
 * @class Vector2
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author Mient-jan Stelling
 */
class Vector2 implements IVector2
{
	public static radToDegree = 180 / Math.PI;
	public static degreeToRad = Math.PI / 180;

	public static getRadiansFromDegree(value:number):number
	{
		return value * Vector2.degreeToRad;
	}

	public static getDegreeFromRadians(value:number):number
	{
		return value * Vector2.radToDegree;
	}

	/**
	 * X position.
	 * @property x
	 * @type Number
	 **/

	/**
	 * Y position.
	 * @property y
	 * @type Number
	 **/

	public x:number;
	public y:number;

	constructor(x:number, y:number)
	{
		this.x = x;
		this.y = y;
	}

	public pair():number
	{
		var value = this.x << 16 & 0xffff0000 | this.y & 0x0000ffff;

		if(Number.MAX_VALUE < value)
		{
			throw 'pair created greater than allowed max uint value';
		}

		return value;
	}

	public depair(p:number):Vector2
	{
		return new Vector2(p >> 16 & 0xFFFF, p & 0xFFFF);
	}

	public set(x:number, y:number)
	{
		this.x = x;
		this.y = y;

		return this;
	}

	public setX(x:number):Vector2
	{
		this.x = x;
		return this;
	}

	public setY(y:number):Vector2
	{
		this.y = y;
		return this;
	}

	public setComponent(index:number, value:number):void
	{
		switch(index)
		{
			case 0:
				this.x = value;
				break;
			case 1:
				this.y = value;
				break;
			default:
				throw new Error('index is out of range: ' + index);

		}
	}

	public getComponent(index:number):number
	{
		switch(index)
		{
			case 0:
				return this.x;
			case 1:
				return this.y;
			default:
				throw new Error('index is out of range: ' + index);

		}
	}

	public copy(a:IVector2):Vector2
	{
		var v = this.clone();
		v.x = a.x;
		v.y = a.y;

		return v;
	}

	public add(a:IVector2):Vector2
	{
		var v = this.clone();
		v.x += a.x;
		v.y += a.y;

		return v;
	}

	public addVectors(a:IVector2, b:IVector2):Vector2
	{
		var v = this.clone();
		v.x = a.x + b.x;
		v.y = a.y + b.y;

		return v;
	}

	public addScalar(s:number):Vector2
	{
		var v = this.clone();
		v.x += s;
		v.y += s;

		return this;
	}

	public diff(a:IVector2):Vector2
	{
		var v = this.clone();
		v.x = (this.x + a.x) / 2;
		v.y = (this.y + a.y) / 2;

		return v;
	}

	public rotateByVector2(a:Vector2, radians:number):Vector2
	{
		var v = this.clone();

		//		radians = 1;
		//		console.log(radians);


		v.x = a.x + (( (this.x - a.x) * Math.cos(radians)) - ((this.y - a.y) * Math.sin(radians)) );
		v.y = a.y + (( (this.x - a.x) * Math.sin(radians)) + ((this.y - a.y) * Math.cos(radians)) );

		return v;
	}

	public sub(a:Vector2)
	{
		var v = this.clone();
		v.x -= a.x;
		v.y -= a.y;
		return v;
	}

	public subVectors(a:IVector2, b:IVector2)
	{
		var v = this.clone();
		v.x = a.x - b.x;
		v.y = a.y - b.y;

		return this;
	}

	public multiply(a:IVector2):Vector2
	{
		var v = this.clone();
		v.x *= a.x;
		v.y *= a.y;

		return v;
	}

	public multiplyScalar(s:number)
	{
		var v = this.clone();
		v.x *= s;
		v.y *= s;
		return v;
	}

	public divide(a:IVector2):Vector2
	{
		var v = this.clone();
		this.x /= a.x;
		this.y /= a.y;

		return this;
	}

	public divideScalar(s:number):Vector2
	{
		var v = this.clone();
		if(s !== 0)
		{
			var invScalar = 1 / s;

			v.x *= invScalar;
			v.y *= invScalar;
		}
		else
		{
			v.x = 0;
			v.y = 0;
		}

		return v;
	}

	public min(a:IVector2):Vector2
	{
		var v = this.clone();
		if(v.x > a.x)
		{
			v.x = a.x;
		}

		if(v.y > a.y)
		{
			v.y = a.y;
		}

		return v;

	}

	public max(a:IVector2):Vector2
	{
		var v = this.clone();
		if(v.x < a.x)
		{
			v.x = a.x;
		}

		if(v.y < a.y)
		{
			v.y = a.y;
		}

		return v;
	}

	public clamp(min:IVector2, max:IVector2)
	{
		var v = this.clone();
		// This function assumes min < max, if this assumption isn't true it will not operate correctly
		if(v.x < min.x)
		{
			v.x = min.x;
		}
		else if(v.x > max.x)
		{
			v.x = max.x;
		}

		if(v.y < min.y)
		{
			v.y = min.y;
		}
		else if(v.y > max.y)
		{
			v.y = max.y;
		}

		return v;
	}

	private __min:Vector2;
	private __max:Vector2;

	public clampScalar(minVal:number, maxVal:number):Vector2
	{
		if(this.__min === void 0)
		{
			this.__min = new Vector2(0, 0);
			this.__max = new Vector2(0, 0);
		}

		this.__min.set(minVal, minVal);
		this.__max.set(maxVal, maxVal);

		return this.clamp(this.__min, this.__max);
	}

	public floor():Vector2
	{
		var v = this.clone();
		v.x = Math.floor(this.x);
		v.y = Math.floor(this.y);

		return v;
	}

	public ceil():Vector2
	{
		var v = this.clone();
		v.x = Math.ceil(this.x);
		v.y = Math.ceil(this.y);

		return this;

	}

	public round():Vector2
	{
		var v = this.clone();
		v.x = Math.round(this.x);
		v.y = Math.round(this.y);

		return v;
	}

	public roundToZero():Vector2
	{
		var v = this.clone();
		v.x = ( this.x < 0 ) ? Math.ceil(this.x) : Math.floor(this.x);
		v.y = ( this.y < 0 ) ? Math.ceil(this.y) : Math.floor(this.y);

		return v;
	}

	public negate():Vector2
	{
		this.x = -this.x;
		this.y = -this.y;

		return this;
	}

	public dot(v):number
	{
		return this.x * v.x + this.y * v.y;
	}

	public lengthSq():number
	{
		return this.x * this.x + this.y * this.y;
	}

	public length():number
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	public normalize():Vector2
	{
		return this.divideScalar(this.length());
	}

	public distanceTo(v:Vector2):number
	{
		return Math.sqrt(this.distanceToSquared(v));
	}

	public distanceToSquared(v:Vector2):number
	{
		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	}

	public setLength(l:number):Vector2
	{
		var oldLength = this.length();

		if(oldLength !== 0 && l !== oldLength)
		{

			this.multiplyScalar(l / oldLength);
		}

		return this;

	}

	public lerp(v:Vector2, alpha:number):Vector2
	{
		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;
	}

	public equals(v:Vector2):boolean
	{
		return ( ( v.x === this.x ) && ( v.y === this.y ) );
	}

	public getAngleInRadians(v:Vector2):number
	{
		return Math.atan2(v.y - this.y, v.x - this.x)
	}

	public getAngleInDegrees(v:Vector2):number
	{
		return this.getAngleInRadians(v) * 180 / Math.PI;
	}

	public setFromArray(array:number[], offset:number = 0):Vector2
	{
		this.x = array[ offset ];
		this.y = array[ offset + 1 ];

		return this;
	}

	public toArray(array:number[] = [], offset:number = 0):number[]
	{
		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;

		return array;
	}

	public toString():string
	{
		return '[Vector2(x='+this.x+', y='+this.y+')]';
	}

	public clone():Vector2
	{
		return new Vector2(this.x, this.y);
	}

}

export = Vector2;