//import ref = require("lib/ReferenceDefinitions");
import DisplayObject = require("../display/DisplayObject");
//import Point = require("../geom/Point");
import Bounds = require("../geom/Bounds");
import IVector2 = require("../interface/IVector2");
import Vector2 = require("../geom/Vector2");

class TickAnimateUtil
{
	private static _idCollection:{[index:number]:{time:number}} = {};

	public static getTimeByUID(uid:number):{time:number}
	{
		if(!TickAnimateUtil._idCollection[uid]){
			TickAnimateUtil._idCollection[uid] = {time:0};
		}

		return TickAnimateUtil._idCollection[uid];
	}


	public static jojo(tick:number, duration:number, element:DisplayObject, from:any, to:any)
	{
		var time = TickAnimateUtil.getTimeByUID(element.id);
		time.time += tick;
		time.time %= duration;


	}
}

export = TickAnimateUtil;