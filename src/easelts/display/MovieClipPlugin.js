define(["require", "exports", "../../tweents/Tween", "./MovieClip"], function (require, exports, Tween_1, MovieClip_1) {
    "use strict";
    var MovieClipPlugin = (function () {
        function MovieClipPlugin() {
            throw ("MovieClipPlugin cannot be instantiated.");
        }
        MovieClipPlugin.install = function () {
            Tween_1.Tween.installPlugin(MovieClipPlugin, ["startPosition"]);
        };
        MovieClipPlugin.init = function (tween, prop, value) {
            return value;
        };
        MovieClipPlugin.step = function () {
        };
        MovieClipPlugin.tween = function (tween, prop, value, startValues, endValues, ratio, wait, end) {
            if (!(tween.target instanceof MovieClip_1.MovieClip)) {
                return value;
            }
            return (ratio == 1 ? endValues[prop] : startValues[prop]);
        };
        MovieClipPlugin.priority = 100;
        return MovieClipPlugin;
    }());
    exports.MovieClipPlugin = MovieClipPlugin;
});
