define(["require", "exports", "./FlumpLayerData"], function (require, exports, FlumpLayerData_1) {
    "use strict";
    var FlumpMovieData = (function () {
        function FlumpMovieData(flumpLibrary, json) {
            this.frames = 0;
            this.flumpLibrary = flumpLibrary;
            this.id = json.id;
            var layers = json.layers;
            this.flumpLayerDatas = new Array(layers.length);
            for (var i = 0; i < layers.length; i++) {
                var layer = new FlumpLayerData_1.FlumpLayerData(layers[i]);
                this.flumpLayerDatas[i] = layer;
                this.frames = Math.max(this.frames, layer.frames);
            }
        }
        return FlumpMovieData;
    }());
    exports.FlumpMovieData = FlumpMovieData;
});
