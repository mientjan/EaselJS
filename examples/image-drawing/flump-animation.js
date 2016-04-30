define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/animation/FlumpLibrary', "../../src/easelts/util/ArrayUtil"], function (require, exports, Stage_1, FlumpLibrary_1, ArrayUtil_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.Stage(holder, { autoResize: true });
    stage.getRenderer().setFpsCounter(true);
    FlumpLibrary_1.FlumpLibrary.load('../assets/flump/animations-100/character').then(function (fl) {
        var names = [
            'SupermanSuduction1',
            'SupermanSuduction2',
            'SupermanSuduction3',
            'SupermanDie',
            'SupermanWalk',
            'SupermanSuductionWin',
            'SupermanSuductionLose'
        ];
        for (var i = 0; i < 100; i++) {
            var movie = fl.createMovie(ArrayUtil_1.ArrayUtil.getRandom(names));
            movie.setXY(Math.random() * stage.width | 0, Math.random() * stage.height | 0);
            movie.play(-1);
            stage.addChild(movie);
        }
        stage.children.sort(function (item0, item1) {
            return item0.y - item1.y;
        });
        stage.start();
        setTimeout(function () {
        }, 5000);
    }).catch(function (error) { return console.log(error); });
});
