var pie = new d3pie("pieChart", {
	"header": {
		"title": {
			"text": "PLANNER",
			"fontSize": 22,
			"font": "verdana"
		},
		"subtitle": {
			"text": "afternoon",
			"color": "#999999",
			"fontSize": 10,
			"font": "verdana"
		},
		"titleSubtitlePadding": 12
	},
	"footer": {
		"color": "#999999",
		"fontSize": 11,
		"font": "open sans",
		"location": "bottom-center"
	},
	"size": {
		"canvasHeight": 700,
		"canvasWidth": 590,
		"pieOuterRadius": "88%"
	},
	"data": {
		"content": [
			{
				"label": "Bennnnn!",
				"value": 5,
				"color": "#c58f2e"
			},
			{
				"label": "Oh, god.",
				"value": 2,
				"color": "#c3c834"
			},
			{
				"label": "But it's Friday night!",
				"value": 3,
				"color": "#569720"
			},
			{
				"label": "Again?",
				"value": 2,
				"color": "#55b868"
			},
			{
				"label": "I'm considering an affair.",
				"value": 1,
				"color": "#387e6a"
			}
		]
	},
	"labels": {
		"outer": {
			"pieDistance": 60
		},
		"inner": {
			"format": "none"
		},
		"mainLabel": {
			"font": "verdana"
		},
		"percentage": {
			"color": "#e1e1e1",
			"font": "verdana",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#e1e1e1",
			"font": "verdana"
		},
		"lines": {
			"enabled": true,
			"color": "#cccccc"
		},
		"truncation": {
			"enabled": true
		}
	},
	"effects": {
		"pullOutSegmentOnClick": {
			"effect": "linear",
			"speed": 400,
			"size": 8
		}
	},
	"callbacks": {}
});
