import Stage = require('../../src/easelts/display/Stage');
import Debug = require('../../src/easelts/display/Debug');
import Carousel = require('./example7/Carousel');
import BitmapNinePatch = require('../../src/easelts/component/BitmapNinePatch');
import NinePatch = require('../../src/easelts/component/bitmapninepatch/NinePatch');
import Rectangle = require('../../src/easelts/geom/Rectangle');
import TopButton = require('./example7/TopButton');
import BottomButton = require('./example7/BottomButton');

import ButtonBehavior = require('../../src/easelts/behavior/ButtonBehavior');

var holder = <HTMLBlockElement> document.getElementById('holder');
var stage = new Stage(holder, true);
stage.enableMouseOver();

var carousel = new Carousel();

stage.addChild(carousel);
carousel.addChild(new Debug('page0', '100%', '100%', 0, '0%', 0, 0));
carousel.addChild(new Debug('page1', '100%', '100%', 0, '100%', 0, 0));
carousel.addChild(new Debug('page2', '100%', '100%', 0, '200%', 0, 0));
carousel.addChild(new Debug('page3', '100%', '100%', 0, '300%', 0, 0));
carousel.addChild(new Debug('page4', '100%', '100%', 0, '400%', 0, 0));
carousel.addChild(new Debug('page5', '100%', '100%', 0, '500%', 0, 0));
carousel.animateToPage(0);

var top = new TopButton();
var bottom = new BottomButton();
top.addEventListener(Stage.EVENT_MOUSE_CLICK, () => carousel.prev() );
bottom.addEventListener(Stage.EVENT_MOUSE_CLICK, () => carousel.next() );

stage.addChild(top);
stage.addChild(bottom);

stage.start();
//
//
//var container:createjs.Container = new createjs.Container();
//container.name = country;
//var circle = new createjs.Shape();
//circle.graphics.beginFill(this.colorMap[country].color).drawCircle(0, 0, 50);
//circle.name = 'circle';
//var mask = new createjs.Bitmap(this.colorMap[country].img);
//mask.name = 'mask';
//circle.compositeOperation = 'source-over';
//mask.compositeOperation = 'destination-in';
//container.addChild(circle);
//container.addChild(mask);
//this._stage.addChild(container);