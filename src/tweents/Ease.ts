/*
 * Ease
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

/**
 * @module tweents
 */

/**
 * The Ease class provides a collection of easing functions for use with TweenJS. It does not use the standard 4 param
 * easing signature. Instead it uses a single param which indicates the current linear ratio (0 to 1) of the tween.
 *
 * Most methods on Ease can be passed directly as easing functions:
 *
 *      Tween.get(target).to({x:100}, 500, Ease.linear);
 *
 * However, methods beginning with "get" will return an easing function based on parameter values:
 *
 *      Tween.get(target).to({y:200}, 500, Ease.getPowIn(2.2));
 *
 * Please see the <a href="http://www.createjs.com/#!/TweenJS/demos/sparkTable">spark table demo</a> for an overview
 * of the different ease types on <a href="http://tweenjs.com">TweenJS.com</a>.
 *
 * <i>Equations derived from work by Robert Penner.</i>
 * @class Ease
 * @static
 **/
export class Ease
{

	constructor()
	{
		throw "Ease cannot be instantiated.";
	}

	/**
	 * @method linear
	 * @static
	 **/
	public static linear = function(t)
	{
		return t;
	}

	/**
	 * Identical to linear.
	 * @method none
	 * @static
	 **/
	public static none = Ease.linear;

	/**
	 * Mimics the simple -100 to 100 easing in Flash Pro.
	 * @method get
	 * @param amount A value from -1 (ease in) to 1 (ease out) indicating the strength and direction of the ease.
	 * @static
	 **/
	public static get(amount)
	{
		if(amount < -1)
		{
			amount = -1;
		}
		if(amount > 1)
		{
			amount = 1;
		}
		return function(t)
		{
			if(amount == 0)
			{
				return t;
			}
			if(amount < 0)
			{
				return t * (t * -amount + 1 + amount);
			}
			return t * ((2 - t) * amount + (1 - amount));
		}
	}

	/**
	 * Configurable exponential ease.
	 * @method getPowIn
	 * @param pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 **/
	public static getPowIn(pow)
	{
		return function(t)
		{
			return Math.pow(t, pow);
		}
	}


	/**
	 * Configurable exponential ease.
	 * @method getPowOut
	 * @param pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 **/
	public static getPowOut(pow)
	{
		return function(t)
		{
			return 1 - Math.pow(1 - t, pow);
		}
	}


	/**
	 * Configurable exponential ease.
	 * @method getPowInOut
	 * @param pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 **/
	public static getPowInOut(pow)
	{
		return function(t)
		{
			if((t *= 2) < 1)
			{
				return 0.5 * Math.pow(t, pow);
			}
			return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
		}
	}


	/**
	 * @method quadIn
	 * @static
	 **/
	public static quadIn = Ease.getPowIn(2);
	/**
	 * @method quadOut
	 * @static
	 **/
	public static quadOut = Ease.getPowOut(2);
	/**
	 * @method quadInOut
	 * @static
	 **/
	public static quadInOut = Ease.getPowInOut(2);


	/**
	 * @method cubicIn
	 * @static
	 **/
	public static cubicIn = Ease.getPowIn(3);
	/**
	 * @method cubicOut
	 * @static
	 **/
	public static cubicOut = Ease.getPowOut(3);
	/**
	 * @method cubicInOut
	 * @static
	 **/
	public static cubicInOut = Ease.getPowInOut(3);


	/**
	 * @method quartIn
	 * @static
	 **/
	public static quartIn = Ease.getPowIn(4);
	/**
	 * @method quartOut
	 * @static
	 **/
	public static quartOut = Ease.getPowOut(4);
	/**
	 * @method quartInOut
	 * @static
	 **/
	public static quartInOut = Ease.getPowInOut(4);


	/**
	 * @method quintIn
	 * @static
	 **/
	public static quintIn = Ease.getPowIn(5);
	/**
	 * @method quintOut
	 * @static
	 **/
	public static quintOut = Ease.getPowOut(5);
	/**
	 * @method quintInOut
	 * @static
	 **/
	public static quintInOut = Ease.getPowInOut(5);


	/**
	 * @method sineIn
	 * @static
	 **/
	public static sineIn(t)
	{
		return 1 - Math.cos(t * Math.PI / 2);
	}

	/**
	 * @method sineOut
	 * @static
	 **/
	public static sineOut(t)
	{
		return Math.sin(t * Math.PI / 2);
	}

	/**
	 * @method sineInOut
	 * @static
	 **/
	public static sineInOut(t)
	{
		return -0.5 * (Math.cos(Math.PI * t) - 1)
	}


	/**
	 * Configurable "back in" ease.
	 * @method getBackIn
	 * @param amount The strength of the ease.
	 * @static
	 **/
	public static getBackIn(amount)
	{
		return function(t)
		{
			return t * t * ((amount + 1) * t - amount);
		}
	}

	/**
	 * @method backIn
	 * @static
	 **/
	public static backIn = Ease.getBackIn(1.7);

	/**
	 * Configurable "back out" ease.
	 * @method getBackOut
	 * @param amount The strength of the ease.
	 * @static
	 **/
	public static getBackOut = function(amount)
	{
		return function(t)
		{
			return (--t * t * ((amount + 1) * t + amount) + 1);
		}
	}
	/**
	 * @method backOut
	 * @static
	 **/
	public static backOut = Ease.getBackOut(1.7);

	/**
	 * Configurable "back in out" ease.
	 * @method getBackInOut
	 * @param amount The strength of the ease.
	 * @static
	 **/
	public static getBackInOut = function(amount)
	{
		amount *= 1.525;
		return function(t)
		{
			if((t *= 2) < 1)
			{
				return 0.5 * (t * t * ((amount + 1) * t - amount));
			}
			return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
		}
	}
	/**
	 * @method backInOut
	 * @static
	 **/
	public static backInOut = Ease.getBackInOut(1.7);


	/**
	 * @method circIn
	 * @static
	 **/
	public static circIn = function(t)
	{
		return -(Math.sqrt(1 - t * t) - 1);
	}

	/**
	 * @method circOut
	 * @static
	 **/
	public static circOut = function(t)
	{
		return Math.sqrt(1 - (--t) * t);
	}

	/**
	 * @method circInOut
	 * @static
	 **/
	public static circInOut = function(t)
	{
		if((t *= 2) < 1)
		{
			return -0.5 * (Math.sqrt(1 - t * t) - 1);
		}
		return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
	}

	/**
	 * @method bounceIn
	 * @static
	 **/
	public static bounceIn = function(t)
	{
		return 1 - Ease.bounceOut(1 - t);
	}

	/**
	 * @method bounceOut
	 * @static
	 **/
	public static bounceOut = function(t)
	{
		if(t < 1 / 2.75)
		{
			return (7.5625 * t * t);
		}
		else if(t < 2 / 2.75)
		{
			return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
		}
		else if(t < 2.5 / 2.75)
		{
			return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
		}
		else
		{
			return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
		}
	}

	/**
	 * @method bounceInOut
	 * @static
	 **/
	public static bounceInOut(t)
	{
		if(t < 0.5)
		{
			return Ease.bounceIn(t * 2) * .5;
		}
		return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
	}


	/**
	 * Configurable elastic ease.
	 * @method getElasticIn
	 * @param amplitude
	 * @param period
	 * @static
	 **/
	public static getElasticIn(amplitude, period)
	{
		var pi2 = Math.PI * 2;
		return function(t)
		{
			if(t == 0 || t == 1)
			{
				return t;
			}
			var s = period / pi2 * Math.asin(1 / amplitude);
			return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
		}
	}

	/**
	 * @method elasticIn
	 * @static
	 **/
	public static elasticIn = Ease.getElasticIn(1, 0.3);

	/**
	 * Configurable elastic ease.
	 * @method getElasticOut
	 * @param amplitude
	 * @param period
	 * @static
	 **/
	public static getElasticOut(amplitude, period)
	{
		var pi2 = Math.PI * 2;
		return function(t)
		{
			if(t == 0 || t == 1)
			{
				return t;
			}
			var s = period / pi2 * Math.asin(1 / amplitude);
			return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
		}
	}

	/**
	 * @method elasticOut
	 * @static
	 **/
	public static elasticOut = Ease.getElasticOut(1, 0.3);

	/**
	 * Configurable elastic ease.
	 * @method getElasticInOut
	 * @param amplitude
	 * @param period
	 * @static
	 **/
	public static getElasticInOut(amplitude, period)
	{
		var pi2 = Math.PI * 2;
		return function(t)
		{
			var s = period / pi2 * Math.asin(1 / amplitude);
			if((t *= 2) < 1)
			{
				return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
			}
			return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
		}
	}

	/**
	 * @method elasticInOut
	 * @static
	 **/
	public static elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
}

