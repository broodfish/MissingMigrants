var africaURL = "https://raw.githubusercontent.com/Yunrou/repo1/master/CauseOfDeath_Africa.csv"
var americaURL = "https://raw.githubusercontent.com/Yunrou/repo1/master/CauseOfDeath_America.csv"
var asiaURL = "https://raw.githubusercontent.com/Yunrou/repo1/master/CauseOfDeath_Asia.csv"
var europeURL = "https://raw.githubusercontent.com/Yunrou/repo1/master/CauseOfDeath_Europe.csv"
var middleEastURL = "https://raw.githubusercontent.com/Yunrou/repo1/master/CauseOfDeath_MiddleEast.csv"
var mediterraneanURL = "https://raw.githubusercontent.com/Yunrou/repo1/master/CauseOfDeath_Mediterranean.csv"

var color = d3.scaleOrdinal()
				.domain(["America", "Europe", "Mediterranean", 
				  "Africa", "MiddleEast", "Asia"])
				.range(["#4676aa", "#ff7b00", "#83A84F",
					"#a3735a", "#7b7b7b", "#bc6ea1"]);//#59b7afd3.schemeSet3);

function getelement(url, regionName) {
	var element = {
	  "$schema": "https://vega.github.io/schema/vega/v5.json",
	  "width": 600,
	  "height": 300,
	  "padding": 20,
	  "data": [
		{
		  "name": "table",
		  "url": url,
		  "format": {"type": "csv"},
		  "transform": [
			{
			  "type": "project",
			  "fields": ["Count", "Cause of Death"],
			  "as": ["numberDead", "cause"]
			}
		  ]
		}
	  ],

	  "signals": [
		{
		  "name": "tooltip",
		  "value": {},
		  "on": [
			{"events": "rect:mouseover", "update": "datum"},
			{"events": "rect:mouseout",  "update": "{}"}
		  ]
		}
	  ],

	  "scales": [
		{
		  "name": "xscale",
		  "type": "band",
		  "domain": {"data": "table", "field": "cause"},
		  "range": "height",
		  "padding": 0.2,
		  "round": true
		},
		{
		  "name": "yscale",
		  "domain": {"data": "table", "field": "numberDead"},
		  "nice": true,
		  "range": "width"
		}
	  ],

	  "axes": [
		{ 
		  "orient": "left", 
		  "scale": "xscale",
		  "ticks": false,
		  "domain": false,
		  "encode": { "labels": { "update": {"dx": {"value": -7}, "fontSize": {"value": 12}}}}
		},
		{ 
		  "orient": "top", 
		  "scale": "yscale",
		  "title": "Number of Death",
		  "ticks": false,
		  "domain": false,
		  "encode": { "labels": { "update": {"dy": {"value": 3}, "fontSize": {"value": 12}}}}
		}
	  ],

	  "marks": [
		{
		  "type": "rect",
		  "from": {"data":"table"},
		  "encode": {
			"enter": {
			  "y": {"scale": "xscale", "field": "cause"},
			  "height": {"scale": "xscale", "band": 1},
			  "x": {"scale": "yscale", "field": "numberDead"},
			  "x2": {"scale": "yscale", "value": 0},
			},
			"update": {
			  "fill": {"value": color(regionName)}
			},
			"hover": {
			  "fill": {"value": "firebrick"}
			}
		  }
		},
		{
		  "type": "text",
		  "encode": {
			"enter": {
			  "align": {"value": "left"},
			  "baseline": {"value": "bottom"},
			  "fill": {"value": "#333"},
			  "fontSize": {"value": 13},
			  "dx": {"value": -7},
			  "dy": {"value": -3}
			},
			"update": {
			  "y": {"scale": "xscale", "signal": "tooltip.cause", "band": 1},
			  "x": {"scale": "yscale", "signal": "tooltip.numberDead", "offset": 15},
			  "text": {"signal": "tooltip.numberDead"},
			  "fillOpacity": [
				{"test": "datum === tooltip", "value": 0},
				{"value": 1}
			  ]
			}
		  }
		}
	  ] 
	}
	return element;
}

var config = {
	"actions": false
}

vegaEmbed("#Africa", getelement(africaURL, "Africa"), config);
vegaEmbed("#America", getelement(americaURL, "America"), config);
vegaEmbed("#Asia", getelement(asiaURL, "Asia"), config);
vegaEmbed("#Europe", getelement(europeURL, "Europe"), config);
vegaEmbed("#MiddleEast", getelement(middleEastURL, "MiddleEast"), config);
vegaEmbed("#Mediterranean", getelement(mediterraneanURL, "Mediterranean"), config);