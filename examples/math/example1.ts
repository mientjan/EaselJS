import Stage = require('../../src/easelts/display/Stage');
import Bitmap = require('../../src/easelts/display/Bitmap');
import m4 = require('../../src/easelts/geom/Matrix4');
import v3 = require('../../src/easelts/geom/Vector3');
import q = require('../../src/easelts/geom/Quaternion');
import MathUtil = require('../../src/easelts/util/MathUtil');

import Ticker = require('../../src/createts/util/Ticker');

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);

var image = new Bitmap('../assets/image/ninepatch_red.png', 0, 0, '50%', '50%', '50%', '50%');
stage.addChild(image);


//
//setInterval(() => {
//	image.x++;
//}, 1000/60)

var m = new m4.Matrix4();

//
var x = new m4.Matrix4();
var y = new m4.Matrix4();
var z = new m4.Matrix4();

var alpha = 0;
var beta = Math.PI;
var gamma = Math.PI/2;


//
//
//
//
//// this will keep drawing the image / you can also do a update when this image is loaded.
//
var position = new v3.Vector3();
var rotation = new q.Quaternion();
var scale = new v3.Vector3();
//

var test  = () => {
	alpha += .01;
	beta += .01;
	x.makeRotationX( alpha  );
	y.makeRotationY( beta );
	z.makeRotationZ( gamma );

	m.multiplyMatrices( x, y );
	m.multiply( z );

	m.setPosition(new v3.Vector3(300,250,10));

	m.decompose(position, rotation, scale);

	image.x = position.x;
	image.y = position.y;
	image.rotation = MathUtil.radToDeg(rotation.z);

	//console.log(position.x, position.y, position.z);
	//console.log(rotation.x, rotation.y, rotation.z);
	//console.log(scale.x, scale.y, scale.z);

}
var signal = Ticker.getInstance().addTickListener(test);

//console.log(signal);

stage.start();