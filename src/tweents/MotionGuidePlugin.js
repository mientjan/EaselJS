define(["require", "exports", './Tween'], function (require, exports, Tween) {
    var MotionGuidePlugin = (function () {
        function MotionGuidePlugin() {
            throw ("MotionGuidePlugin cannot be instantiated.");
        }
        MotionGuidePlugin.install = function () {
            Tween.installPlugin(MotionGuidePlugin, ["guide", "x", "y", "rotation"]);
            return Tween.IGNORE;
        };
        MotionGuidePlugin.init = function (tween, prop, value) {
            var target = tween.target;
            if (!target.hasOwnProperty("x")) {
                target.x = 0;
            }
            if (!target.hasOwnProperty("y")) {
                target.y = 0;
            }
            if (!target.hasOwnProperty("rotation")) {
                target.rotation = 0;
            }
            if (prop == "rotation") {
                tween['__needsRot'] = true;
            }
            return prop == "guide" ? null : value;
        };
        MotionGuidePlugin.step = function (tween, prop, startValue, endValue, injectProps) {
            if (prop == "rotation") {
                tween['__rotGlobalS'] = startValue;
                tween['__rotGlobalE'] = endValue;
                MotionGuidePlugin.testRotData(tween, injectProps);
            }
            if (prop != "guide") {
                return endValue;
            }
            var temp, data = endValue;
            if (!data.hasOwnProperty("path")) {
                data.path = [];
            }
            var path = data.path;
            if (!data.hasOwnProperty("end")) {
                data.end = 1;
            }
            if (!data.hasOwnProperty("start")) {
                data.start = (startValue && startValue.hasOwnProperty("end") && startValue.path === path) ? startValue.end : 0;
            }
            if (data.hasOwnProperty("_segments") && data._length) {
                return endValue;
            }
            var l = path.length;
            var accuracy = 10;
            if (l >= 6 && (l - 2) % 4 == 0) {
                data._segments = [];
                data._length = 0;
                for (var i = 2; i < l; i += 4) {
                    var sx = path[i - 2], sy = path[i - 1];
                    var cx = path[i + 0], cy = path[i + 1];
                    var ex = path[i + 2], ey = path[i + 3];
                    var oldX = sx, oldY = sy;
                    var tempX, tempY, total = 0;
                    var sublines = [];
                    for (var j = 1; j <= accuracy; j++) {
                        var t = j / accuracy;
                        var inv = 1 - t;
                        tempX = inv * inv * sx + 2 * inv * t * cx + t * t * ex;
                        tempY = inv * inv * sy + 2 * inv * t * cy + t * t * ey;
                        total += sublines[sublines.push(Math.sqrt((temp = tempX - oldX) * temp + (temp = tempY - oldY) * temp)) - 1];
                        oldX = tempX;
                        oldY = tempY;
                    }
                    data._segments.push(total);
                    data._segments.push(sublines);
                    data._length += total;
                }
            }
            else {
                throw ("invalid 'path' data, please see documentation for valid paths");
            }
            temp = data.orient;
            data.orient = true;
            var targetData = MotionGuidePlugin.calc(data, data.start, {});
            tween['__rotPathS'] = Number(targetData.rotation.toFixed(5));
            MotionGuidePlugin.calc(data, data.end, targetData);
            tween['__rotPathE'] = Number(targetData.rotation.toFixed(5));
            data.orient = false;
            MotionGuidePlugin.calc(data, data.end, injectProps);
            data.orient = temp;
            if (!data.orient) {
                return endValue;
            }
            tween['__guideData'] = data;
            MotionGuidePlugin.testRotData(tween, injectProps);
            return endValue;
        };
        MotionGuidePlugin.testRotData = function (tween, injectProps) {
            if (tween['__rotGlobalS'] === void 0 || tween['__rotGlobalE'] === void 0) {
                if (tween['__needsRot']) {
                    return;
                }
                if (tween._curQueueProps.rotation !== void 0) {
                    tween['__rotGlobalS'] = tween['__rotGlobalE'] = tween._curQueueProps.rotation;
                }
                else {
                    tween['__rotGlobalS'] = tween['__rotGlobalE'] = injectProps.rotation = tween.target.rotation || 0;
                }
            }
            if (tween['__guideData'] === void 0) {
                return;
            }
            var data = tween['__guideData'];
            var rotGlobalD = tween['__rotGlobalE'] - tween['__rotGlobalS'];
            var rotPathD = tween['__rotPathE'] - tween['__rotPathS'];
            var rot = rotGlobalD - rotPathD;
            if (data.orient == "auto") {
                if (rot > 180) {
                    rot -= 360;
                }
                else if (rot < -180) {
                    rot += 360;
                }
            }
            else if (data.orient == "cw") {
                while (rot < 0) {
                    rot += 360;
                }
                if (rot == 0 && rotGlobalD > 0 && rotGlobalD != 180) {
                    rot += 360;
                }
            }
            else if (data.orient == "ccw") {
                rot = rotGlobalD - ((rotPathD > 180) ? (360 - rotPathD) : (rotPathD));
                while (rot > 0) {
                    rot -= 360;
                }
                if (rot == 0 && rotGlobalD < 0 && rotGlobalD != -180) {
                    rot -= 360;
                }
            }
            data.rotDelta = rot;
            data.rotOffS = tween['__rotGlobalS'] - tween['__rotPathS'];
            tween['__rotGlobalS'] = tween['__rotGlobalE'] = tween['__guideData'] = tween['__needsRot'] = undefined;
        };
        MotionGuidePlugin.tween = function (tween, prop, value, startValues, endValues, ratio, wait, end) {
            var data = endValues.guide;
            if (data == void 0 || data === startValues.guide) {
                return value;
            }
            if (data.lastRatio != ratio) {
                var t = ((data.end - data.start) * (wait ? data.end : ratio) + data.start);
                MotionGuidePlugin.calc(data, t, tween.target);
                switch (data.orient) {
                    case "cw":
                    case "ccw":
                    case "auto":
                        tween.target.rotation += data.rotOffS + data.rotDelta * ratio;
                        break;
                    case "fixed":
                    default:
                        tween.target.rotation += data.rotOffS;
                        break;
                }
                data.lastRatio = ratio;
            }
            if (prop == "rotation" && ((!data.orient) || data.orient == "false")) {
                return value;
            }
            return tween.target[prop];
        };
        MotionGuidePlugin.calc = function (data, ratio, target) {
            if (data._segments == undefined) {
            }
            if (target == undefined) {
                target = { x: 0, y: 0, rotation: 0 };
            }
            var seg = data._segments;
            var path = data.path;
            var pos = data._length * ratio;
            var cap = seg.length - 2;
            var n = 0;
            while (pos > seg[n] && n < cap) {
                pos -= seg[n];
                n += 2;
            }
            var sublines = seg[n + 1];
            var i = 0;
            cap = sublines.length - 1;
            while (pos > sublines[i] && i < cap) {
                pos -= sublines[i];
                i++;
            }
            var t = (i / ++cap) + (pos / (cap * sublines[i]));
            n = (n * 2) + 2;
            var inv = 1 - t;
            target.x = inv * inv * path[n - 2] + 2 * inv * t * path[n + 0] + t * t * path[n + 2];
            target.y = inv * inv * path[n - 1] + 2 * inv * t * path[n + 1] + t * t * path[n + 3];
            if (data.orient) {
                target.rotation = 57.2957795 * Math.atan2((path[n + 1] - path[n - 1]) * inv + (path[n + 3] - path[n + 1]) * t, (path[n + 0] - path[n - 2]) * inv + (path[n + 2] - path[n + 0]) * t);
            }
            return target;
        };
        MotionGuidePlugin.priority = 0;
        return MotionGuidePlugin;
    })();
    return MotionGuidePlugin;
});
