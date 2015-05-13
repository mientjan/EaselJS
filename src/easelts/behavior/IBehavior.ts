/**
 * Created by pieters on 09-Mar-15.
 */

import DisplayObject = require('../display/DisplayObject');

interface IBehavior
{
	owner:DisplayObject;

	initialize(owner:DisplayObject):void
	destruct():void
}

export = IBehavior;