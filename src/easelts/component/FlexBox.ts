/**
 * Created by pieters on 10-Mar-15.
 */
import Container = require('../display/Container');
import DisplayObject = require('../display/DisplayObject');
import Size = require('../geom/Size');
import Layout = require('../../facebook/Layout');
import IFlexBoxStyle = require('./flexbox/IFlexBoxStyle');
import IFlexBoxNode = require('./flexbox/IFlexBoxNode');
import DisplayType = require('../enum/DisplayType');


/**
 * Usage example:
 *
 * var box:FlexBox = new FlexBox("100%", 400, 0, 0);
 * box.style = {flexDirection:"row", padding: 10};
 *
 * var square1:SquareColor = new SquareColor("#ff0000", 100, 100);
 * square1.style.flex = 1;
 * box.addChild(square1);
 *
 * var square2:SquareColor = new SquareColor("#ff0000", 100, 100);
 * square2.style.marginLeft = 10;
 * box.addChild(square2);
 */

class FlexBox extends Container
{
	constructor(width:any = '100%', height:any = '100%', x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super(width, height, x, y, regX, regY);
	}

	public updateLayout():void
	{
		if (this.children.length > 0)
		{
			var node:IFlexBoxNode = this.createNode(this);
			Layout.computeLayout(node);

			for(var i = 0; i < node.children.length; i++)
			{
				this.applyLayoutToChild(this.getChildAt(i), node.children[i]);
			}
		}
	}

	private applyLayoutToChild(child:DisplayObject, node:IFlexBoxNode):void
	{
		child.setGeomTransform(node.layout.width, node.layout.height, node.layout.left, node.layout.top);

		if (child.type === DisplayType.CONTAINER)
		{
			for(var i = 0; i < node.children.length; i++)
			{
				this.applyLayoutToChild((<Container>child).getChildAt(i), node.children[i]);
			}
		}
	}

	private createNode(displayObject:DisplayObject):IFlexBoxNode
	{
		displayObject.style.width = displayObject.width;
		displayObject.style.height = displayObject.height;

		var node:IFlexBoxNode = {
			layout: {left: 0, top: 0, width: undefined, height: undefined},
			style: displayObject.style,
			children: []
		};

		if (displayObject.type === DisplayType.CONTAINER)
		{
			for(var i = 0; i < (<Container>displayObject).children.length; i++)
			{
				node.children.push(this.createNode((<Container>displayObject).children[i]));
			}
		}

		return node;
	}

	public addChild(...children:DisplayObject[]):DisplayObject
	{
		return (this.updateLayoutAfterAddChild(super.addChild.apply(this, arguments)));
	}

	public addChildAt(child:DisplayObject, index:number):DisplayObject
	{
		return (this.updateLayoutAfterAddChild(super.addChildAt.apply(this, arguments)));
	}

	private updateLayoutAfterAddChild(child:DisplayObject):DisplayObject
	{
		this.updateLayout();

		return child;
	}

	public removeChild(...children:DisplayObject[]):boolean
	{
		return (this.updateLayoutAfterRemoveChild(super.removeChild.apply(this, arguments)));
	}

	public removeChildAt(...index:number[]):boolean
	{
		return (this.updateLayoutAfterRemoveChild(super.removeChildAt.apply(this, arguments)));
	}

	private updateLayoutAfterRemoveChild(result:boolean):boolean
	{
		if (result)
		{
			this.updateLayout();
		}

		return result;
	}

	public onResize(size:Size):void
	{
		super.onResize(size);

		this.updateLayout();
	}
}

export = FlexBox;