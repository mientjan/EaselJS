import DisplayObject = require('../display/DisplayObject');
import SpriteSheet = require('../display/SpriteSheet');
import DisplayType = require('../enum/DisplayType');
import Methods = require('../util/Methods');
import TimeEvent = require('../../createts/event/TimeEvent');
import Signal = require('../../createts/event/Signal');
import SignalConnection = require('../../createts/event/SignalConnection');

/**
 * @class ImageSequence
 */
class ImageSequence extends DisplayObject
{
	public type:DisplayType = DisplayType.BITMAP;

	public _playing = false;
	public _timeIndex:number = -1;
	public _frame:number = 0;
	public _fps:number = 0;
	public _length:number = 0;
	private _times:number = 1;
	private _loopInfinite:boolean = false;

	private _onComplete:Function = null;

	public images:Array<HTMLImageElement> = null;
	public spriteSheet:SpriteSheet = null;

	/**
	 *
	 * @param {string[]} images
	 * @param {number} fps
	 * @param {string|number} width
	 * @param {string|number} height
	 * @param {string|number} x
	 * @param {string|number} y
	 * @param {string|number} regX
	 * @param {string|number} regY
	 */
	constructor(images:string[]|SpriteSheet, fps:number, width:any, height:any, x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super(width, height, x, y, regX, regY);

		if( images instanceof Array )
		{
			var imageList = <string[]> images;
			this.images = [];
			for(var i = 0; i < imageList.length; i++)
			{
				var image = document.createElement('img');
				image.src = images[i];

				//			this._images.push( images[i] );
				this.images.push( image );
			}

			this._length = this.images.length;
		}
		else if( images instanceof SpriteSheet )
		{
			var spriteSheet = <SpriteSheet> images;
			var animations = spriteSheet.getAnimations();

			if( animations.length > 1 )
			{
				throw new Error('SpriteSheet not compatible with ImageSequence, has multiple animations. Only supports one')
			}

			this._length = spriteSheet.getNumFrames(animations[0]);
			this.spriteSheet = spriteSheet;
		}

		this._fps = 1000 / fps;
	}

	public draw(ctx:CanvasRenderingContext2D, ignoreCache:boolean):boolean
	{
		if( this._frame > -1 )
		{
			var frame = this._frame;

			if(this.images)
			{
				var images = this.images;
				var image = images[frame];

				if( !image.complete ){
					if( images[frame - 1] && images[frame - 1].complete ){
						image = images[frame - 1];
					} else if( images[frame - 2] && images[frame - 2].complete ){
						image = images[frame - 2];
					} else if( images[frame - 3] && images[frame - 3].complete ){
						image = images[frame - 3];
					}
				}

				var width = image.naturalWidth;
				var height = image.naturalHeight;

				if( width > 0 && height > 0 )
				{
					ctx.drawImage(image, 0, 0, width, height, 0, 0, this.width, this.height);
				}
			}
			else if(this.spriteSheet)
			{
				var frameObject = this.spriteSheet.getFrame(this._frame);

				if(!frameObject)
				{
					return false;
				}

				var rect = frameObject.rect;

				if(rect.width && rect.height)
				{
					ctx.drawImage(frameObject.image, rect.x, rect.y, rect.width, rect.height, 0, 0, this.width, this.height);
				}
			}
		}

		return true;
	}

	public play(times = 1, onComplete:Function = null):void
	{
		this._frame = 0;
		this._times = times;
		this._loopInfinite = times == -1 ? true : false;
		this._onComplete = onComplete;
		this._playing = true;
	}

	public stop(triggerOnComplete:boolean = true):void
	{
		this._playing = false;
		this._loopInfinite = false;
		this._timeIndex = -1;

		if(this._onComplete && triggerOnComplete)
		{
			this._onComplete.call(null);
		}

		this._onComplete = null;
	}

	public onTick(delta:number):void
	{
		var playing = this._playing;

		if(playing)
		{
			if(this._timeIndex < 0)
			{
				this._timeIndex = 0;
			}

			var time = this._timeIndex += delta;
			var fps = this._fps;
			var length = this._length;
			var times = this._times;
			var frame = Math.floor(time / fps);
			var currentFrame = this._frame;
			var playedLeft = times - Math.floor(frame / length);

			if(!this._loopInfinite && playedLeft <= 0)
			{
				this.stop();
			}
			else
			{
				frame %= length;

				if(currentFrame != frame)
				{
					this._frame = frame;
				}
			}

		}
	}

}

export = ImageSequence;