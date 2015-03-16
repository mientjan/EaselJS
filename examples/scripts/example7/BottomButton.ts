///<reference path="../lib/gsap/greensock.d.ts" />

import Container = require('../../../src/easelts/display/Container');
import Text = require('../../../src/easelts/display/Text');
import BitmapNinePatch = require('../../../src/easelts/component/BitmapNinePatch');
import NinePatch = require('../../../src/easelts/component/bitmapninepatch/NinePatch');
import Rectangle = require('../../../src/easelts/geom/Rectangle');
import ButtonBehavior = require('../../../src/easelts/behavior/ButtonBehavior');

class BottomButton extends Container
{
	private _ninepatch:NinePatch = new NinePatch('assets/image/ninepatch_blue.png', new Rectangle(5, 12, 139, 8) );
	private _bg:BitmapNinePatch = new BitmapNinePatch(this._ninepatch);
	private _text:Text = new Text('bottom');

	constructor()
	{
		super(200, 50, '50%', '100%', '50%', '100%');

		this.addBehavior(new ButtonBehavior);
		this.hitArea = this._bg;
		this.addChild(this._bg);
		this.addChild(this._text);

	}
}

export = BottomButton;