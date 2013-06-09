zGraphWeb
=========

Based on the HTML5 graphics library for web

### How to Use

zGraph.circle
``` js

// zGraph.circle
var items = [
    ["demo01", 150, "#ff8899"],
    ["demo02", 100],
    ["demo03", 80],
    ["demo04", 60],
    ["demo05", 30],
    ["demo06", 20],
    ["demo07", 10],
    ["demo08", 10],
    ["demo09", 10],
    ["demo10", 10],
    ["demo11", 10],
    ["demo12", 10]
];
var params = {
  backgroundColor: "#eeffee",
  shadow: false,
  captionNum: false,
  startAngle: -45,
  otherCaption: "others"
};
var zg = new zGraph.circle("demo",{width:400,height:300}).appendTo(document.body);
zg.draw(items, params);

```
### API

zGraph.circle
---
``` js
zGraph.circle(string, [object])
```
Arguments:

- `string`: circle id.
- `object`: Graphics of height and width,default width=400,heigth=300.(optional)

---
``` js
appendTo(element)
```

Arguments:

- `element`: Added to the DOM node.

---

``` js
draw(object, [object])
```

Arguments:

- `object`: data
- `object`: params (optional)

---
```
    attribute					default			
------------------------------------------------------------
    backgroundColor, 			--null         				
    shadow, 					--true         				
    border, 					--false        				
    caption, 					--false        				
    captionNum, 				--true         				
    captionRate, 				--true         				
    fontSize, 					--"12px"       				
    fontFamily, 				--"Arial,sans-serif"        
    textShadow, 				--true         				
    captionColor, 				--"#ffffff"         		
    startAngle, 				---90         				
    legend, 					--true         				
    legendFontSize, 			--"12px"         			
    legendFontFamily, 			--"Arial,sans-serif"        
    legendColor, 				--"#000000"         		
    otherCaption, 				--"other"    
------------------------------------------------------------
```
