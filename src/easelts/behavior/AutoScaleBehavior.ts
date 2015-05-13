/**
 * Created by pieters on 12-Mar-15.
 */
import AbstractBehavior = require('./AbstractBehavior');
import DisplayObject = require('../display/DisplayObject');
import Point = require('../geom/Point');
import Size = require('../geom/Size');
import SignalConnection = require('../../createts/event/SignalConnection');

class AutoScaleBehavior extends AbstractBehavior
{
	private _downScaleBreakPoint:Size = null;
	private _downScaleLimit:Size = null;
	private _upScaleBreakPoint:Size = null;
	private _upScaleLimit:Size = null;
	private _alwaysCover:boolean = false;
	private _alwaysVisible:boolean = false;


	private _resizeSignalConnection:SignalConnection;


	constructor(downScaleBreakPoint?:Size, downScaleLimit?:Size, upScaleBreakPoint?:Size, upScaleLimit?:Size)
	{
		super();

		this._downScaleBreakPoint = downScaleBreakPoint;
		this._downScaleLimit = downScaleLimit;
		this._upScaleBreakPoint = upScaleBreakPoint;
		this._upScaleLimit = upScaleLimit;
	}

	public initialize(owner:DisplayObject):void
	{
		super.initialize(owner);

		this._resizeSignalConnection = this.owner.resizeSignal.connect(this.updateScale.bind(this));

		this.updateScale();
	}

	/**
	 * Will override all AutoScaleBehavior settings and will just fill the entire parent container with scaling.
	 * @method alwaysFill
	 * @param value
	 */
	public setAwaysVisible(value:boolean):void
	{
		this._alwaysVisible = value;
	}

	public setAlwaysCover(value:boolean):void
	{
		this._alwaysCover = value;
	}

	public setDownScaleBreakPoint(width:number, height:number):void
	{
		if(!this._downScaleBreakPoint)
		{
			this._downScaleBreakPoint = new Size(width, height);
		}
		else
		{
			this._downScaleBreakPoint.width = width;
			this._downScaleBreakPoint.height = height;
		}

		this.updateScale();
	}

	public setDownScaleBreakPointWidth(width:number):void
	{
		if(!this._downScaleBreakPoint)
		{
			this._downScaleBreakPoint = new Size(width, 0);
		}
		else
		{
			this._downScaleBreakPoint.width = width;
		}

		this.updateScale();
	}

	public setDownScaleBreakPointHeight(height:number):void
	{
		if(!this._downScaleBreakPoint)
		{
			this._downScaleBreakPoint = new Size(0, height);
		}
		else
		{
			this._downScaleBreakPoint.height = height;
		}

		this.updateScale();
	}

	public setDownScaleLimit(width:number, height:number):void
	{
		if(!this._downScaleLimit)
		{
			this._downScaleLimit = new Size(width, height);
		}
		else
		{
			this._downScaleLimit.width = width;
			this._downScaleLimit.height = height;
		}

		this.updateScale();
	}

	public setDownScaleLimitWidth(width:number):void
	{
		if(!this._downScaleLimit)
		{
			this._downScaleLimit = new Size(width, 0);
		}
		else
		{
			this._downScaleLimit.width = width;
		}

		this.updateScale();
	}

	public setDownScaleLimitHeight(height:number):void
	{
		if(!this._downScaleLimit)
		{
			this._downScaleLimit = new Size(0, height);
		}
		else
		{
			this._downScaleLimit.height = height;
		}

		this.updateScale();
	}

	public setUpScaleBreakPoint(width:number, height:number):void
	{
		if(!this._upScaleBreakPoint)
		{
			this._upScaleBreakPoint = new Size(width, height);
		}
		else
		{
			this._upScaleBreakPoint.width = width;
			this._upScaleBreakPoint.height = height;
		}

		this.updateScale();
	}

	public setUpScaleBreakPointWidth(width:number):void
	{
		if(!this._upScaleBreakPoint)
		{
			this._upScaleBreakPoint = new Size(width, Number.MAX_VALUE);
		}
		else
		{
			this._upScaleBreakPoint.width = width;
		}

		this.updateScale();
	}

	public setUpScaleBreakPointHeight(height:number):void
	{
		if(!this._upScaleBreakPoint)
		{
			this._upScaleBreakPoint = new Size(Number.MAX_VALUE, height);
		}
		else
		{
			this._upScaleBreakPoint.height = height;
		}

		this.updateScale();
	}

	public setUpScaleLimit(width:number, height:number):void
	{
		if(!this._upScaleLimit)
		{
			this._upScaleLimit = new Size(width, height);
		}
		else
		{
			this._upScaleLimit.width = width;
			this._upScaleLimit.height = height;
		}

		this.updateScale();
	}

	public setUpScaleLimitWidth(width:number):void
	{
		if(!this._upScaleLimit)
		{
			this._upScaleLimit = new Size(width, 0);
		}
		else
		{
			this._upScaleLimit.width = width;
		}

		this.updateScale();
	}

	public setUpScaleLimitHeight(height:number):void
	{
		if(!this._upScaleLimit)
		{
			this._upScaleLimit = new Size(0, height);
		}
		else
		{
			this._upScaleLimit.height = height;
		}

		this.updateScale();
	}


	private updateScale(width?:number, height?:number)
	{
		if(!this.owner || !this.owner.parent)
		{
			return;
		}

		width = width || this.owner.parent.width;
		height = height || this.owner.parent.height;

		if(this._alwaysCover || this._alwaysVisible)
		{
			var ownerWidth = this.owner.width;
			var ownerHeight = this.owner.height;

			if(this._alwaysCover)
			{
				this.owner.scaleX = this.owner.scaleY = Math.max(width / ownerWidth, height / ownerHeight);
			}
			else if(this._alwaysVisible)
			{
				this.owner.scaleX = this.owner.scaleY = Math.min(width / ownerWidth, height / ownerHeight);
			}

			return true;
		}

		if(this._downScaleBreakPoint || this._upScaleBreakPoint)
		{
			if(this._downScaleBreakPoint && (width < this._downScaleBreakPoint.width || height < this._downScaleBreakPoint.height))
			{
				if(this._downScaleLimit)
				{
					width = Math.max(width, this._downScaleLimit.width);
					height = Math.max(height, this._downScaleLimit.height);
				}

				this.owner.scaleX =
					this.owner.scaleY = Math.min(1, width / this._downScaleBreakPoint.width, height / this._downScaleBreakPoint.height);
			}
			else if(this._upScaleBreakPoint && (width > this._upScaleBreakPoint.width || height > this._upScaleBreakPoint.height))
			{
				if(this._upScaleLimit)
				{
					width = Math.min(width, this._upScaleLimit.width);
					height = Math.min(height, this._upScaleLimit.height);
				}

				this.owner.scaleX =
					this.owner.scaleY = Math.max(1, Math.min(width / this._upScaleBreakPoint.width, height / this._upScaleBreakPoint.height));
			}
			else
			{
				this.owner.scaleX =
					this.owner.scaleY = 1;
			}
		}

		return true;
	}

	public destruct():void
	{
		if(this._resizeSignalConnection)
		{
			this._resizeSignalConnection.dispose();
			this._resizeSignalConnection = null;
		}

		this._downScaleBreakPoint = null;
		this._downScaleLimit = null;
		this._upScaleBreakPoint = null;
		this._upScaleLimit = null;

		super.destruct();
	}
}

export = AutoScaleBehavior;