// Copyright zhaoqiying.cn@gmail.com
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Date: 2013-06-07
// This is a toy.

;(function( window, undefined ) {
	var root = this;
	var zGraph = root.zGraph || {};

 	var breaker = {};

 	//////////////////////////////////////////////////////////////////////////////////////////////////////
	var sin = Math.sin,
		cos = Math.cos,
		min = Math.min,
		atan2 = Math.atan2,
		sqrt = Math.sqrt,
		round = Math.round,
		abs = Math.abs,
		PI = Math.PI,
		pow = Math.pow;

	// Save bytes in the minified (but not gzipped) version:
	var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	// Create quick reference variables for speed access to core prototypes.
	var slice = ArrayProto.slice,
		unshift = ArrayProto.unshift,
		toString = ObjProto.toString,
		hasOwnProperty = ObjProto.hasOwnProperty;

	// All **ECMAScript 5** native function implementations that we hope to use
	// are declared here.
	var
		nativeForEach = ArrayProto.forEach,
		nativeMap = ArrayProto.map,
		nativeReduce = ArrayProto.reduce,
		nativeReduceRight = ArrayProto.reduceRight,
		nativeFilter = ArrayProto.filter,
		nativeEvery = ArrayProto.every,
		nativeSome = ArrayProto.some,
		nativeIndexOf = ArrayProto.indexOf,
		nativeLastIndexOf = ArrayProto.lastIndexOf,
		nativeIsArray = Array.isArray,
		nativeKeys = Object.keys,
		nativeBind = FuncProto.bind;
 	//////////////////////////////////////////////////////////////////////////////////////////////////////


	var _ = zGraph.utils = function(obj) { return new wrapper(obj); };
	var wrapper = function(obj) { this._wrapped = obj; };
  	_.prototype = wrapper.prototype;

	// The cornerstone, an `each` implementation, aka `forEach`.
	// Handles objects with the built-in `forEach`, arrays, and raw objects.
	// Delegates to **ECMAScript 5**'s native `forEach` if available.
	var each = _.each = _.forEach = function(obj, iterator, context) {
		if (obj == null) return;
		if (nativeForEach && obj.forEach === nativeForEach) {
		  obj.forEach(iterator, context);
		} else if (obj.length === +obj.length) {
		  for (var i = 0, l = obj.length; i < l; i++) {
		    if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
		  }
		} else {
		  for (var key in obj) {
		    if (_.has(obj, key)) {
		      if (iterator.call(context, obj[key], key, obj) === breaker) return;
		    }
		  }
		}
	};

	_.extend = function(obj) {
		each(slice.call(arguments, 1), function(source) {
		  for (var prop in source) {
		    obj[prop] = source[prop];
		  }
		});
		return obj;
	};

	// TYPE
	zGraph.type = {};

	// DOM 
	zGraph.dom = {
		getElement : function(id){
			return typeof(id) === 'string' ? document.getElementById(id) : id;
		},
		appendTo : function(elem) {
			this.getElement(elem).appendChild(this.domElement);
			return this;
    	}
	};

	// Merge Object tool
	_.extend(_, zGraph.dom);

 	/////////////////////////////////////////////circle///////////////////////////////////////////////////
	// Circle constructor
	zGraph.circle = function (id, params) {
		var params = params || {};
		var elm = document.createElement('canvas');
		// The CANVAS element
		if ( ! elm.getContext ){ return; }

		var div = document.createElement('div');
		div.appendChild(elm);

		this.canvas = elm;
		this.canvas.id = id;
		this.ctx = this.canvas.getContext('2d');

		this.domElement = div;
		this.domElement.id = 'zGraph_cicle_' + id + '_parent';
		this.canvas.width = params.width || 400;
		this.canvas.height = params.height || 300;

		this.canvas.style.margin = "0";
		this.canvas.style.padding = "0";

		this.canvas.parentNode.style.position = "relative";
		this.canvas.parentNode.style.padding = "0";
		this.canvas.parentNode.style.margin = "0";

		this.canvas.parentNode.style.width = this.canvas.width + "px";
		this.canvas.parentNode.style.height = this.canvas.height + "px";

	};

	// Draw Canvas
	zGraph.circle.prototype.draw = function(items, inparams) {
		if( ! this.ctx ) {return;}

		// clear view
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
		var divs = this.domElement.childNodes;
		var cLen = divs.length;
		for (var i = cLen - 1; i >= 0; i--) {
			if(divs[i].nodeName.match(/^DIV$/i)){
				divs[i].parentNode.removeChild(divs[i]);
			}
		};

		// Parameter initialization
		var params = {
			backgroundColor : null,
			shadow : true,
			border : false,
			caption : false,
			captionNum : true,
			captionRate : true,
			fontSize : "12px",
			fontFamily : "Arial,sans-serif",
			textShadow : true,
			captionColor : "#ffffff",
			startAngle : -90,
			legend : true,
			legendFontSize : "12px",
			legendFontFamily : "Arial,sans-serif",
			legendColor : "#000000",
			otherCaption : "other"
		};

		if( inparams && typeof(inparams) == 'object' ) {
			for( var key in inparams ) {
				params[key] = inparams[key];
			}
		}
		this.params = params;
		// Canvas Background Color
		if( params.backgroundColor ) {
			this.ctx.beginPath();
			this.ctx.fillStyle = params.backgroundColor;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
		// The legend hidden force vertical width if it is less than 200 the width of the CANVAS element or less than 1.5 times, the vertical width
		if(this.canvas.width / this.canvas.height < 1.5 || this.canvas.height < 200) {
			params.legend == false;
		}
		// Full coordinates CANVAS elements
		var canvas_pos = this._getElementAbsPos(this.canvas);
		// Center and radius of the pie chart
		var cpos = {
			x: this.canvas.width / 2,
			y: this.canvas.height / 2,
			r: min(this.canvas.width, this.canvas.height) * 0.8 / 2
		};
		// And if more than 10 items, and integrated into the "other" 10 items and subsequent
		items = this._fold_items(items);
		var item_num = items.length;
		if (item_num <= 0) return;

		if(params.legend == true) {
			// Pie chart center coordinates x
			cpos.x = this.canvas.height * 0.1 + cpos.r;
			// (The height of one line) to determine the height and then insert it provisionally DIV element
			var tmpdiv = document.createElement('DIV');
			tmpdiv.appendChild( document.createTextNode('zGraph.Cricle.TextNode') );
			tmpdiv.style.fontSize = params.legendFontSize;
			tmpdiv.style.fontFamily = params.legendFontFamily;
			tmpdiv.style.color = params.legendColor;
			tmpdiv.style.margin = "0";
			tmpdiv.style.padding = "0";
			tmpdiv.style.visible = "hidden";
			tmpdiv.style.position = "absolute";
			tmpdiv.style.left = canvas_pos.x.toString() + "px";
			tmpdiv.style.top = canvas_pos.y.toString() + "px";
			this.canvas.parentNode.appendChild(tmpdiv);
			
			var lpos = {
				x: this.canvas.height * 0.2 + cpos.r * 2,
				y: ( this.canvas.height - ( tmpdiv.offsetHeight * item_num + tmpdiv.offsetHeight * 0.2 * (item_num - 1) ) ) / 2,
				h: tmpdiv.offsetHeight
			};
			lpos.cx = lpos.x + lpos.h * 1.4; 				// Text indicates the start position (x coordinate)
			lpos.cw = this.canvas.width - lpos.cx;       	// Text indicates amplitude
			// Remove DIV element that is inserted temporarily
			tmpdiv.parentNode.removeChild(tmpdiv);
		}
		// utside the shadow
		if( params.shadow == true ) {
			this._make_shadow(cpos);
		}
		// Black painted outer
		this.ctx.beginPath();
		this.ctx.arc(cpos.x, cpos.y, cpos.r, 0, PI*2, false)
		this.ctx.closePath();
		this.ctx.fillStyle = "black";
		this.ctx.fill();
		// Full Total full value calculated in items
		var sum = 0;
		for(var i = 0; i < item_num; i++) {
			var n = items[i][1];
			if( isNaN(n) || n < 0 ) {
				throw new Error('invalid graph item data.' + n);
			}
			sum += n;
		}
		if(sum <= 0) {
			throw new Error('invalid graph item data.');
		}
		// Define the default color of each item
		var colors = ["24,41,206", "198,0,148", "214,0,0", "255,156,0", "33,156,0", "33,41,107", "115,0,90", "132,0,0", "165,99,0", "24,123,0"];
		// It depicts a pie chart
		var rates = [];
		var startAngle = this._degree2radian(params.startAngle);
		for(var i = 0; i < item_num; i++) {
			// Name of the item
			var cap = items[i][0];
			// The value of the item
			var n = items[i][1];
			// Ratio
			var r = n / sum;
			// Percent
			var p = round(r * 1000) / 10;
			// Depiction angle (in radians)
			var rad = this._degree2radian(360*r);
			// Arc end angle
			endAngle = startAngle + rad;
			// Identify the color of the pie chart
			var rgb = colors[i];
			var rgbo = this._csscolor2rgb(items[i][2]);
			if(rgbo) {
				rgb = rgbo.r + "," + rgbo.g + "," + rgbo.b;
			}
			//
			if(n > 0) {
				// Drawing an arc
				this.ctx.beginPath();
				if(p >= 100) {	// for excanvas
					this.ctx.arc(cpos.x, cpos.y, cpos.r, 0, PI*2, false);
				} else {
					this.ctx.moveTo(cpos.x,cpos.y);
					this.ctx.lineTo(
						cpos.x + cpos.r * cos(startAngle),
						cpos.y + cpos.r * sin(startAngle)
					);
					this.ctx.arc(cpos.x, cpos.y, cpos.r, startAngle, endAngle, false);
				}
				this.ctx.closePath();
				// Set a gradient of pie chart
				var radgrad = this.ctx.createRadialGradient(cpos.x,cpos.y,0,cpos.x,cpos.y,cpos.r);
				radgrad.addColorStop(0, "rgba(" + rgb + ",1)");
				radgrad.addColorStop(0.7, "rgba(" + rgb + ",0.85)");
				radgrad.addColorStop(1, "rgba(" + rgb + ",0.75)");
				this.ctx.fillStyle = radgrad;
				this.ctx.fill();
				// Border of the arc
				if(params.border == true) {
					this.ctx.stroke();
				}
				// Caption
				var drate;
				var fontSize;
				if(r <= 0.03) {
					drate = 1.1;
				} else if(r <= 0.05) {
					drate = 0.9;
				} else if(r <= 0.1) {
					drate = 0.8;
				} else if(r <= 0.15) {
					drate = 0.7;
				} else {
					drate = 0.6;
				}
				var cp = {
					x: cpos.x + (cpos.r * drate) * cos( (startAngle + endAngle) / 2 ),
					y: cpos.y + (cpos.r * drate) * sin( (startAngle + endAngle) / 2 )
				};
				var div = document.createElement('DIV');
				if(r <= 0.05) {
					if(params.captionRate == true) {
						div.appendChild( document.createTextNode( p + "%") );
					}
				} else {
					if(params.caption == true) {
						div.appendChild( document.createTextNode(cap) );
						if(params.captionNum == true || params.captionRate == true) {
							div.appendChild( document.createElement('BR') );
						}
					}
					if(params.captionRate == true) {
						div.appendChild( document.createTextNode( p + "%" ) );
					}
					if(params.captionNum == true) {
						var numCap = n;
						if(params.caption == true || params.captionRate == true) {
							numCap = "(" + numCap + ")";
						}
						div.appendChild( document.createTextNode( numCap ) );
					}
				}
				div.className = 'zGraph_cicle_text';
				div.style.position = 'absolute';
				div.style.textAlign = 'center';
				div.style.color = params.captionColor;
				div.style.fontSize = params.fontSize;
				div.style.fontFamily = params.fontFamily;
				div.style.margin = "0";
				div.style.padding = "0";
				div.style.visible = "hidden";
				if( params.textShadow == true ) {
					var dif = [ [ 0,  1], [ 0, -1], [ 1,  0], [ 1,  1], [ 1, -1], [-1,  0], [-1,  1], [-1, -1] ];
					for(var j=0; j<8; j++) {
						var s = div.cloneNode(true);
						this.canvas.parentNode.appendChild(s);
						s.style.color = "black";
						s.style.left = (parseFloat(cp.x - s.offsetWidth / 2 + dif[j][0])).toString() + "px";
						s.style.top = (cp.y - s.offsetHeight / 2 + dif[j][1]).toString() + "px";
					}
				}
				this.canvas.parentNode.appendChild(div);
				div.style.left = (cp.x - div.offsetWidth / 2).toString() + "px";
				div.style.top = (cp.y - div.offsetHeight / 2).toString() + "px";
			}
			// Legend
			if(params.legend == true) {
				// Txt
				var ltxt = document.createElement('DIV');
				ltxt.appendChild( document.createTextNode(cap) );
				ltxt.className = 'zGraph_cicle_legend_text';
				ltxt.style.position = "absolute";
				ltxt.style.fontSize = params.legendFontSize;
				ltxt.style.fontFamily = params.legendFontFamily;
				ltxt.style.color = params.legendColor;
				ltxt.style.margin = "0";
				ltxt.style.padding = "0";
				ltxt.style.left = lpos.cx.toString() + "px";
				ltxt.style.top = lpos.y.toString() + "px";
				ltxt.style.width = (lpos.cw).toString() + "px";
				ltxt.style.whiteSpace = "nowrap";
				ltxt.style.overflow = "hidden";
				this.canvas.parentNode.appendChild(ltxt);
				// Shadow of the sign
				if( params.shadow == true ) {
					this.ctx.beginPath();
					this.ctx.rect(lpos.x+1, lpos.y+1, lpos.h, lpos.h);
					this.ctx.fillStyle = "#222222";
					this.ctx.fill();
				}
				// Symbol
				this.ctx.beginPath();
				this.ctx.rect(lpos.x, lpos.y, lpos.h, lpos.h);
				this.ctx.fillStyle = "black";
				this.ctx.fill();
				this.ctx.beginPath();
				this.ctx.rect(lpos.x, lpos.y, lpos.h, lpos.h);
				var symbolr = {
					x: lpos.x + lpos.h / 2,
					y: lpos.y + lpos.h / 2,
					r: sqrt(lpos.h * lpos.h * 2) / 2
				};
				var legend_radgrad = this.ctx.createRadialGradient(symbolr.x,symbolr.y,0,symbolr.x,symbolr.y,symbolr.r);
				legend_radgrad.addColorStop(0, "rgba(" + rgb + ",1)");
				legend_radgrad.addColorStop(0.7, "rgba(" + rgb + ",0.85)");
				legend_radgrad.addColorStop(1, "rgba(" + rgb + ",0.75)");
				this.ctx.fillStyle = legend_radgrad;
				this.ctx.fill();
				/* */
				lpos.y = lpos.y + lpos.h * 1.2;
			}
			/* */
			startAngle = endAngle;
		}
		return this;
	};

	// Put together the 10 items within the item
	zGraph.circle.prototype._fold_items = function(items) {
		var len = items.length;
		if(len <= 10) { return items; }
		var n = 0;
		for( var i = 9; i < len; i++ ) {
			n += items[i][1];
		}
		var newitems = items.slice(0, 10);
		newitems[9] = [this.params.otherCaption, n];
		return newitems;
	};

	// Coordinate of the upper left point of the elm in the coordinate system with base point the browser display area left top
	zGraph.circle.prototype._getElementAbsPos = function(elm) {
		var obj = {};
		obj.x = elm.offsetLeft;
		obj.y = elm.offsetTop;
		while(elm.offsetParent) {
			elm = elm.offsetParent;
			obj.x += elm.offsetLeft;
			obj.y += elm.offsetTop;
		}
		return obj;
	};

	// Generation of Shadow
	zGraph.circle.prototype._make_shadow = function (cpos) {
		this.ctx.beginPath();
		this.ctx.arc(cpos.x+5, cpos.y+5, cpos.r, 0, PI*2, false)
		this.ctx.closePath();
		var radgrad = this.ctx.createRadialGradient(cpos.x+5,cpos.y+5,0,cpos.x+5,cpos.y+5,cpos.r);
		// ie
		if (document.uniqueID) {
			radgrad.addColorStop(0, '#555555');
		} else {
			radgrad.addColorStop(0, 'rgba(0,0,0,1)');
			radgrad.addColorStop(0.93, 'rgba(0,0,0,1)');
			radgrad.addColorStop(1, 'rgba(0,0,0,0)');
		}
		this.ctx.fillStyle = radgrad;
		this.ctx.fill();
	};

	// Convert to radians every angle
	zGraph.circle.prototype._degree2radian = function (degree) {
		return (PI/180) * degree;
	};

	// CSS color RGB CONVERSION text columns
	zGraph.circle.prototype._csscolor2rgb = function (c) {
		if( ! c ) { return null; }
		var color_map = {
			black: "#000000",
			gray: "#808080",
			silver: "#c0c0c0",
			white: "#ffffff",
			maroon: "#800000",
			red: "#ff0000",
			purple: "#800080",
			fuchsia: "#ff00ff",
			green: "#008000",
			lime: "#00FF00",
			olive: "#808000",
			yellow: "#FFFF00",
			navy: "#000080",
			blue: "#0000FF",
			teal: "#008080",
			aqua: "#00FFFF"
		};
		c = c.toLowerCase();
		var o = {};
		if( c.match(/^[a-zA-Z]+$/) && color_map[c] ) {
			c = color_map[c];
		}
		var m = null;
		if( m = c.match(/^\#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i) ) {
			o.r = parseInt(m[1], 16);
			o.g = parseInt(m[2], 16);
			o.b = parseInt(m[3], 16);
		} else if( m = c.match(/^\#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i) ) {
			o.r = parseInt(m[1]+"0", 16);
			o.g = parseInt(m[2]+"0", 16);
			o.b = parseInt(m[3]+"0", 16);
		} else if( m = c.match(/^rgba*\(\s*(\d+),\s*(\d+),\s*(\d+)/i) ) {
			o.r = m[1];
			o.g = m[2];
			o.b = m[3];
		} else if( m = c.match(/^rgba*\(\s*(\d+)\%,\s*(\d+)\%,\s*(\d+)\%/i) ) {
			o.r = round(m[1] * 255 / 100);
			o.g = round(m[2] * 255 / 100);
			o.b = round(m[3] * 255 / 100);
		} else {
			return null;
		}
		return o;
	};

	_.extend(zGraph.circle.prototype, _);
 	/////////////////////////////////////////////circle///////////////////////////////////////////////////

	if ( typeof window === "object" && typeof window.document === "object" ) {
		window.zGraph = zGraph;
	}

	if ( typeof define === 'function' && define.amd ) {
		define(function(){ return zGraph; });
	}else if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		module.exports = zGraph;
	}

	// module version
 	zGraph.circle.VERSION = '0.0.1';
})( window );