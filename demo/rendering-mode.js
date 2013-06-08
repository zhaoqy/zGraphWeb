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

// This is a toy.

(function () {
	addEventListener(window, "load", show_rendering_mode);

	function show_rendering_mode() {
		var mode = "";
		if( document.documentMode === undefined ) {
			if(document.compatMode == "CSS1Compat") {
				mode = "Standards-compliance mode";
			} else {
				mode = "Quirks mode";
			}
		} else {
			if(document.documentMode == 5) {
				mode = "IE Quirks mode";
			} else if(document.documentMode == 7) {
				mode = "IE7 Standards-compliance mode";
			} else if(document.documentMode == 8) {
				mode = "IE8 Standards-compliance mode";
			} else if(document.documentMode == 9) {
				mode = "IE9 Standards-compliance mode";
			} else if(document.documentMode == 10) {
				mode = "IE10 Standards-compliance mode";
			} else if(document.documentMode == '7||8') {
				mode = "IE9 Compatibility mode";
			} else if(document.documentMode == '7||8||9') {
				mode = "IE10 Compatibility mode";
			} else {
				mode = "Others";
			}
		}
		document.getElementById("rendering-mode").innerHTML = mode;
	}

	function addEventListener(elm, type, func) {
		if(! elm) { return false; }
		if(elm.addEventListener) {
			elm.addEventListener(type, func, false);
		} else if(elm.attachEvent) {
			// http://ejohn.org/projects/flexible-javascript-events/ 
			elm['e' + type + func] = func;				
			elm[type + func] = function(){elm['e' + type + func]( window.event );}
			elm.attachEvent( 'on' + type, elm[type + func] );
		} else {
			return false;
		}
		return true;
	}
})();
