import {AbstractBehavior} from "./AbstractBehavior";
import {DisplayObject} from "../display/DisplayObject";
import {Stage} from "../display/Stage";
import {Container} from "../display/Container";
import {DisplayType} from "../enum/DisplayType";

/**
 * @method ButtonBehavior
 * @author Mient-jan Stelling <mientjan.stelling@gmail.com>
 */
export class ButtonBehavior extends AbstractBehavior
{
	private _stage:Stage;

	private _onClickInstance:Function = null;
	private _onPointerOverInstance:Function = null;
	private _onPointerOutInstance:Function = null;

	/**
	 * @method initialize
	 * @param displayObject
	 */
	public initialize(displayObject:DisplayObject):void
	{
		super.initialize(displayObject);

		this.owner.setMouseInteraction(true);
		this.owner.cursor = 'pointer';

		if(typeof(this.owner['onClick']) == 'function')
		{

			this._onClickInstance = this.owner['onClick'].bind(this.owner);
			this.owner.addEventListener(DisplayObject.EVENT_MOUSE_CLICK, this._onClickInstance );
		}

		if(typeof(this.owner['onPointerOver']) == 'function')
		{
			this._onPointerOverInstance = this.owner['onPointerOver'].bind(this.owner);
			this.owner.addEventListener(DisplayObject.EVENT_MOUSE_OVER, this._onPointerOverInstance );
		}

		if(typeof(this.owner['onPointerOut']) == 'function')
		{
			this._onPointerOutInstance = this.owner['onPointerOut'].bind(this.owner);
			this.owner.addEventListener(DisplayObject.EVENT_MOUSE_OUT, this._onPointerOutInstance  );
		}

	}

	public destruct():void
	{
		if(this._onClickInstance)
		{
			this.owner.removeEventListener(DisplayObject.EVENT_MOUSE_CLICK, this._onClickInstance);
		}

		if(this._onPointerOverInstance)
		{
			this.owner.removeEventListener(DisplayObject.EVENT_MOUSE_OVER, this._onPointerOverInstance);
		}

		if(this._onPointerOutInstance)
		{
			this.owner.removeEventListener(DisplayObject.EVENT_MOUSE_OUT, this._onPointerOutInstance);
		}

		this._stage = null;
		this._onClickInstance = null;
		this._onPointerOverInstance = null;
		this._onPointerOutInstance = null;

		super.destruct();
	}
}

