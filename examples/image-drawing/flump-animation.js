define(["require", "exports", '../../src/easelts/display/Stage', '../../src/easelts/animation/FlumpLibrary', "../../src/easelts/util/ArrayUtil"], function (require, exports, Stage_1, FlumpLibrary_1, ArrayUtil_1) {
    "use strict";
    var holder = document.getElementById('holder');
    var stage = new Stage_1.default(holder, { autoResize: true }).setFpsCounter(true);
    FlumpLibrary_1.default.load('../assets/flump/animations-100/character').then(function (fl) {
        var names = [
            'SupermanSuduction1',
            'SupermanSuduction2',
            'SupermanSuduction3',
            'SupermanDie',
            'SupermanWalk',
            'SupermanSuductionWin',
            'SupermanSuductionLose'
        ];
        for (var i = 0; i < 60; i++) {
            var movie = fl.createMovie(ArrayUtil_1.default.getRandom(names));
            movie.setXY(Math.random() * stage.width | 0, Math.random() * stage.height | 0);
            var playMovie;
            playMovie = (function (movie) {
                var play;
                play = function () {
                    setTimeout(function () { return movie.play(1, null, play); }, 0);
                };
                return play;
            })(movie);
            stage.addChild(movie);
            playMovie();
        }
        stage.children.sort(function (item0, item1) {
            return item0.y - item1.y;
        });
        stage.start();
        setTimeout(function () {
        }, 5000);
    }).catch(function (error) { return console.log(error); });
});
