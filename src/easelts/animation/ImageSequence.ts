import ILoadable from "../../core/interface/ILoadable";
import IPlayable from "../../core/interface/IPlayable";

import {DisplayObject} from "../display/DisplayObject";
import SpriteSheet from "../display/SpriteSheet";
import DisplayType from "../enum/DisplayType";
import * as Methods from "../util/Methods";
import TimeEvent from "../../core/event/TimeEvent";
import Signal from "../../core/event/Signal";
import SignalConnection from "../../core/event/SignalConnection";
import Promise from "../../core/util/Promise";
import AnimationQueue from "../../core/util/AnimationQueue";
import {QueueItem} from "../../core/util/QueueItem";

/**
 * @class ImageSequence
 */
class ImageSequence extends DisplayObject implements ILoadable<ImageSequence>, IPlayable
{
	/**
	 * @static
	 * @method createFromString
	 * @param {Array<string>} images
	 * @param {number} fps
	 * @param {number} width
	 * @param {number} height
	 * @returns {ImageSequence}
	 */
	public static createFromString(images:string[], fps:number, width:number, height:number):ImageSequence
	{
		var sequenceStructure = {

			"images": images.map(src => src),
			"frames": images.map((src, index) => [0, 0, width, height, index, 0, 0]),
			"animations": {
				"animation": [0, images.length - 1]
			}

		};

		return new ImageSequence(new SpriteSheet(sequenceStructure), fps, width, height);
	}

	public type:DisplayType = DisplayType.BITMAP;

	protected _queue:AnimationQueue;
	public spriteSheet:SpriteSheet = null;
	public frames:number = 0;
	public frame:number = 0;
	public paused:boolean = true;
	protected _fps:number;
	//
	protected _hasLoaded:boolean = false;

	/**
	 * @class ImageSequence
	 * @constructor
	 * @param {string[]} images
	 * @param {number} fps
	 * @param {string|number} width
	 * @param {string|number} height
	 * @param {string|number} x
	 * @param {string|number} y
	 * @param {string|number} regX
	 * @param {string|number} regY
	 */
	constructor(spriteSheet:SpriteSheet, fps:number, width:any, height:any, x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super(width, height, x, y, regX, regY);

		this.spriteSheet = spriteSheet;
		this._fps = fps;
		this._queue = new AnimationQueue(fps, 1000);
	}

	public hasLoaded():boolean
	{
		return this._hasLoaded;
	}

	private parseLoad(){

		var animations = this.spriteSheet.getAnimations();

		if( animations.length > 1 )
		{
			throw new Error('SpriteSheet not compatible with ImageSequence, has multiple animations. Only supports one')
		}

		this.frames = this.spriteSheet.getNumFrames();
	}

	public load( onProgress?:(progress:number) => any):Promise<ImageSequence>
	{
		if( this._hasLoaded)
		{
			if(onProgress) onProgress(1);

			return new Promise<ImageSequence>((resolve:Function, reject:Function) => {
				resolve(this);
			});
		}

		return this.spriteSheet.load(onProgress).then(spriteSheet => {
			this._hasLoaded = true;
			this.parseLoad();
			return this;
		}).catch(() => {
			throw new Error('could not load library');
		});
	}

	public draw(ctx:CanvasRenderingContext2D, ignoreCache:boolean):boolean
	{
		var frame = this.frame;
		var width = this.width;
		var height = this.height;

		if( frame > -1 && this._hasLoaded )
		{

			var frameObject = this.spriteSheet.getFrame(frame);

			if(!frameObject)
			{
				return false;
			}

			var rect = frameObject.rect;

			if(rect.width && rect.height)
			{
				ctx.drawImage(frameObject.image, rect.x, rect.y, rect.width, rect.height, 0, 0, width, height);
			}
		}

		return true;
	}

	public play(times:number = 1, label:string|Array<number> = null, complete?:() => any):ImageSequence
	{
		if(this.spriteSheet.hasLoaded() && !this._hasLoaded)
		{
			this._hasLoaded = true;
			this.parseLoad();
		}

		this.visible = true;

		if(label instanceof Array)
		{
			if(label.length == 1)
			{
				var queue = new QueueItem(null, label[0], this.getTotalFrames(), times, 0);
			} else {
				var queue = new QueueItem(null, label[0], label[1], times, 0);
			}
		} else if( label == null)
		{
			var queue = new QueueItem(null, 0, this.getTotalFrames(), times, 0);
		}

		if(complete)
		{
			queue.then(complete);
		}

		this._queue.add(queue);

		this.paused = false;

		return this;
	}

	public resume():ImageSequence
	{
		this.paused = false;
		return this;
	}

	public pause():ImageSequence
	{
		this.paused = true;
		return this;
	}

	public end(all:boolean = false):ImageSequence
	{
		this._queue.end(all);
		return this;
	}

	public stop():ImageSequence
	{
		this.paused = true;

		this._queue.kill();

		return this;
	}
3
	public next():QueueItem
	{
		return this._queue.next();
	}

	public onTick(delta:number, accumulated:number):void
	{
		super.onTick(delta, accumulated);

		if(this.paused == false)
		{
			this._queue.onTick(delta);
			this.frame = this._queue.getFrame();
		}
	}

	public getTotalFrames():number
	{
		return this.frames;
	}

}

export default ImageSequence;
