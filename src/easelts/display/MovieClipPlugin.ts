import Tween = require('../../tweents/Tween');
import MovieClip = require('./MovieClip');

// MovieClipPlugin for TweenJS:
/**
 * This plugin works with <a href="http://tweenjs.com" target="_blank">TweenJS</a> to prevent the startPosition
 * property from tweening.
 * @private
 * @class MovieClipPlugin
 * @constructor
 **/
class MovieClipPlugin
{
	/**
	 * @method priority
	 * @private
	 **/
	public static priority = 100; // very high priority, should run first

	/**
	 * @method install
	 * @private
	 **/
	public static install ()
	{
		Tween.installPlugin(MovieClipPlugin, ["startPosition"]);
	}

	/**
	 * @method init
	 * @param {Tween} tween
	 * @param {String} prop
	 * @param {String|Number|Boolean} value
	 * @private
	 **/
	public static init (tween, prop, value)
	{
		return value;
	}

	/**
	 * @method step
	 * @private
	 **/
	public static step ()
	{
		// unused.
	}

	/**
	 * @method tween
	 * @param {Tween} tween
	 * @param {String} prop
	 * @param {String | Number | Boolean} value
	 * @param {Array} startValues
	 * @param {Array} endValues
	 * @param {Number} ratio
	 * @param {Object} wait
	 * @param {Object} end
	 * @return {*}
	 */
	public static tween(tween, prop, value, startValues, endValues, ratio, wait, end)
	{
		if(!(tween.target instanceof MovieClip))
		{
			return value;
		}
		return (ratio == 1 ? endValues[prop] : startValues[prop]);
	}

	constructor()
	{
		throw("MovieClipPlugin cannot be instantiated.")
	}

}

export = MovieClipPlugin;