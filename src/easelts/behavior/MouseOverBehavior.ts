import Rectangle = require('../geom/Rectangle');
import Circle = require('../geom/Circle');
import AbstractBehavior = require('./AbstractBehavior');
import DisplayObject = require('../display/DisplayObject');
import Point = require('../geom/Point');
import PointerEvent = require('../event/PointerEvent');
import SignalConnection = require('../../createts/event/SignalConnection');
import Ticker = require('../../createts/util/Ticker');
import Stage = require('../display/Stage');

/**
 * Created by pieters on 10-Mar-15.
 */

class MouseOverBehavior extends AbstractBehavior
{
	private _rectangle:Rectangle = null;

	private _circle:Circle = null;
	private _circleRadiusPow:number = 0.0;

	private _hasMouseOver:boolean = false;

	private _tickerSignalConnection:SignalConnection = null;

	constructor(hitArea?:Rectangle);
	constructor(hitArea?:Circle);
	constructor(hitArea?:any)
	{
		super();

		if (hitArea !== void 0)
		{
			if (hitArea.hasOwnProperty("x") && hitArea.hasOwnProperty("y") && hitArea.hasOwnProperty("radius"))
			{
				this._circle = hitArea;
				this._circleRadiusPow = hitArea.radius * hitArea.radius;
			}
			else if (hitArea.hasOwnProperty("x") && hitArea.hasOwnProperty("y") && hitArea.hasOwnProperty("width") && hitArea.hasOwnProperty("height"))
			{
				this._rectangle = hitArea;
			}
			else
			{
				throw new Error("hitArea is of invalid type");
			}
		}
	}

	public initialize(owner:DisplayObject):void
	{
		super.initialize(owner);

		this.owner.cursor = 'pointer';

		this._tickerSignalConnection = Ticker.getInstance().tickSignal.connect(this.update.bind(this));
	}

	private update(delta:number)
	{
		var stage:Stage = this.owner.stage;

		if (stage && stage.mouseEnabled && stage.mouseChildren && this.owner.mouseEnabled)
		{
			this.checkMouseOver();
		}
		else
		{
			if (this._hasMouseOver)
			{
				this.changeMouseOverState(false);
			}
		}
	}

	public checkMouseOver():void
	{
		var isWithin:boolean = false;
		var mousePosition:Point = this.owner.globalToLocal(this.owner.stage.mouseX, this.owner.stage.mouseY);

		if(this._circle)
		{
			mousePosition.x -= this._circle.x;
			mousePosition.y -= this._circle.y;
			isWithin = (mousePosition.x * mousePosition.x + mousePosition.y * mousePosition.y < this._circleRadiusPow);
		}
		else if(this._rectangle)
		{
			isWithin =
				(mousePosition.x > this._rectangle.x && mousePosition.x < this._rectangle.x + this._rectangle.width) &&
				(mousePosition.y > this._rectangle.y && mousePosition.y < this._rectangle.y + this._rectangle.height);
		}
		else
		{
			isWithin =
				(mousePosition.x > 0 && mousePosition.x < this.owner.width) &&
				(mousePosition.y > 0 && mousePosition.y < this.owner.height);
		}

		if (!this._hasMouseOver && isWithin)
		{
			this.changeMouseOverState(true);
		}
		else if (this._hasMouseOver && !isWithin)
		{
			this.changeMouseOverState(false);
		}
	}

	private changeMouseOverState(hasMouseOver:boolean):void
	{
		this._hasMouseOver = hasMouseOver;

		var stageMouseX:number;
		var stageMouseY:number;

		var stage:Stage = this.owner.stage;
		if (stage)
		{
			stageMouseX = stage.mouseX;
			stageMouseY = stage.mouseY;
			stage.canvas.style.cursor = hasMouseOver ? this.owner.cursor : "";
		}

		var eventType:string = hasMouseOver ? DisplayObject.EVENT_MOUSE_OVER : DisplayObject.EVENT_MOUSE_OUT;
		this.owner.dispatchEvent(new PointerEvent(eventType, true, false, stageMouseX, stageMouseY, null, -1, true, stageMouseX, stageMouseY));
	}

	public destruct():void
	{
		if (this._hasMouseOver)
		{
			this.changeMouseOverState(false);
		}

		if (this._tickerSignalConnection)
		{
			this._tickerSignalConnection.dispose();
			this._tickerSignalConnection = null;
		}

		this._circle = null;
		this._rectangle = null;

		super.destruct();
	}
}

export = MouseOverBehavior;