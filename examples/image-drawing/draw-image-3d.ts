
import {Vector3} from "../../src/core/math/Vector3";
import {Matrix4} from "../../src/core/math/Matrix4";
import {Stage} from "../../src/easelts/display/Stage";
import {Shape} from "../../src/easelts/display/Shape";
import {Interval} from "../../src/core/util/Interval";

var v3_0 = new Vector3();
var v3_1 = new Vector3();
var v3_2 = new Vector3();

var camera = new Matrix4().makePerspective(1, 4/3, 1, 1100);
//var cam = new Camera();

var world = new Matrix4().identity();
var end = new Matrix4().identity();


var holder = <HTMLDivElement> document.getElementById('holder');
var stage = new Stage(holder, {});

var total = 100;
var items = [];
for (var i = 0; i < total; i++) {
	var shape = new Shape();
	shape.graphics.beginFill('#FFFFFF').drawRect(0, 0, 10, 10);
	shape.x = Math.random() * stage.width;
	shape.y = Math.random() * stage.height;
	stage.addChild(shape);

	items.push( new Vector3(shape.x, shape.y, shape.x))
}
var interval = new Interval(60).attach(function (delta) {
	var children = stage.children;

	var end = camera.clone().multiply(world)

	children.forEach( element => {
		// end.applyToVector3Array()
	})
});


// this will keep drawing the image / you can also do a update when this image is loaded.
stage.start();