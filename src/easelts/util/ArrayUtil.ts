import {Size} from "../geom/Size";
import {ISize} from "../interface/ISize";
import {Vector2} from "../geom/Vector2";
import {IVector2} from "../../core/interface/IVector2";
import {Bounds} from "../geom/Bounds";

export class ArrayUtil
{
	public static getMaxSize(arr:Array<ISize>):Size
	{
		var size = new Size(0, 0);
		for(var i = 0; i < arr.length; i++)
		{
			size.width = Math.max(arr[i].width, size.width);
			size.height = Math.max(arr[i].height, size.height);
		}

		return size;
	}

	public static getSize(arr:Array<ISize>):Size
	{
		var size = new Size(0, 0);
		for(var i = 0; i < arr.length; i++)
		{
			size.width += arr[i].width;
			size.height += arr[i].height;
		}

		return size;
	}

	public static getRandom(arr:Array<any>):any
	{
		return arr[Math.random()*arr.length|0];
	}

	public static getBounds(list:IVector2[]):Bounds
	{
		var bounds = new Bounds();

		if(list.length > 0)
		{
			bounds.x0 = list[0].x;
			bounds.y0 = list[1].y;
		}

		for(var i = 0; i < list.length; i++)
		{
			bounds.x0 = Math.min(list[i].x, bounds.x0);
			bounds.y0 = Math.min(list[i].y, bounds.y0);
			bounds.x1 = Math.max(list[i].x, bounds.x1);
			bounds.y1 = Math.max(list[i].y, bounds.y1);
		}

		bounds.width = bounds.x1 - bounds.x0;
		bounds.height = bounds.y1 - bounds.y0;

		return bounds;
	}

	public static random(list:any[])
	{
		var currentIndex = list.length
				, temporaryValue
				, randomIndex
				;

		// While there remain elements to shuffle...
		while(0 !== currentIndex)
		{

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = list[currentIndex];
			list[currentIndex] = list[randomIndex];
			list[randomIndex] = temporaryValue;
		}
	}


	public static centerOut(list:IVector2[]):Vector2
	{
		var bounds = this.getBounds(list);

		var point = new Vector2(
				bounds.width / 2 + bounds.x0,
				bounds.height / 2 + bounds.y0
		);

		list.sort((a, b) =>
		{
			var x0 = (a.x - point.x);
			var y0 = (a.y - point.y);
			var x1 = (b.x - point.x);
			var y1 = (b.y - point.y);

			return (x0 * x0 + y0 * y0) - (x1 * x1 + y1 * y1);
		});

		return point;
	}

	public static centerIn(list:IVector2[]):Vector2
	{
		var bounds = this.getBounds(list);

		var point = new Vector2(
				bounds.width / 2 + bounds.x0,
				bounds.height / 2 + bounds.y0
		);

		list.sort((a, b) =>
		{
			var x0 = (a.x - point.x);
			var y0 = (a.y - point.y);
			var x1 = (b.x - point.x);
			var y1 = (b.y - point.y);

			return (x1 * x1 + y1 * y1) - (x0 * x0 + y0 * y0);
		});

		return point;
	}

	public static topDown(list:IVector2[]):Vector2
	{
		var abs = [2000, 2000, 0, 0];
		for(var i = 0; i < list.length; i++)
		{
			abs[0] = Math.min(list[i].x, abs[0]);
			abs[1] = Math.min(list[i].y, abs[1]);
			abs[2] = Math.max(list[i].x, abs[2]);
			abs[3] = Math.max(list[i].y, abs[3]);
		}

		var point = new Vector2(
				(abs[2] - abs[0]) / 2 + abs[0],
				(abs[3] - abs[1]) / 2 + abs[1]
		);

		list.sort((a, b) =>
		{
			return a.y - b.y;
		});

		return point;
	}

	public static downTop(list:IVector2[]):Vector2
	{
		var abs = [2000, 2000, 0, 0];
		for(var i = 0; i < list.length; i++)
		{
			abs[0] = Math.min(list[i].x, abs[0]);
			abs[1] = Math.min(list[i].y, abs[1]);
			abs[2] = Math.max(list[i].x, abs[2]);
			abs[3] = Math.max(list[i].y, abs[3]);
		}

		var point = new Vector2(
				(abs[2] - abs[0]) / 2 + abs[0],
				(abs[3] - abs[1]) / 2 + abs[1]
		);

		list.sort((a, b) =>
		{
			return b.y - a.y;
		});

		return point;
	}

	public static rightLeft(list:IVector2[]):Vector2
	{
		var abs = [2000, 2000, 0, 0];
		for(var i = 0; i < list.length; i++)
		{
			abs[0] = Math.min(list[i].x, abs[0]);
			abs[1] = Math.min(list[i].y, abs[1]);
			abs[2] = Math.max(list[i].x, abs[2]);
			abs[3] = Math.max(list[i].y, abs[3]);
		}

		var point = new Vector2(
				(abs[2] - abs[0]) / 2 + abs[0],
				(abs[3] - abs[1]) / 2 + abs[1]
		);

		list.sort((a, b) =>
		{
			return a.x - b.x;
		});

		return point;
	}

	public static leftRight(list:IVector2[]):Vector2
	{
		var abs = [2000, 2000, 0, 0];
		for(var i = 0; i < list.length; i++)
		{
			abs[0] = Math.min(list[i].x, abs[0]);
			abs[1] = Math.min(list[i].y, abs[1]);
			abs[2] = Math.max(list[i].x, abs[2]);
			abs[3] = Math.max(list[i].y, abs[3]);
		}

		var point = new Vector2(
				(abs[2] - abs[0]) / 2 + abs[0],
				(abs[3] - abs[1]) / 2 + abs[1]
		);

		list.sort((a, b) =>
		{
			return b.x - a.x;
		});

		return point;
	}
}

