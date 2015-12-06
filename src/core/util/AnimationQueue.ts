

import QueueItem from "./QueueItem";
import Queue from "./Queue";


class AnimationQueue extends Queue
{
	public frame:number = 0;

	protected _time:number = 0;
	protected _fpms:number = 0;

	constructor(fps:number, unit:number = 1000)
	{
		super();
		this._fpms = unit / fps;
	}

	public onTick(delta:number):void
	{
		var time = this._time += delta;


		if(this.current != null || this.next() != null)
		{
			var current = this.current;
			var from = current.from;
			var duration = current.duration;
			var times = current.times;

			var frame = (duration * time / (duration * this._fpms));

			this.frame = from + (frame % duration);

			if(times > -1 && times - (frame / duration) < 0)
			{
				this.next();
			}
		}
	}

	public next():QueueItem
	{
		this.reset();
		return super.next();
	}

	public getFrame():number
	{
		return this.frame|0
	}

	public reset():void
	{
		this._time = this._time % this._fpms;
	}
}

export default AnimationQueue;
