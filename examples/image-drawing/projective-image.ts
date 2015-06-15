import Stage = require('../../src/easelts/display/Stage');
import Shape = require('../../src/easelts/display/Shape');
import BitmapNinePatch = require('../../src/easelts/component/BitmapNinePatch');
import MouseEvent = require('../../src/easelts/event/MouseEvent');
import ButtonBehavior = require('../../src/easelts/behavior/ButtonBehavior');
import NinePatch = require('../../src/easelts/component/bitmapninepatch/NinePatch');
import BitmapProjective = require('../../src/easelts/display/BitmapProjective');

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.enableMouseOver(20);

var points = [
	[100, 100],
	[200 + Math.random() * 200, 100],
	[100, 200 + Math.random() * 200],
	[200 + Math.random() * 200, 200 + Math.random() * 200]
];

var image = new BitmapProjective('../assets/image/ninepatch_red.png', points, 0, 0, 0);
stage.addChild(image);

stage.start();


var buttonPoints = [];
for(var i = 0; i < 4; i++)
{
	var btn = new Shape();
	btn.graphics.beginFill('#FF0').beginStroke('#000').drawRect(0,0,30,30);
	btn.addBehavior(new ButtonBehavior);

	btn.addEventListener(Stage.EVENT_PRESS_MOVE, function(index:number, event:MouseEvent)
	{
		var x = event.rawX;
		var y = event.rawY;
		var lx = event.getLocalX();
		var ly = event.getLocalY();

		points[index][0] = x;
		points[index][1] = y;

		this.x = x;
		this.y = y;

		image.setPoints(points);

	}.bind(btn, i));

	btn.x = points[i][0];
	btn.y = points[i][1];

	buttonPoints.push(btn);
	stage.addChild(btn);
}