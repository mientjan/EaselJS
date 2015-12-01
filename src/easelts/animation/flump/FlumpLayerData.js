define(["require", "exports", './FlumpKeyframeData'], function (require, exports, FlumpKeyframeData_1) {
    var FlumpLayerData = (function () {
        function FlumpLayerData(json) {
            this.flumpKeyframeDatas = [];
            this.name = json.name;
            this.flipbook = 'flipbook' in json ? !!json.flipbook : false;
            var keyframes = json.keyframes;
            var keyFrameData = null;
            for (var i = 0; i < keyframes.length; i++) {
                var keyframe = keyframes[i];
                keyFrameData = new FlumpKeyframeData_1.default(keyframe);
                this.flumpKeyframeDatas.push(keyFrameData);
            }
            this.frames = keyFrameData.index + keyFrameData.duration;
        }
        FlumpLayerData.prototype.getKeyframeForFrame = function (frame) {
            var datas = this.flumpKeyframeDatas;
            for (var i = 1; i < datas.length; i++) {
                if (datas[i].index > frame) {
                    return datas[i - 1];
                }
            }
            return datas[datas.length - 1];
        };
        FlumpLayerData.prototype.getKeyframeAfter = function (flumpKeyframeData) {
            for (var i = 0; i < this.flumpKeyframeDatas.length - 1; i++) {
                if (this.flumpKeyframeDatas[i] === flumpKeyframeData) {
                    return this.flumpKeyframeDatas[i + 1];
                }
            }
            return null;
        };
        return FlumpLayerData;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FlumpLayerData;
});
