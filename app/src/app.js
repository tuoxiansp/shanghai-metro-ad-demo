/**
 * 上海地铁运行中车窗外视频广告模拟演示
 */

var Engine = require('famous/core/Engine');
var AdsWall = require('AdsWall');
require('expose?dat.gui!dat-gui');

console.log(dat);

function start() {
	var mainContext = Engine.createContext();

	var adsWall = new AdsWall();
	mainContext.add(adsWall);

	var data = adsWall.getMovingVars();
	var gui = new dat.GUI();
	gui.add(data, 'speed');
	gui.add(data, 'spacing');
	gui.add(data, 'blink');
	gui.add(data, 'deviation');
	gui.add(data, 'isMoving');
};

module.exports.start = start;