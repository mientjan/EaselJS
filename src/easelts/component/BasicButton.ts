import Container = require('../display/Container');
import Text = require('../display/Text');
import Shape = require('../display/Shape');
import ButtonBehavior = require('../behavior/ButtonBehavior');

/**
 * @class BasicButton
 */
class BasicButton extends Container
{

	public set backgroundColor(value:string)
	{
		this._backgroundColor = value;
	}

	public get backgroundColor()
	{
		return this._backgroundColor;
	}

	public set text(value:string)
	{
		this._text = value;
	}

	public get text()
	{
		return this._text;
	}

	public set margin(value:string)
	{

		var marginArray = value.split(' ').map((value) =>
		{
			return parseInt(value);
		});

		switch(marginArray.length)
		{
			case 1:
			{
				marginArray.push(marginArray[0], marginArray[0], marginArray[0]);
				break;
			}

			case 2:
			{
				marginArray.push(marginArray[0], marginArray[1]);
				break;
			}

			case 3:
			{
				marginArray.push(marginArray[1]);
				break;
			}
		}

		marginArray.length = 4;
		this._margin = marginArray;
	}

	public get margin()
	{
		return this._margin.join(' ');
	}

	private _text:string = 'BasicButton';
	private _font:string = '10px Arial';

	private _color:string = '#FFF';
	private _backgroundColor:string = '#000';
	private _border:string = '#FFF';
	private _margin:number[] = [2, 2, 2, 2];


	private _textElement:Text;
	private _shape:Shape = new Shape();
	public hitArea:Shape = new Shape();


	/**
	 *
	 * @param {string} color
	 * @param {string|number} width
	 * @param {string|number} height
	 * @param {string|number} x
	 * @param {string|number} y
	 * @param {string|number} regX
	 * @param {string|number} regY
	 */
		constructor(text:string, font:string, color:string, backgroundColor:string = null, border:string = null, x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super(100, 100, x, y, regX, regY);

		this.addBehavior(new ButtonBehavior);

		this._text = text;
		this._font = font;
		this._backgroundColor = backgroundColor;
		this._border = border;
		this._textElement = new Text(text, font, color);

		this.addChild(this._shape);
		this.addChild(this._textElement);
	}

	public onResize(e)
	{
		super.onResize(e);

		this._shape.graphics.clear().beginFill(this._backgroundColor).drawRect(0, 0, this.width, this.height);
		if(this._border)
		{
			this._shape.graphics.clear().beginStroke(this._border).drawRect(0, 0, this.width, this.height);
		}
		this.hitArea.graphics.clear().beginFill(this._backgroundColor).drawRect(0, 0, this.width, this.height);
	}
}

export = BasicButton;