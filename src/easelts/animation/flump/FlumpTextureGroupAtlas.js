define(["require", "exports", '../../../core/util/Promise', "./FlumpTexture"], function (require, exports, Promise_1, FlumpTexture_1) {
    "use strict";
    var FlumpTextureGroupAtlas = (function () {
        function FlumpTextureGroupAtlas(renderTexture, json) {
            this.flumpTextures = {};
            this.renderTexture = renderTexture;
            var textures = json.textures;
            for (var i = 0; i < textures.length; i++) {
                var texture = textures[i];
                this.flumpTextures[texture.symbol] = new FlumpTexture_1.FlumpTexture(renderTexture, texture);
            }
        }
        FlumpTextureGroupAtlas.load = function (flumpLibrary, json) {
            var file = json.file;
            var url = flumpLibrary.url + '/' + file;
            return new Promise_1.Promise(function (resolve, reject) {
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
    }());
    exports.FlumpTextureGroupAtlas = FlumpTextureGroupAtlas;
});
