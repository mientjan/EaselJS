define(["require", "exports", './FlumpTexture', '../../../core/util/Promise'], function (require, exports, FlumpTexture_1, Promise_1) {
    var FlumpTextureGroupAtlas = (function () {
        function FlumpTextureGroupAtlas(renderTexture, json) {
            this.flumpTextures = {};
            this.renderTexture = renderTexture;
            var textures = json.textures;
            for (var i = 0; i < textures.length; i++) {
                var texture = textures[i];
                this.flumpTextures[texture.symbol] = new FlumpTexture_1.default(renderTexture, texture);
            }
        }
        FlumpTextureGroupAtlas.load = function (flumpLibrary, json) {
            var file = json.file;
            var url = flumpLibrary.url + '/' + file;
            return new Promise_1.default(function (resolve, reject) {
                var img = document.createElement('img');
                img.onload = function () {
                    resolve(img);
                };
                img.onerror = function () {
                    reject();
                };
                img.src = url;
            }).then(function (data) {
                return new FlumpTextureGroupAtlas(data, json);
            });
        };
        return FlumpTextureGroupAtlas;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FlumpTextureGroupAtlas;
});
