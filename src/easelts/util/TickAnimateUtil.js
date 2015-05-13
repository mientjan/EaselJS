define(["require", "exports"], function (require, exports) {
    var TickAnimateUtil = (function () {
        function TickAnimateUtil() {
        }
        TickAnimateUtil.getTimeByUID = function (uid) {
            if (!TickAnimateUtil._idCollection[uid]) {
                TickAnimateUtil._idCollection[uid] = { time: 0 };
            }
            return TickAnimateUtil._idCollection[uid];
        };
        TickAnimateUtil.jojo = function (tick, duration, element, from, to) {
            var time = TickAnimateUtil.getTimeByUID(element.id);
            time.time += tick;
            time.time %= duration;
        };
        TickAnimateUtil._idCollection = {};
        return TickAnimateUtil;
    })();
    return TickAnimateUtil;
});
