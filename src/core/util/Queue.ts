

import QueueItem from "./QueueItem";

class Queue
{
	protected _list:Array<QueueItem> = [];
	public current:QueueItem = null;

	public add(item:QueueItem):Queue
	{
		this._list.push(item);

		return this;
	}

	public next():QueueItem
	{
		this.kill();

		if(this._list.length > 0)
		{
			this.current = this._list.shift();
		} else {
			this.current = null;
		}

		return this.current;
	}

	public end(all:boolean = false):Queue
	{
		if(all)
		{
			this._list.length = 0;
		}

		if(this.current){
			this.current.times = 1;
		}

		return this;
	}

	public kill(all:boolean = false):Queue
	{
		if(all)
		{
			this._list.length = 0;
		}

		if(this.current)
		{
			let current = this.current;
			this.current = null;
			current.finish();
			current.destruct();
		}

		return this;
	}
}

export default Queue;
