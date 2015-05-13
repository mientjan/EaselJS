import DisplayObject = require('../display/DisplayObject');
import IBehavior = require('./IBehavior');

/**
 * AbstractBehaviour
 *
 * @namespace easelts.behavior
 * @method AbstractBehavior
 * @author Mient-jan Stelling <mientjan.stelling@gmail.com>
 */
class AbstractBehavior implements IBehavior
{
	/**
	 * @property owner
	 */
	public owner:DisplayObject = null;

	/**
	 * @method initialize
	 * @param {DisplayObject} owner
	 */
	public initialize(owner:DisplayObject):void
	{
		if(this.owner)
		{
			throw new Error('behavior already has an owner')
		}

		this.owner = owner;
	}

	public destruct():void
	{
		this.owner = null;
	}
}

export = AbstractBehavior;
