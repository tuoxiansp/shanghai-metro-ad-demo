define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var _ = require('lodash');

    /*
     * @name <%= name %>
     * @constructor
     * @description
     * created by View.template
     */

    function <%= name %> () {
        View.apply(this, arguments);
    }

    <%= name %>.prototype = Object.create(View.prototype);
    <%= name %>.prototype.constructor = <%= name %>;

    <%= name %>.DEFAULT_OPTIONS = {};

    module.exports = <%= name %>;
});
