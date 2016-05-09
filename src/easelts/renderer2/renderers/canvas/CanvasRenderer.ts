import {RenderType} from "../../../enum/RenderType";
import {SystemRenderer} from "../SystemRenderer";
import {CanvasMaskManager} from "./utils/CanvasMaskManager";
// var SystemRenderer = require('../SystemRenderer'),
//     CanvasMaskManager = require('./utils/CanvasMaskManager'),
//     CanvasRenderTarget = require('./utils/CanvasRenderTarget'),
//     mapCanvasBlendModesToPixi = require('./utils/mapCanvasBlendModesToPixi'),
//     utils = require('../../utils'),
//     CONST = require('../../const');

/**
 * The CanvasRenderer draws the scene and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.SystemRenderer
 * @param [width=800] {number} the width of the canvas view
 * @param [height=600] {number} the height of the canvas view
 * @param [options] {object} The optional renderer parameters
 * @param [options.view] {HTMLCanvasElement} the canvas to use as a view, optional
 * @param [options.transparent=false] {boolean} If the render view is transparent, default false
 * @param [options.autoResize=false] {boolean} If the render view is automatically resized, default false
 * @param [options.antialias=false] {boolean} sets antialias (only applicable in chrome at the moment)
 * @param [options.resolution=1] {number} the resolution of the renderer retina would be 2
 * @param [options.clearBeforeRender=true] {boolean} This sets if the CanvasRenderer will clear the canvas or
 *      not before the new render pass.
 * @param [options.roundPixels=false] {boolean} If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
 */
export class CanvasRenderer extends SystemRenderer
{

    public type:RenderType = RenderType.CANVAS;
    public rootContext:CanvasRenderingContext2D;
    public rootResolution:number;
    /**
     * Boolean flag controlling canvas refresh.
     *
     * @member {boolean}
     */
    public refresh = true;

    /**
     * Instance of a CanvasMaskManager, handles masking when using the canvas renderer.
     *
     * @member {PIXI.CanvasMaskManager}
     */
    public maskManager = new CanvasMaskManager(this);

    /**
     * The canvas property used to set the canvas smoothing property.
     *
     * @member {string}
     */
    public smoothProperty = 'imageSmoothingEnabled';


    constructor(width, height, options:any = {}) {

        super('Canvas', width, height, options);

        this.rootContext = this.view.getContext('2d', {alpha: this.transparent});
        this.rootResolution = this.resolution;


        if (!this.rootContext['imageSmoothingEnabled']) {
            if (this.rootContext['webkitImageSmoothingEnabled']) {
                this.smoothProperty = 'webkitImageSmoothingEnabled';
            }
            else if (this.rootContext['mozImageSmoothingEnabled']) {
                this.smoothProperty = 'mozImageSmoothingEnabled';
            }
            else if (this.rootContext['oImageSmoothingEnabled']) {
                this.smoothProperty = 'oImageSmoothingEnabled';
            }
            else if (this.rootContext['msImageSmoothingEnabled']) {
                this.smoothProperty = 'msImageSmoothingEnabled';
            }
        }

        this.initPlugins();

        this.blendModes = mapCanvasBlendModesToPixi();
        this._activeBlendMode = null;

        this.context = null;
        this.renderingToScreen = false;

        this.resize(width, height);
    }


    /**
     * Renders the object to this canvas view
     *
     * @param object {PIXI.DisplayObject} the object to be rendered
     */
    public render(displayObject, renderTexture, clear, transform, skipUpdateTransform) {

        if (!this.view) {
            return;
        }

        // can be handy to know!
        this.renderingToScreen = !renderTexture;

        this.emit('prerender');

        if (renderTexture) {
            renderTexture = renderTexture.baseTexture || renderTexture;

            if (!renderTexture._canvasRenderTarget) {

                renderTexture._canvasRenderTarget = new CanvasRenderTarget(renderTexture.width, renderTexture.height, renderTexture.resolution);
                renderTexture.source = renderTexture._canvasRenderTarget.canvas;
                renderTexture.valid = true;
            }

            this.context = renderTexture._canvasRenderTarget.context;
            this.resolution = renderTexture._canvasRenderTarget.resolution;
        }
        else {

            this.context = this.rootContext;
            this.resolution = this.rootResolution;
        }

        var context = this.context;


        this._lastObjectRendered = displayObject;


        if (!skipUpdateTransform) {
            // update the scene graph
            var cacheParent = displayObject.parent;
            var tempWt = this._tempDisplayObjectParent.projectionMatrix2d;

            if (transform) {
                transform.copy(tempWt);
            }
            else {
                tempWt.identity();
            }

            displayObject.parent = this._tempDisplayObjectParent;
            displayObject.updateTransform();
            displayObject.parent = cacheParent;
            // displayObject.hitArea = //TODO add a temp hit area
        }


        context.setTransform(1, 0, 0, 1, 0, 0);
        context.globalAlpha = 1;
        context.globalCompositeOperation = this.blendModes[CONST.BLEND_MODES.NORMAL];

        if (navigator.isCocoonJS && this.view.screencanvas) {
            context.fillStyle = 'black';
            context.clear();
        }

        if (clear || this.clearBeforeRender) {
            if (this.transparent) {
                context.clearRect(0, 0, this.width, this.height);
            }
            else {
                context.fillStyle = this._backgroundColorString;
                context.fillRect(0, 0, this.width, this.height);
            }
        }

        // TODO RENDER TARGET STUFF HERE..
        var tempContext = this.context;

        this.context = context;
        displayObject.renderCanvas(this);
        this.context = tempContext;

        this.emit('postrender');
    }


    public setBlendMode(blendMode) {
        if (this._activeBlendMode === blendMode) {
            return;
        }

        this.context.globalCompositeOperation = this.blendModes[blendMode];
    }

    /**
     * Removes everything from the renderer and optionally removes the Canvas DOM element.
     *
     * @param [removeView=false] {boolean} Removes the Canvas element from the DOM.
     */
    public destroy(removeView) {
        this.destroyPlugins();

        // call the base destroy
        SystemRenderer.prototype.destroy.call(this, removeView);

        this.context = null;

        this.refresh = true;

        this.maskManager.destroy();
        this.maskManager = null;

        this.smoothProperty = null;
    }

    /**
     * @extends PIXI.SystemRenderer#resize
     *
     * @param {number} w
     * @param {number} h
     */
    public resize(w, h) {
        this.super(w, h);

        //reset the scale mode.. oddly this seems to be reset when the canvas is resized.
        //surely a browser bug?? Let pixi fix that for you..
        if (this.smoothProperty) {
            this.rootContext[this.smoothProperty] = (CONST.SCALE_MODES.DEFAULT === CONST.SCALE_MODES.LINEAR);
        }

    }
}