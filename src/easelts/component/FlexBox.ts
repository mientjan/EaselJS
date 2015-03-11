/**
 * Created by pieters on 10-Mar-15.
 */
import Container = require('../display/Container');
import DisplayObject = require('../display/DisplayObject');
import Size = require('../geom/Size');
import Layout = require('../../facebook/Layout');

class FlexBox extends Container
{
	public style = {};

	constructor(width:any = '100%', height:any = '100%', x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super(width, height, x, y, regX, regY);
	}

	public onResize(size:Size):void
	{
		super.onResize(size);

		this.layout();
	}

	public layout():void
	{
		if (this.children.length > 0)
		{
			var tree:any = this.buildTree(this);
			tree.style = {width: this.width, height: this.height, flexDirection: "row", flexWrap: "wrap", alignItems: "center"};

			var t0 = performance.now();

			Layout.fillNodes(tree);
			Layout.computeLayout(tree);
			console.log(tree);

			for(var i = 0; i < tree.children.length; i++)
			{
				this.applyLayout(this.getChildAt(i), tree.children[i]);
			}

			var t1 = performance.now();
			//console.log("Layout took " + (t1 - t0) + " milliseconds.")
		}
	}

	public applyLayout(node:any, tree:any):void
	{
		node.setGeomTransform(tree.layout.width, tree.layout.height, tree.layout.left, tree.layout.top);

		for(var i = 0; i < tree.children.length; i++)
		{
			this.applyLayout(node.getChildAt(i), tree.children[i]);
		}
	}

	public addChild(...children:DisplayObject[]):DisplayObject
	{
		var child:DisplayObject = super.addChild.apply(this, arguments);

		this.layout();

		return child;
	}

	public removeChild(...children:DisplayObject[])
	{
		var result:boolean = super.removeChild.apply(this, arguments);

		this.layout();

		return result;
	}

	private buildTree(node:any):Object
	{
		var result = {
			style: node.style || {width: node.width, height: node.height, margin: 20, flex: 1},
			children: []
		};

		if (node.hasOwnProperty("children") && node.children.length > 0)
		{
			result

			for(var i = 0; i < node.children.length; i++)
			{
				result.children.push(this.buildTree(node.children[i]));
			}
		}

		return result;
	}
}

export = FlexBox;