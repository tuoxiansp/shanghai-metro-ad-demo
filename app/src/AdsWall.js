define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Utility = require('famous/utilities/Utility');
    var Fader = require('famous/modifiers/Fader');

    var VirtualViewSequence = require('famous-flex/VirtualViewSequence');
    var FlexScrollView = require('famous-flex/FlexScrollView');

    var _ = require('lodash');

    function AdsFactory() {}

    AdsFactory.prototype.create = function(index) {
        var imgSurface = new ImageSurface({
            content: require('content/whatsdota.jpg'),
            properties: {
                pointerEvents: 'none'
            }
        });
        imgSurface.index = index || 0;
        return imgSurface;
    };

    AdsFactory.prototype.createNext = function(renderable) {
        return this.create(renderable.index + 1);
    };

    AdsFactory.prototype.createPrevious = function(renderable) {
        return this.create(renderable.index - 1);
    };

    function AdsMovingVars() {
        this.speed = 100;
        this.spacing = 0;
        this.isMoving = false;
        this.blink = false;
        this.deviation = 0;
    }

    /**
     * 检测画面是否正对列车
     * @param  {[type]} offset    [description]
     * @param  {[type]} interval  [description]
     * @param  {[type]} deviation [description]
     * @return {[type]}           [description]
     */
    function checkIsOffsetOk(offset, interval, deviation) {
        var mod = offset % interval;
        return mod <= deviation;
    }

    /*
     * @name AdsWall
     * @constructor
     * @description
     * created by View.template
     */

    function AdsWall () {
        View.apply(this, arguments);

        var viewSequence = new VirtualViewSequence({
            factory: new AdsFactory()
        });

        var fader = new Fader({
            transition: false
        });
        this.fader = fader;

        fader.show();

        var layout = new FlexScrollView({
            dataSource: viewSequence,
            mouseMove: true,
            // autoPipeEvents: true,
            useContainer: true,
            direction: Utility.Direction.X
        });
        this.layout = layout;

        this.add(fader).add(layout);

        this.movingVars = new AdsMovingVars();

        Engine.on('prerender', function() {
            var movingVars = this.movingVars;
            this.layout.setOptions({
                layoutOptions: {
                    spacing: movingVars.spacing
                }
            });
            if(movingVars.isMoving) {
                var deltaTime = Engine.frameTime;
                var deltaDistance = deltaTime * movingVars.speed;
                this.layout.scroll(deltaDistance);
            }
            if(movingVars.blink) {
                if(checkIsOffsetOk(this.layout.getOffset(), movingVars.spacing+window.innerWidth, movingVars.deviation)) {
                    this.fader.show();
                }
                else {
                    if(this.fader.isVisible()) {
                        this.fader.hide();
                    }
                }
            }
            else {
                if(!this.fader.isVisible()) {
                    this.fader.show();
                }
            }
        }.bind(this));
    }

    AdsWall.prototype = Object.create(View.prototype);
    AdsWall.prototype.constructor = AdsWall;

    AdsWall.prototype.getMovingVars = function() {
        return this.movingVars;
    };

    AdsWall.DEFAULT_OPTIONS = {
        // speed: 
    };

    module.exports = AdsWall;
});
