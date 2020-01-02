/*global $, console*/
$(function () {
  'use strict';
  
  // Start navbar 
  (function () {
    
    
    // Add class active when the user clicks the lis of the menu
    $('.nav .list li').on('click', 'a', function () {
      $(this).parent().addClass('active').siblings().removeClass('active');
    });
    
    
    var openCategories = $('.nav #open-categories'),
        categories = $('.drop-down');
    
    
    // Toggle categories on clicking
    openCategories.on('click', function () {
      $("#" + $(this).data('dropdown')).toggleClass('show');
      // When the user clicks the window if the categories is not the target, close it.
      $(window).on('mouseup', function (e) {
        if ( categories.hasClass('show')
            && ! categories.is(e.target)
            && categories.has(e.target).length === 0
            && ! openCategories.is(e.target) ) {
          categories.removeClass('show');
        }
      });
    });
    
    
    // Toggle menu, This will be shown in Extra small screens only
    $('.nav .toggle-nav').on('click', function () {
      $( "#" + $(this).data('toggle') ).slideToggle(300);
    });
    
    
  }());
});


/* var data_dir = "https://raw.githubusercontent.com/broodfish/MissingMigrants/master/MissingMigrants-Global-2019-11-04T13-12-33.csv"

var heatmapData = [
    {"country":"United States","count":174,"lat":37.09024,"lon":-95.712891}
];

var bubblemapData = [];

d3.csv(data_dir, function(data){
	for (var i=0; i<data.length; i++) {
		var cause = data[i]['Cause of Death'];
		var loc = data[i]['Location Coordinates'].split(",");
		var numTDeath = data[i]['Total Dead and Missing'];
		var dict = {
			'cause':cause,
			'lat':loc[0],
			'lon':loc[1],
			'numTDeath':numTDeath
		};
		bubblemapData.push(dict);
	}
	
	
	var
		map,

		minBulletSize = 3,
		maxBulletSize = 70
	;

	var objectLength = bubblemapData.length;

	var
		min = 0,
		max = 1022
	;

	// AmCharts.ready(function() {
		// AmCharts.theme = AmCharts.themes.dark;
		map = new AmCharts.AmMap();

		// map.addTitle("Heatmap", 14);
		// map.addTitle("source: ComplyAdvantage", 11);
		map.areasSettings = {
			unlistedAreasColor: "#15A892",
			// unlistedAreasAlpha: 0.1,
			rollOverColor: "#009ce0",
			selectable: true,
			mouseEnabled: true
		};
		map.imagesSettings.balloonText = "<span style='font-size:14px;'><b>[[title]]</b>: [[value]]</span>";

		var dataProvider = {
			mapVar: AmCharts.maps.worldLow,
			images: []
		}

		// create circle for each country

		// it's better to use circle square to show difference between values, not a radius
		var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
		var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

		// create circle for each country
		for (var i = 0; i < objectLength; i++) {
			var mentionsCount = bubblemapData[i].numTDeath;

			// calculate size of a bubble
			var square = (mentionsCount - min) / (max - min) * (maxSquare - minSquare) + minSquare;
			if (square < minSquare) {
				square = minSquare;
			}

			var size = Math.sqrt(square / (Math.PI * 2));

			dataProvider.images.push({
				type: "circle",
				width: size,
				height: size,
				// color: dataItem.color,
				longitude: bubblemapData[i].lon,
				latitude: bubblemapData[i].lat,
				title: bubblemapData[i].cause,
				value: bubblemapData[i].numTDeath
			});
		}

		map.dataProvider = dataProvider;
		map.export = {
			enabled: true
		}

		map.addListener("click", handleClick);

		map.addListener("clickMapObject", handleMapClick);

		map.addListener("selectedObjectChanged", handleObjectChange);

		// Output the map into #heatmap
		map.write("heatmap");
	// });
});



function handleClick(event) {
    console.log(event);
}

function handleMapClick(event) {
    console.log(event);
}

function handleObjectChange(event) {
    console.log(event);
} */