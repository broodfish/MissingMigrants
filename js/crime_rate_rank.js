var crimeRateURL = "https://raw.githubusercontent.com/Yunrou/repo1/master/CrimeRate.csv"

var spec = {
	$schema: 'https://vega.github.io/schema/vega-lite/v4.0.0-beta.10.json',
	description: 'Top 10',
    "width": 1000,
    "height": 3000,
	"data": {"url": crimeRateURL},
	"transform": [
	    {
	      "window": [{
	        "op": "rank",
	        "as": "rank"
	      }],
	      "sort": [{ "field": "crimeIndex", "order": "descending" }]
	    }
  	],
	"encoding": {
		"x": {
			"field": "crimeIndex",
			"type": "quantitative",
			"title": "",
			"axis": null
		},
	
		"y": {
			"field": "name",
			"type": "nominal",
			"axis": {
		        "title": "",
		        "ticks": false,
		        "domain": false,
		        "labelFontSize": 13
		    },
			"sort": {"field": "crimeIndex", "op": "average", "order": "descending"}
		}
	},
	"layer": [
		{
			"mark": {"type": "bar", "fill": "#4C78A8", "cursor": "pointer", "size": 18},
			"selection": {
    		    "highlight": {"type": "single", "empty": "none", "on": "mouseover"},
    		    "select": {"type": "multi"}
    		},
    		"encoding": {
				"fill": {
					"condition": {"selection": "highlight", "value": "firebrick"},
      				"value": "#4C78A8"
				}
    		}
			
		},{
	    	"mark": {"type": "text", "align": "left", "baseline": "middle", "dx": 4},
		    "encoding": {
		      "text": {"field": "crimeIndex", "type": "quantitative"}
		    }
		}
	]
}
vegaEmbed(".chart", spec);