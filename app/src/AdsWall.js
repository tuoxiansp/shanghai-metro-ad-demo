define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Utility = require('famous/utilities/Utility');

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

        var layout = new FlexScrollView({
            dataSource: viewSequence,
            mouseMove: true,
            // autoPipeEvents: true,
            useContainer: true,
            direction: Utility.Direction.X
        });
        this.layout = layout;

        this.add(layout);

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
