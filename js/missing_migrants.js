/* Set map view  */
var map = L.map('mapid')  // mapid is the id of the div where the map will appear
  .setView([27, 7], 2);  // center position [lat, long] + zoom

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 7,
    minZoom: 2,
}).addTo(map);

// Add a svg layer to the map
L.svg().addTo(map);

var bubble = d3.select("#mapid")
	  .select("svg");

var legend = d3.select(".legend")
	.append("svg")
  	.attr("class", "colorlegend")
    .attr("width", "800px")
    .attr("height", "30px");

var regionName = ["America", "Europe", "Mediterranean", 
				  "Africa", "Middle East", "Asia"];//["North America", "US-Mexico Border", "Central America", "Caribbean", 
		         // "South America", "Europe", "Mediterranean", "Horn of Africa", 
		         // "North Africa", "Sub-Saharan Africa", "Middle East", "South Asia", 
		         // "Central Asia", "East Asia","Southeast Asia"];//, "Oceania"];
var colorPalette = ["#4676aa", "#ff7b00", "#83A84F",
					"#a3735a", "#7b7b7b", "#bc6ea1"];//["#8D3134", "#B93743", "#E55464", "#ECB145",
				    // "#FB8745", "#83A84F", "#ABD667", "#763D2A", 
				    // "#906D29", "#C0A02B", "#757575", "#8061B0", 
				    // "#5254A3", "#6B6ECF", "#9698D6", "#4676AA"]; #27ab4a

var currZoom = 2;

var win_height = document.body.clientHeight;
var win_width = document.body.clientWidth


d3.csv("https://raw.githubusercontent.com/Yunrou/repo1/master/MissingMigrants.csv").then(function(data) {


	// Colormap
	var color = d3.scaleOrdinal()
				.domain(regionName)
				.range(colorPalette);//d3.schemeSet3);
	var scaleSize = d3.scaleThreshold()
					.domain([2, 20, 50, 100, 500, 600, 700]) // count
					.range([3, 4, 6, 8, 12, 15, 20, 25]); // circle size
	var cltRange = d3.scaleThreshold()
					.domain([2.6, 3.5, 4.5])
					.range([18, 10, 8, 5]);

	var tree = new Map();
	resetNodes(data, tree);
	clusteredNodes = cluster(tree, cltRange(map.getZoom()));

	// Tooltips
	var tooltip = d3.select('#tooltip')
					.style("z-index", "9999"); // There are too many layer in the map, so the z-axis will help tooltip show above those layers.
	tips = function(i, d){ 
		var html = '' 
		html = '<div><span>Location：'+d["Location Description"]+' ('+d.lat.toFixed(2)+', '+d.long.toFixed(2)+')'
				+'</span><br><span>Reported Date：'+ d["Reported Month"]+' '+d["Reported Year"]
				+'</span><br><span>Cause of Death：'+ d["Cause of Death"]
				+'</span><br><span>Total Dead and Missing：'+ d["Total Dead and Missing"]
				+'</span></div>'
		return html; 
	};
	var mouseover1 = function(d) {
		var mouse = [d3.event.x, d3.event.y];// Cannot use <d3.mouse(this)> since this cause wrong position after dragging
		d3.select(this)
			.style("stroke", "#404040")
			.style("stroke-width", 2.5);
		d3.select('#tooltip')
			.style("left", Math.round(mouse[0])+"px") 
		    .style("top", Math.round(mouse[1])+"px")
			.classed('hidden', false) 
			.html(d.count);
	}
	var mouseover2 = function(d) {
		var mouse = [d3.event.x, d3.event.y];
		d3.select(this)
			.style("stroke", "#404040")
			.style("stroke-width", 2.5);
		d3.select('#tooltip')
			.style("left", Math.round(mouse[0])+10+"px") 
		    .style("top", Math.round(mouse[1])+5+"px")
			.classed('hidden', false) 
			.html(tips(i, d));
	}
	var mouseout = function(d){ 
		d3.select(this)
			.style("stroke", function(d){ return color(d.region); })
			.style("stroke-width", 1);
		d3.select('#tooltip').classed('hidden', true); 
	}

	var click = function(d) {
		var str = '#'+d.region+'.chart';
		str = str.replace(" ", "");
		console.log(str);
		d3.select('#title').html('<li id="titlename"><i class="fa fa-bar-chart"></i></li><p>Top  10  Cause  of  Death  ('+d.region+')</p>');
		d3.selectAll('.chart')
			.style("display","none");
		d3.select(str)
			.style("display","block");
		d3.select("#close").style("display","block");
		
		d3.select('#chart')
			.style("display", "block")
			.style("width", "auto")
			.style("height", "auto");
		
		var boxH = $("#chart").height();
		var boxW = $("#chart").width();
		var t = (win_height - boxH) / 2;
		var l = (win_width - boxW) / 2;
		var ttop = (t < 0)? 150: t;
		var tleft = (l < 0)? 150 : l;
		console.log(win_height, win_width, boxH, boxW, ttop, tleft);
		
		d3.select('#chart')
			.style("top", ttop+"px")
			.style("left", tleft+"px");
	}
	
	d3.select("#close")
		.on('click', function() {
			d3.selectAll('.chart').style("display","none");
			d3.select("#close").style("display","none");
			d3.select("#chart")
			.style("top", "50%")
			.style("left", "-50%")
			.style("width", "0")
			.style("height", "0")
			.style("display", "none");
		});
	
	// Bubbles
	bubble.selectAll("myCircles")
		.data(clusteredNodes)
		.enter()
		.append("circle")
			.attr("id", function(d) { return d.region;})
			.attr("class", "bubble")
			.attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).x })
			.attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).y })
			.attr("r", function(d){ return scaleSize(d.count); })
			.style("fill", function(d){ return color(d.region); })
			.attr("stroke", function(d){ return color(d.region); })
			.attr("stroke-width", 1)
			.attr("fill-opacity", 1)
			.attr("pointer-events", "visible")
			.on("mouseover", mouseover1)
			.on('mouseout', mouseout)
			.on("click", click);

	// Color Legend
	var i = 0;
	regionName.forEach(function(region){
		d3.select(".colorlegend")
			.attr('overflow','visible')
			.append("svg")
			.attr("class", "colorbar")
			.attr("id", "color_"+region.replace(/ /g, ""))
			.append("circle")
				.attr('class', 'checkbox')
				.attr('transform', 'translate('+(10+i*150)+',10)')
				.attr("r", 8)
			    .style("fill", color(region));

		d3.select("#color_" + region.replace(/ /g, "")) // text
			.append("text")
			.attr("class", 'text')
			.text(region)
			.attr('transform', 'translate('+(25+i*150)+',10)')
			//.style("fill", color(region))
		    .attr("text-anchor", "left")
		    .style("alignment-baseline", "middle");

		
		i+=1;
	
	})

	


	// Function that update circle position if something change
	function zoomdrag() {

		// whether we should reclustered the data;
		// drag or zoom in the same range level
		if (map.getZoom() == currZoom || (map.getZoom() > 5 && currZoom > 5)) {
			bubble.selectAll("circle")
		    .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).x })
		    .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).y })
		}
		// reclustered data and render
		else {

			bubble.selectAll("*").remove();
			if (map.getZoom() > 5){
				bubble
				  .selectAll("myCircles")
				  .data(data)
				  .enter()
				  .append("circle")
				  	.attr("class", "bubble")
					.attr("id", function(d) { return d.region;})
				    .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).x })
				    .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).y })
				    .attr("r", function(d){ return scaleSize(d.count); })
				    .style("fill", function(d){ return color(d.region); })
				    .attr("stroke", function(d){ return color(d.region); })
				    .attr("stroke-width", 1)
				    .attr("fill-opacity", 1)
					.attr("pointer-events", "visible")
					.on("mouseover", mouseover2)
					.on('mouseout', mouseout);
			}
			else {
				clusteredNodes = cluster(tree, cltRange(map.getZoom()));
				bubble
				  .selectAll("myCircles")
				  .data(clusteredNodes)
				  .enter()
				  .append("circle")
				  	.attr("class", "bubble")
					.attr('id', function(d) { return d.region;})
				    .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).x })
				    .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).y })
				    .attr("r", function(d){ return scaleSize(d.count); })
				    .style("fill", function(d){ return color(d.region); })
				    .attr("stroke", function(d){ return color(d.region); })
				    .attr("stroke-width", 1)
				    .attr("fill-opacity", 1)
				    .attr("pointer-events", "visible")
					.on("mouseover", mouseover1)
					.on('mouseout', mouseout)
			.on("click", click);
			}
			
		}
	  
	  currZoom = map.getZoom();
	  console.log(map.getZoom())
	}

	// If the user change the map (zoom or drag), I update circle position:
	map.on("moveend", zoomdrag);
    
})

/* Manipulate Raw Data */
function resetNodes(data, tree) {

	data.forEach(function(d) {
		d.lat = +d["Location Coordinates"].split(", ")[0];
		d.long = +d["Location Coordinates"].split(", ")[1];
		d.count = 1;
		d.region = d["Region"];
		d.death = d["Cause of Death"];
	});
	console.log(data);
	// Data group by region 
	var regionStat = d3.nest()
						.key(function(d) { return d["Region"]; })
						.entries(data);
	// Construct quadtree					
	regionStat.forEach(function(group) {
		
		var subtree = d3.quadtree();

		subtree.x(function (d) { return d.lat; })
		  .y(function (d) { return d.long; })
		  .addAll(group.values);

		tree.set(group.key, subtree);

	});
} 







/* Helper Functions */
function search(quadtree, x0, y0, x3, y3) {
/*
Traverse the quadtree and will return an array of all the data points
that are found in an individual grid item
*/
	var validData = [];
	
	quadtree.visit(function(node, x1, y1, x2, y2) {
		if (!node.length) {
			do {
				p = node.data;
				selected = (p.lat >= x0) && (p.lat < x3) && (p.long >= y0) && (p.long < y3);
				if (selected) {
					validData.push(p);
				}
			}while (node = node.next);
		}
		return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
	});
	return validData;
}

// lat: (-33.517699135035, 66.9299814)
// long: (-119.6342853, 123.0062604)
function cluster(quadtree, range) {

	var cltnodes = [];

	for (var [region, subtree] of quadtree) {
		for (var x = -40; x <= 70; x += range) {
			for (var y = -120; y <= 130; y += range) {
				
				var searched = search(subtree, x, y, x+range, y+range);

				if (searched && searched.length) {
					var lat = 0;
					var long = 0;
					for (var i=0; i<searched.length; i+=1){
						lat += searched[i].lat;
						long += searched[i].long;
					}

					lat = lat/searched.length;
					long = long/searched.length;

					var c = {
						'lat': lat,
						'long': long,
						'count': searched.length,
						'region': region
					}
					cltnodes.push(c);
				}
			}
		}
	}
	return cltnodes;
}

