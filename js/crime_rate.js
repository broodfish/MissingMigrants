/*Crime rate in 2019*/

var topoURL = "https://raw.githubusercontent.com/jdamiani27/Data-Visualization-and-D3/master/lesson4/world_countries.json";
var crimeRateURL = "https://raw.githubusercontent.com/Yunrou/repo1/master/CrimeRate.csv"


var format = d3.format(",");

var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 1080 - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;



var rateLevel = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
var rateLevelText = ["<10", ">10", ">20", ">30", ">40", ">50", ">60", ">70", ">80", "Unknown"];
var colorPalette = ["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)",
           			"rgb(107,174,214)", "rgb( 66,146,198)", "rgb( 33,113,181)", "rgb(  8, 81,156)",
            		"rgb(8,48,107)", "rgb(180,180,180)"];//,"rgb(3,19,43)"];

var level2text = d3.scaleOrdinal()
				.domain(rateLevel)
				.range(rateLevelText)

var colorLegend = d3.scaleOrdinal()
			.domain(rateLevel)
			.range(colorPalette);

var color = d3.scaleThreshold()
    .domain([10, 20, 30, 40, 50, 60, 70, 80, 90])
    .range(colorPalette);

var path = d3.geoPath();

var svg = d3.select("#mapid")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var legend = d3.select(".legend")
				.append("svg")
  				.attr("class", "colorlegend")
   				.attr("width", "680px")
 				.attr("height", "30px");

var projection = d3.geoMercator()
                   .scale(180)
                   .translate( [width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);




var popByName = {'USA': 46.73};
d3.csv(crimeRateURL).then(function(data) {
	data.forEach(function(d) {
    	// key: name; value: crimeIndex (crimeRate)
    	popByName[d['name']] = +d['crimeIndex'];

    });
	console.log(popByName);
	d3.json(topoURL).then(function(data){
		data.features.forEach(function(d) {
	    	// Add a feature
	    	d.crimeRate = popByName[d['properties']['name']];
	    	if (typeof(d.crimeRate) != 'number') {
	    		d.crimeRate = 99;
	    	}
	    });
	    console.log(data.features); // 顯示原始資料

	    // Color Legend
		var i = 0;
		rateLevel.forEach(function(level){
			d3.select(".colorlegend")
				.attr('overflow','visible')
				.append("svg")
				.attr("class", "colorbar")
				.attr("id", "color_"+level.replace(/ /g, ""))
				.append("circle")
					.attr('class', 'checkbox')
					.attr('transform', 'translate('+(10+i*60)+',10)')
					.attr("r", 8)
				    .style("fill", colorLegend(level));

			d3.select("#color_" + level.replace(/ /g, "")) // text
				.append("text")
				.attr("class", 'text')
				.text(level2text(level))
				.attr('transform', 'translate('+(25+i*60)+',10)')
				//.style("fill", color(region))
			    .attr("text-anchor", "left")
			    .style("alignment-baseline", "middle");

			
			i+=1;
		
		})

		// Tooltips
		var tooltip = d3.select("#tooltip")
					.style("z-index", "9999");

		tips = function(d){ 
			var html = '' 
			html = '<div><span>'+d['properties']['name']
					+'</span><br><span>Crime Rate：';
			if (d.crimeRate != 99) {
				html += d.crimeRate	
			} else {
				html += 'Unknown'
			}
			html += '</span></div>'
			return html; 
		};
		var mouseover = function(d) {
			var mouse = [d3.event.x, d3.event.y];
			d3.select(this)
				.style('stroke', '#404040')
				.style('stroke-width', 3);

			d3.select('#tooltip')
				.style("left", Math.round(mouse[0])+10+"px") 
			    .style("top", Math.round(mouse[1])+10+"px")
				.classed('hidden', false) 
				.html(tips(d));
		}
		var mouseout = function(d){ 
			d3.select('#tooltip').classed('hidden', true); 
			d3.select(this)
				.style('stroke', 'black')
				.style('stroke-width', 0.5);
		}

	    svg.append("g")
	        .attr("class", "countries")
	        .selectAll("path")
	        .data(data.features)
	        .enter().append("path")
	        .attr("d", path)
	        .style("fill", function(d) { return color(d.crimeRate); })
	        .style('stroke', 'black')
	        .style('stroke-width', 0.5)
	        .style("opacity",0.8)
			.attr("pointer-events", "visible")
			.on("mouseover", mouseover)
			.on('mouseout', mouseout);
	        

	    svg.append("path")
	        .datum(topojson.mesh(data.features, function(a, b) { return a['properties']['name'] !== b['properties']['name']; }))
	       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
	        .attr("class", "names")
	        .attr("d", path);
	});
});


