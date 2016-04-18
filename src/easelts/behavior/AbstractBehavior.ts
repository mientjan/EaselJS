import {DisplayObject} from "../display/DisplayObject";
import IBehavior from "./IBehavior";

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
			throw new Error('behavior already has a owner')
		}

		this.owner = owner;
	}

	public destruct():void
	{
		this.owner = null;
	}
}

export default AbstractBehavior;