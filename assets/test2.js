(function (lib, img, cjs) {

	var p; // shortcut to reference prototypes

// stage content:
	(lib.RotatingCube = function(mode,startPosition,loop) {
		this.initialize(mode,startPosition,loop,{});

		// Layer 1
		this.instance = new lib.shape();
		this.instance.setTransform(263.5,215.5);

		this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:90},59).wait(1));

	}).prototype = p = new cjs.MovieClip();
	p.nominalBounds = new cjs.Rectangle(167,119,193,193);


// symbols:
	(lib.shape = function() {
		this.initialize();

		// Layer 1
		this.shape = new cjs.Shape();
		this.shape.graphics.f("#CE201D").s().p("AvDPEIAA+HIeHAAIAAeHg");

		this.addChild(this.shape);
	}).prototype = p = new cjs.Container();
	p.nominalBounds = new cjs.Rectangle(-96.4,-96.4,193,193);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;