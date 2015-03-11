/**
 * Created by pieters on 11-Mar-15.
 */

import IFlexBoxStyle = require('./IFlexBoxStyle');
import IFlexBoxLayout = require('./IFlexBoxLayout');

interface IFlexBoxNode
{
	style:IFlexBoxStyle;
	layout?:IFlexBoxLayout
	children?:IFlexBoxNode[];
}

export = IFlexBoxNode;