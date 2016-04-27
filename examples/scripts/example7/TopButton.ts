///<reference path="../../assets/scripts/lib/gsap/greensock.d.ts" />

import Container from '../../../src/easelts/display/Container';
import Text from '../../../src/easelts/display/Text';
import BitmapNinePatch from '../../../src/easelts/component/BitmapNinePatch';
import NinePatch from '../../../src/easelts/component/bitmapninepatch/NinePatch';
import Rectangle from '../../../src/easelts/geom/Rectangle';
import ButtonBehavior from '../../../src/easelts/behavior/ButtonBehavior';
import {DisplayObject} from "../../../src/easelts/display/DisplayObject";

class TopButton extends Container
{
	private _ninepatch:NinePatch = new NinePatch('assets/image/ninepatch_blue.png', new Rectangle(5, 12, 139, 8) );
	private _bg:BitmapNinePatch = new BitmapNinePatch(this._ninepatch);
	private _text:Text = new Text('top');

	constructor()
	{
		super(10, 10, '50%', '0%', '50%', '0%');

		this.addBehavior(new ButtonBehavior);
		this.hitArea = this._bg;

		this.addChild(this._bg);
		this.addChild(this._text);

	}
}

export default TopButton;