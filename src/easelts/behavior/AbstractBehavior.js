define(["require", "exports"], function (require, exports) {
    /**
     * AbstractBehaviour
     *
     * @namespace easelts.behavior
     * @method AbstractBehavior
     * @author Mient-jan Stelling <mientjan.stelling@gmail.com>
     */
    var AbstractBehaviour = (function () {
        function AbstractBehaviour() {
            /**
             * @property owner
             */
            this.owner = null;
        }
        /**
         * @method initialize
         * @param {DisplayObject} owner
         */
        AbstractBehaviour.prototype.initialize = function (owner) {
            if (this.owner) {
                throw new Error('behavior already has an owner');
            }
            this.owner = owner;
        };
        AbstractBehaviour.prototype.destruct = function () {
            this.owner = null;
        };
        return AbstractBehaviour;
    })();
    return AbstractBehaviour;
});
