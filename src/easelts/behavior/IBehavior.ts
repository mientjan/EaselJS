/**
 * Created by pieters on 09-Mar-15.
 */

import {DisplayObject} from "../display/DisplayObject";

export interface IBehavior
{
	owner:DisplayObject;

	initialize(owner:DisplayObject):void
	destruct():void
}

