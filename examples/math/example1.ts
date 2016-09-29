
import {Stage} from "../../src/easelts/display/Stage";
import {Bitmap} from "../../src/easelts/display/Bitmap";
import {Matrix4} from "../../src/core/math/Matrix4";
import {Vector3} from "../../src/core/math/Vector3";
import {Quaternion} from "../../src/core/math/Quaternion";
import {MathUtil} from "../../src/core/math/MathUtil";
import {Interval} from "../../src/core/util/Interval";

var holder = <HTMLDivElement> document.getElementById('holder');
var stage = new Stage(holder, true);

var image = new Bitmap('../assets/image/ninepatch_red.png', 0, 0, '50%', '50%', '50%', '50%');
stage.addChild(image);


//
//setInterval(() => {
//	image.x++;
//}, 1000/60)

var m = new Matrix4();

//
var x = new Matrix4();
var y = new Matrix4();
var z = new Matrix4();

var alpha = 0;
var beta = Math.PI;
var gamma = Math.PI/2;


//
//
//
//
//// this will keep drawing the image / you can also do a update when this image is loaded.
//
var position = new Vector3();
var rotation = new Quaternion();
var scale = new Vector3();
//

var test  = () => {
	alpha += .01;
	beta += .01;
	x.makeRotationX( alpha  );
	y.makeRotationY( beta );
	z.makeRotationZ( gamma );

	m.multiplyMatrices( x, y );
	m.multiply( z );

	m.setPosition(new Vector3(300,250,10));

	m.decompose(position, rotation, scale);

	image.x = position.x;
	image.y = position.y;
	image.rotation = MathUtil.radToDeg(rotation.z);

	//console.log(position.x, position.y, position.z);
	//console.log(rotation.x, rotation.y, rotation.z);
	//console.log(scale.x, scale.y, scale.z);

}

var inter = new Interval(60).attach(test);

stage.start();