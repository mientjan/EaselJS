define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/display/Debug', '../../src/easelts/component/BitmapNinePatch', '../../src/easelts/component/bitmapninepatch/NinePatch', '../../src/easelts/geom/Rectangle', '../../src/easelts/behavior/ButtonBehavior'], function (require, exports, Stage, Debug, BitmapNinePatch, NinePatch, Rectangle, ButtonBehavior) {
    var holder = document.getElementById('holder');
    var stage = new Stage(holder, true);
    stage.enableMouseOver();
    stage.addChild(new Debug);
    var video = document.createElement('video');
    video.loop = true;
    video.src = 'assets/video/placeholder_480x270.mp4';
    video.width = 480;
    video.height = 270;
    video.play();
    var nine = new NinePatch(video, new Rectangle(100, 50, 280, 170));
    stage.addChild(new BitmapNinePatch(nine, '50%', '50%', '0%', '0%', '0%', '0%').addBehavior(new ButtonBehavior));
    stage.addChild(new BitmapNinePatch(nine, '50%', '50%', '100%', '0%', '100%', '0%').addBehavior(new ButtonBehavior));
    stage.addChild(new BitmapNinePatch(nine, '50%', '50%', '0%', '100%', '0%', '100%').addBehavior(new ButtonBehavior));
    stage.addChild(new BitmapNinePatch(nine, '50%', '50%', '100%', '100%', '100%', '100%').addBehavior(new ButtonBehavior));
    stage.start();
});
