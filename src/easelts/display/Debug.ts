import Container = require("./Container");
import Shape = require("./Shape");
import Graphics = require("./Graphics");
import Text = require("./Text");
import Size = require('../geom/Size');

class Debug extends Container
{
	private _shape:Shape = new Shape();
	private _text:Text = new Text('', 'bold 16px Arial', '#FFF');

	constructor(public name:string = 'unknown', width:any = '100%', height:any = '100%', x:any = '50%', y:any = '50%', regX:any = '50%', regY:any = '50%')
	{
		super();

		this.setWidth(width);
		this.setHeight(height);
		this.setRegX(regX);
		this.setRegY(regY);
		this.setX(x);
		this.setY(y);

		this._text.textAlign = 'center';
		this._text.textBaseline = 'center';
		this.addChild(this._shape);
		this.addChild(this._text);
		this.mouseEnabled = false;
		this.tickChildren = false;

		this.update();
	}

	update():void
	{
		if(this.width > 0 && this.height > 0)
		{
			this._text.text = (this.name.length > 0 ? this.name + '\n' : '') + Math.round(this.width) + ' x ' + Math.round(this.height);
			this._text.x = this.width / 2;
			this._text.y = this.height / 2;

			if(this.width < 100 || this.height < 100)
			{
				this._text.visible = false;
			}

			this._shape.graphics.clear()
				.beginStroke(Graphics.getRGB(0, 0, 0))
				.setStrokeStyle(1)
				.drawRect(0, 0, this.width, this.height)

				.setStrokeStyle(1)
				.moveTo(10, 10)
				.lineTo(this.width - 10, this.height - 10)
				.moveTo(this.width - 10, 10)
				.lineTo(10, this.height - 10);

			if(this.width > 150 && this.height > 150)
			{

				var w = this._text.getMeasuredWidth();
				var h = this._text.getMeasuredHeight();

				this._shape.graphics.beginFill(Graphics.getRGB(0, 0, 0))
					.drawRect(this.width - w >> 1, this.height - h >> 1, w, h);
			}
		}
	}

	public onResize(width:number, height:number):void
	{
		super.onResize(width, height);
		this.update();
	}
}

export = Debug;