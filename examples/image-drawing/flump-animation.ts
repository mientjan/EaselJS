import Stage from '../../src/easelts/display/Stage';
import FlumpLibrary from '../../src/easelts/animation/FlumpLibrary';
import FlumpMovie from '../../src/easelts/animation/flump/FlumpMovie';
import ArrayUtil from "../../src/easelts/util/ArrayUtil";
import IDisplayObject from "../../src/easelts/interface/IDisplayObject";
import {StageOption} from "../../src/easelts/data/StageOption";

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, {autoResize:true}).setFpsCounter(true);

//stage.autoClear = false;
//var flump = new FlumpAnimation('../../assets/flump/smoke');
//flump.

//FlumpLibrary.load('../assets/flump/ani-100/TextAnimation').then((fl:FlumpLibrary) => {
//
//	for(var i = 0; i < 10000; i++)
//	{
//		var movie = <FlumpMovie> fl.createSymbol('TextLoopAnimation');
//		movie.setX(Math.random() * stage.width).setY(Math.random() * stage.height);
//		movie.play(-1);
//		stage.addChild(movie);
//	}
//
//}).catch( error => console.log(error) );

FlumpLibrary.load('../assets/flump/animations-100/character').then((fl:FlumpLibrary) => {

	var names = [
		'SupermanSuduction1',
		'SupermanSuduction2',
		'SupermanSuduction3',
		'SupermanDie',
		'SupermanWalk',
		'SupermanSuductionWin',
		'SupermanSuductionLose'
	];

	for(var i = 0; i < 60; i++)
	{
		var movie = <FlumpMovie> fl.createMovie(ArrayUtil.getRandom(names));
		//var movie = <FlumpMovie> fl.createMovie('SupermanWalk');
		movie.setX(Math.random() * stage.width|0).setY(Math.random() * stage.height|0);
		movie.play(-1);
		stage.addChild(movie);

		//var movie = <FlumpMovie> fl.createMovie('aniamtion_hope_sadTriangles');
		//movie.setX(Math.random() * stage.width).setY(Math.random() * stage.height);
		//movie.play(-1);
		//stage.addChild(movie);
	}

	stage.children.sort((item0:IDisplayObject, item1:IDisplayObject) => {
		return item0.y - item1.y;
	});



		//console.time('performance');
		//console.profile('performance');
		stage.start();

	setTimeout(() => {
		//console.profileEnd('performance');
		//console.timeEnd('performance');
	}, 5000)

	//var y0 = 0;
	//var y1 = 0;
	//stage.children.forEach((element) => {
	//	y0 = Math.min(element.y, y0);
	//	y1 = Math.max(element.y, y1);
	//})
	//stage.children.forEach((element) => {
	//	element.scaleX = element.scaleY = (element.y - y0) / y1;
	//	//y1 = Math.max(element.y, y1);
	//})

}).catch( error => console.log(error) );