define(["require", "exports"], function (require, exports) {
    var time = Date.now || function () {
        return +new Date();
    };
    var Animate = (function () {
        function Animate() {
        }
        Animate.stop = function (id) {
            var cleared = Animate.running[id] != null;
            if (cleared) {
                Animate.running[id] = null;
            }
            return cleared;
        };
        Animate.isRunning = function (id) {
            return Animate.running[id] != null;
        };
        Animate.start = function (stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
            var start = time();
            var lastFrame = start;
            var percent = 0;
            var dropCounter = 0;
            var id = Animate.counter++;
            if (!root) {
                root = document.body;
            }
            if (id % 20 === 0) {
                var newRunning = {};
                for (var usedId in Animate.running) {
                    newRunning[usedId] = true;
                }
                Animate.running = newRunning;
            }
            var step = function (virtual) {
                var render = virtual !== true;
                var now = time();
                if (!Animate.running[id] || (verifyCallback && !verifyCallback(id))) {
                    Animate.running[id] = null;
                    completedCallback && completedCallback(Animate.desiredFrames - (dropCounter / ((now - start) / Animate.millisecondsPerSecond)), id, false);
                    return;
                }
                if (render) {
                    var droppedFrames = Math.round((now - lastFrame) / (Animate.millisecondsPerSecond / Animate.desiredFrames)) - 1;
                    for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
                        step(true);
                        dropCounter++;
                    }
                }
                if (duration) {
                    percent = (now - start) / duration;
                    if (percent > 1) {
                        percent = 1;
                    }
                }
                var value = easingMethod ? easingMethod(percent) : percent;
                if ((stepCallback(value, now, render) === false || percent === 1) && render) {
                    Animate.running[id] = null;
                    completedCallback && completedCallback(Animate.desiredFrames - (dropCounter / ((now - start) / Animate.millisecondsPerSecond)), id, percent === 1 || duration == null);
                }
                else if (render) {
                    lastFrame = now;
                    Animate.requestAnimationFrame(step, root);
                }
            };
            Animate.running[id] = true;
            Animate.requestAnimationFrame(step, root);
            return id;
        };
        Animate.desiredFrames = 60;
        Animate.millisecondsPerSecond = 1000;
        Animate.running = {};
        Animate.counter = 1;
        Animate.requestAnimationFrame = (function () {
            var requestFrame = window.requestAnimationFrame || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || window['oRequestAnimationFrame'];
            var isNative = !!requestFrame;
            if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
                isNative = false;
            }
            if (isNative) {
                return function (callback, root) {
                    requestFrame(callback, root);
                };
            }
            var TARGET_FPS = 60;
            var requests = {};
            var requestCount = 0;
            var rafHandle = 1;
            var intervalHandle = null;
            var lastActive = +new Date();
            return function (callback, root) {
                var callbackHandle = rafHandle++;
                requests[callbackHandle] = callback;
                requestCount++;
                if (intervalHandle === null) {
                    intervalHandle = setInterval(function () {
                        var time = +new Date();
                        var currentRequests = requests;
                        requests = {};
                        requestCount = 0;
                        for (var key in currentRequests) {
                            if (currentRequests.hasOwnProperty(key)) {
                                currentRequests[key](time);
                                lastActive = time;
                            }
                        }
                        if (time - lastActive > 2500) {
                            clearInterval(intervalHandle);
                            intervalHandle = null;
                        }
                    }, 1000 / TARGET_FPS);
                }
                return callbackHandle;
            };
        })();
        return Animate;
    })();
    return Animate;
});
