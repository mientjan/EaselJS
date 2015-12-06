import IVector2 from "../interface/IVector2";
import IVector3 from "../interface/IVector3";

/**
 * @author Mient-jan Stelling
 * @class MathUtil
 */
class MathUtil
{

	private static degreeToRadiansFactor = Math.PI / 180;
	private static radianToDegreesFactor = 180 / Math.PI;

	//
	/**
	 * Clamp value to range <a, b>
	 * @method clamp
	 * @param {number} x
	 * @param {number} a
	 * @param {number} b
	 * @returns {number}
	 */
	public static clamp(x:number, a:number, b:number):number
	{
		return ( x < a ) ? a : ( ( x > b ) ? b : x );
	}

	/**
	 * Clamp value to range <a, inf)
	 * @method clampBottom
	 * @param {number} x
	 * @param {number} a
	 * @returns {number}
	 */
	public static clampBottom(x:number, a:number):number
	{
		return x < a ? a : x;
	}

	public static contains(value:number, index:number, margin:number):boolean
	{
		var bool = false;
		if(index - margin < value && index + margin > value)
		{
			bool = true
		}

		return bool;
	}

	public static containsVector2(value:IVector2, index:IVector2, margin:IVector2):boolean
	{
		var bool = false;

		if( MathUtil.contains(value.x, index.x, margin.x)
				&& MathUtil.contains(value.y, index.y, margin.y))
		{
			bool = true
		}

		return bool;
	}

	public static containsVector3(value:IVector3, index:IVector3, margin:IVector3):boolean
	{
		var bool = false;

		if( MathUtil.contains(value.x, index.x, margin.x)
				&& MathUtil.contains(value.y, index.y, margin.y)
				&& MathUtil.contains(value.z, index.z, margin.z))
		{
			bool = true
		}

		return bool;
	}

	/**
	 * Linear mapping from range <a1, a2> to range <b1, b2>
	 * @method mapLinear
	 * @param {number} x
	 * @param {number} a1
	 * @param {number} a2
	 * @param {number} b1
	 * @param {number} b2
	 * @returns {number}
	 */
	public static mapLinear(x:number, a1:number, a2:number, b1:number, b2:number):number
	{

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	}

	/**
	 * @method smoothStep
	 * @param {number} x
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 * @see http://en.wikipedia.org/wiki/Smoothstep
	 */
	public static smoothStep(x:number, min:number, max:number):number
	{
		if(x <= min)
		{
			return 0;
		}
		if(x >= max)
		{
			return 1;
		}

		x = ( x - min ) / ( max - min );

		return x * x * ( 3 - 2 * x );
	}

	/**
	 * @method smootherStep
	 * @param {number} x
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 */
	public static smootherStep(x:number, min:number, max:number):number
	{
		if(x <= min)
		{
			return 0;
		}
		if(x >= max)
		{
			return 1;
		}

		x = ( x - min ) / ( max - min );

		return x * x * x * ( x * ( x * 6 - 15 ) + 10 );
	}


	public static lerp(fromValue:number, toValue:number, alpha:number):number
	{
		fromValue += ( toValue - fromValue ) * alpha;
		return fromValue;
	}

	/**
	 *    Random float from <0, 1> with 16 bits of randomness
	 *    (standard Math.random() creates repetitive patterns when applied over larger space)
	 *
	 * @method random16
	 * @returns {number}
	 */
	public static random16():number
	{
		return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;
	}

	/**
	 * Random integer from <low, high> interval
	 * @param {number} low
	 * @param {number} high
	 * @returns {number}
	 */
	public static randInt(low:number, high:number):number
	{
		return low + Math.floor(Math.random() * ( high - low + 1 ));
	}

	/**
	 * Random float from <low, high> interval
	 * @method randFloat
	 * @param {number} low
	 * @param {number} high
	 * @returns {number}
	 */
	public static randFloat(low:number, high:number):number
	{
		return low + Math.random() * ( high - low );
	}

	/**
	 * Random float from <-range/2, range/2> interval
	 * @method randFloatSpread
	 * @param {number} range
	 * @returns {number}
	 */
	public static randFloatSpread(range:number):number
	{
		return range * ( 0.5 - Math.random() );
	}

	/**
	 * @method degToRad
	 * @param {number} degrees
	 * @returns {number}
	 */
	public static degToRad(degrees:number):number
	{
		return degrees * MathUtil.degreeToRadiansFactor;
	}

	/**
	 * @method radToDeg
	 * @param {number} radians
	 * @returns {number}
	 */
	public static radToDeg(radians:number):number
	{
		return radians * MathUtil.radianToDegreesFactor;
	}

	/**
	 * @method isPowerOfTwo
	 * @param {number} value
	 * @returns {boolean}
	 */
	public static isPowerOfTwo(value:number):boolean
	{
		return ( value & ( value - 1 ) ) === 0 && value !== 0;
	}

	/**
	 * @method getDistance
	 * @param point0
	 * @param point1
	 * @returns {number}
	 */
	public static getDistance(point0:IVector2, point1:IVector2):number
	{

		return Math.abs(Math.sqrt(this.getDistanceSquared(point0, point1)));
	}

	/**
	 * @method getClosestVector2
	 * @param point0
	 * @param point1
	 * @returns {number}
	 */
	public static getDistanceSquared(point0:IVector2, point1:IVector2):number
	{
		var dx = point1.x - point0.x,
			dy = point1.y - point0.y;
		return dx * dx + dy * dy;
	}

	/**
	 * @method getClosestVector2
	 * @param value
	 * @param points
	 * @returns {IVector2}
	 */
	public static getClosestVector2(value:IVector2, points:Array<IVector2>):IVector2
	{
		var prevDist = 99999999999;
		var point = null;
		var index = null;
		for(var i = 0; i < points.length; i++)
		{
			var dist = Math.abs(MathUtil.getDistanceSquared(value, points[i]));
			if(dist < prevDist)
			{
				prevDist = dist;
				point = points[i];
			}
		}

		return point;
	}

	/**
	 * Given a number, this function returns the closest number that is a power of two
	 * this function is taken from Starling Framework as its pretty neat ;)
	 *
	 * @param number {number}
	 * @return {number} the closest number that is a power of two
	 */
	public getNextPowerOfTwo(value:number):number
	{
		// test asd
		if (value > 0 && (value & (value - 1)) === 0)
		{
			return value;
		}
		else
		{
			var result = 1;

			while (result < value)
			{
				result <<= 1;
			}

			return result;
		}
	}

	public static modulo(v:number, length:number):number
	{
		return v - (v / length | 0) * length;
	}

	/**
	 * number between 0 and 1
	 * @param v
	 * @returns {number}
	 */
	public pingPong(v:number, length:number = 1):number
	{
		v = MathUtil.modulo(v, length);
		return 1 - Math.abs(v - .5) * 2;
	}
}

export default MathUtil;