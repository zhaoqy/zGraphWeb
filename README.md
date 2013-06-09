zGraphWeb
=========

Based on the HTML5 graphics library for web

### How to Use

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
zGraph.circle(string, object)
```
Arguments:

- `string`: string for circle id.
- `object`: Graphics of height and width.

---
``` js
appendTo(element)
```

Arguments:

- `element`: Added to the DOM node.
---

``` js
draw(object, object)
```

Arguments:

- `object`: data
- `object`: params
---
