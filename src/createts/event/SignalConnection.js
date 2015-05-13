define(["require", "exports"], function (require, exports) {
    var SignalConnection = (function () {
        function SignalConnection(signal, listener) {
            this._next = null;
            this.stayInList = true;
            this._signal = signal;
            this._listener = listener;
        }
        SignalConnection.prototype.once = function () {
            this.stayInList = false;
            return this;
        };
        SignalConnection.prototype.dispose = function () {
            if (this._signal != null) {
                this._signal.disconnect(this);
                this._signal = null;
            }
        };
        return SignalConnection;
    })();
    return SignalConnection;
});
