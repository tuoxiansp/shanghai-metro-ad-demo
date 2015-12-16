define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Utility = require('famous/utilities/Utility');
    var Fader = require('famous/modifiers/Fader');
    var Timer = require('famous/utilities/Timer');

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
        this.lockSpacing = true;
        this.fps = 30;
        this.autoBlink = false;
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

    /**
     * 计算两张图之间的间隔，这个公式说明没有足够的速度是无法实现稳定的led广告的
     * 1/fps * speed = width + spacing
     */
    function calcSpacing(fps, speed, width) {
        return 1/fps * 1000 * speed - width;
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
            if(movingVars.lockSpacing) {
                var tempSpacing = calcSpacing(movingVars.fps, movingVars.speed, window.innerWidth);
                if(tempSpacing < 0) {
                    console.log('速度不足');
                }
                else {
                    movingVars.spacing = tempSpacing;
                }
            }
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

        Engine.on('postrender', function() {
            if(this.autoBlinkTimer) {
                this.fader.hide();
            }
        }.bind(this));
    }

    AdsWall.prototype = Object.create(View.prototype);
    AdsWall.prototype.constructor = AdsWall;

    AdsWall.prototype.getMovingVars = function() {
        return this.movingVars;
    };

    AdsWall.prototype.autoBlink = function() {
        var shouldAutoBlink = this.movingVars.autoBlink;
        if(shouldAutoBlink) {
            this.autoBlinkTimer = Timer.setInterval(function() {
                if(!this.fader.isVisible()) {
                    this.fader.show();
                }
            }.bind(this), 1/this.movingVars.fps);
        }
        else {
            Timer.clear(this.autoBlinkTimer);
        }
    };

    AdsWall.DEFAULT_OPTIONS = {
        // speed: 
    };

    module.exports = AdsWall;
});
