import Rectangle = require('../geom/Rectangle');
import AbstractBehavior = require('./AbstractBehavior');
import DisplayObject = require('../display/DisplayObject');
import Point = require('../geom/Point');
import PointerEvent = require('../event/PointerEvent');
import MouseEvent = require('../event/MouseEvent');
import Signal = require('../../createts/event/Signal');
import SignalConnection = require('../../createts/event/SignalConnection');
import Ticker = require('../../createts/util/Ticker');
import Stage = require('../display/Stage');

/**
 * Created by pieters on 10-Mar-15.
 */

class MouseOverBehavior extends AbstractBehavior
{
	private _rectangle:Rectangle = null;
	private _radiusPow:number = 0.0;

	private _hasMouseOver:boolean = false;

	private _tickerSignalConnection:SignalConnection = null;

	private _stage:Stage;

	constructor(area?:Rectangle);
	constructor(area?:number);
	constructor(area?:any)
	{
		super();

		if (area !== void 0)
		{
			if (typeof area == "number")
			{
				this._radiusPow = area * area;
			}
			else if (area.hasOwnProperty("x") && area.hasOwnProperty("y") && area.hasOwnProperty("width") && area.hasOwnProperty("height"))
			{
				this._rectangle = area;
			}
			else
			{
				throw new Error("Invalid type area");
			}
		}
	}

	public initialize(owner:DisplayObject):void
	{
		super.initialize(owner);

		this.owner.cursor = 'pointer';

		this._tickerSignalConnection = Ticker.getInstance().tickSignal.connect(this.update);
	}

	public update = (delta:number) =>
	{
		this.checkMouseOver();
	}

	public checkMouseOver():void
	{
		var isWithin:boolean = false;

		if (this.owner.stage)
		{
			this._stage = this.owner.stage;
		}

		if (!this._stage || !this.owner.mouseEnabled)
		{
			isWithin = false;
		}
		else
		{
			var mousePosition:Point = this.owner.globalToLocal(this._stage.mouseX, this._stage.mouseY);

			if(this._radiusPow)
			{
				isWithin = (mousePosition.x * mousePosition.x + mousePosition.y * mousePosition.y < this._radiusPow);
			}
			else if(this._rectangle)
			{
				isWithin = (mousePosition.x > this._rectangle.x && mousePosition.x < this._rectangle.x + this._rectangle.width) &&
						   (mousePosition.y > this._rectangle.y && mousePosition.y < this._rectangle.y + this._rectangle.height);
			}
			else
			{
				isWithin = (mousePosition.x > 0 && mousePosition.x < this.owner.width) &&
						   (mousePosition.y > 0 && mousePosition.y < this.owner.height);
			}
		}

		if (!this._hasMouseOver && isWithin)
		{
			this.owner.dispatchEvent(new PointerEvent(DisplayObject.EVENT_MOUSE_OVER, true, false, this._stage.mouseX, this._stage.mouseY, null, -1, true, this._stage.mouseX, this._stage.mouseY));
			this._hasMouseOver = true;

			if (this.owner.stage)
			{
				this.owner.stage.canvas.style.cursor = this.owner.cursor;
			}
		}
		else if (this._hasMouseOver && !isWithin)
		{
			this.owner.dispatchEvent(new PointerEvent(DisplayObject.EVENT_MOUSE_OUT, true, false, this._stage.mouseX, this._stage.mouseY, null, -1, true, this._stage.mouseX, this._stage.mouseY));
			this._hasMouseOver = false;

			if (this.owner.stage)
			{
				this.owner.stage.canvas.style.cursor = "";
			}
		}
	}

	public destruct():void
	{
		if (this._tickerSignalConnection)
		{
			this._tickerSignalConnection.dispose();
			this._tickerSignalConnection = null;
		}

		this._rectangle = null;
	}
}

export = MouseOverBehavior;