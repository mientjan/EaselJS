///<reference path="../../assets/scripts/lib/gsap/greensock.d.ts" />

import Container = require('../../../src/easelts/display/Container')

class Carousel extends Container
{
	prevScrollX = 0;
	prevScrollY = 0;
	_page = 0;

	constructor(width?, height?, x?, y?, regX?, regY?)
	{
		super(width, height, x, y, regX, regY);

		this.enableMouseInteraction();
	}

	public setPage(value:number)
	{
		this.reset();
		this._page = value;
		this.y = this._page * -this.height;

		this.onScroll(this.x, this.y);
	}

	public next(onComplete:Function = null)
	{
		this._page++;
		this.animateToPage(this._page, onComplete);
	}

	public prev(onComplete:Function = null)
	{
		this._page--;
		this.animateToPage(this._page, onComplete);
	}

	public reset()
	{
		// reset all positions
		this._page = 0;
		this.prevScrollY = 0;
		this.prevScrollX = 0;
		this.y = 0;

		for(var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.setY(this.height * i);
			child.visible = true;
		}
	}

	public animateToPage(page, onComplete:Function = null)
	{
		TweenLite.killTweensOf(this);
		TweenLite.to(this, 1, {
			y: page * -this.height,
			onComplete: onComplete,
			onUpdate: () =>
			{
				this.onScroll(this.x, this.y);
			}
		});
	}

	public onScroll(x, y)
	{
		var children = this.children,
			length = children.length,
			width = this.width,
			height = this.height,
			child,
			x0, y0, x1, y1;

		var direction = this.prevScrollY - y;

		this.prevScrollX = x;
		this.prevScrollY = y;

		x = -x;
		y = -y;

		for(var i = 0; i < length; i++)
		{
			child = children[i];
			x0 = child.x - x;
			y0 = child.y - y;
			x1 = x0 + child.width;
			y1 = y0 + child.height;

			if(x0 < width && y0 < height && x1 > 0 && y1 > 0)
			{
				child.visible = true;
			}
			else
			{
				child.visible = false;

				if(direction > 0)
				{
					if(y > child.y)
					{
						child.setY(child.y + (height * length));
					}
				}
				else if(direction < 0)
				{
					if((y + height) < child.y)
					{
						child.setY(child.y - (height * length));
					}
				}
			}

		}
	}

	onResize(width:number, height:number)
	{
		super.onResize(width, height);
		this.reset();
	}
}

export = Carousel;