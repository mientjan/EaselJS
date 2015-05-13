define(["require", "exports", './Tween'], function (require, exports, Tween) {
    var CSSPlugin = (function () {
        function CSSPlugin() {
            throw ("CSSPlugin cannot be instantiated.");
        }
        CSSPlugin.install = function () {
            var arr = [], map = CSSPlugin.cssSuffixMap;
            for (var n in map) {
                arr.push(n);
            }
            Tween.installPlugin(CSSPlugin, arr);
        };
        CSSPlugin.init = function (tween, prop, value) {
            var sfx0, sfx1, style, map = CSSPlugin.cssSuffixMap;
            if ((sfx0 = map[prop]) == null || !(style = tween.target.style)) {
                return value;
            }
            var str = style[prop];
            if (!str) {
                return 0;
            }
            var i = str.length - sfx0.length;
            if ((sfx1 = str.substr(i)) != sfx0) {
                throw ("CSSPlugin Error: Suffixes do not match. (" + sfx0 + ":" + sfx1 + ")");
            }
            else {
                return parseInt(str.substr(0, i));
            }
        };
        CSSPlugin.step = function (tween, prop, startValue, endValue, injectProps) {
        };
        CSSPlugin.tween = function (tween, prop, value, startValues, endValues, ratio, wait, end) {
            var style, map = CSSPlugin.cssSuffixMap;
            if (map[prop] == null || !(style = tween.target.style)) {
                return value;
            }
            style[prop] = value + map[prop];
            return Tween.IGNORE;
        };
        CSSPlugin.cssSuffixMap = {
            top: "px",
            left: "px",
            bottom: "px",
            right: "px",
            width: "px",
            height: "px",
            opacity: ""
        };
        CSSPlugin.priority = -100;
        return CSSPlugin;
    })();
    return CSSPlugin;
});
