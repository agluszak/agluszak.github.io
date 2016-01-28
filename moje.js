d3.csv("data.csv", type, function(error, data) {
	var width = 820,
		barHeight = 20,
		height = data.length * barHeight,
		margin = {
			"left": 50,
			"right": 100
		};
	
	var x = d3.scale.pow().exponent(0.5)
		.domain([0, d3.max(data, function(d) {
			return d.im1990;
		})])
		.range([0, width]);

	var y = d3.scale.ordinal()
		.domain(data.map(function(d) {
			return d.kraj;
		}))
		.rangeRoundBands([0, height], 0.1, 1);
	
	var color = d3.scale.linear()
		.domain([0, d3.max(data, function(d) {
			return d.pop1990;})])
		.range([0,255*255*255]);
	
	var chart = d3.select("body").append("svg")
		.attr("class", "chart")
		.attr("width", width + margin.right + margin.left);

	chart.attr("height", height + 100);

	var xAxis = d3.svg.axis()
		.scale(x)
		.tickValues([10000, 100000, 1000000, 2500000, 5000000, 7500000])
		.orient("bottom");

	var bar = chart.selectAll("g")
		.data(data)
		.enter().append("g")
		.attr("class", "bar");

	chart.selectAll("g").append("text")
		.text(function(d) {
			return d.kraj;
		})
		.attr("x", function(d, i) {
			return x(d.im1990) + margin.left;
		})
		.attr("y", function(d) {
			return y(d.kraj) + 13;
		});

	chart.selectAll("g").append("rect")
		.attr("x", function(d) {
			return margin.left;
		})
		.attr("y", function(d) {
			return y(d.kraj);
		})
		.attr("width", function(d) {
			return x(d.im1990);
		})
		.attr("height", y.rangeBand());

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + margin.left + "," + (height) + ")")
		.call(xAxis);

	chart.append("g")
		.attr("class", "y axis")
		.append("text")
		.attr("transform", "translate(0" + "," + 0 + ") rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Liczba imigrantów w 1990");

	d3.select("input").on("change", change);

	function change() {
		var y0 = y.domain(data.sort(this.checked ? function(a, b) {
					return b.im1990 - a.im1990;
				} : function(a, b) {
					return d3.ascending(a.kraj, b.kraj);
				})
				.map(function(d) {
					return d.kraj;
				}))
			.copy();

		chart.selectAll(".bar rect")
			.sort(function(a, b) {
				return y0(a.kraj) - y0(b.kraj);
			});
		chart.selectAll(".bar text")
			.sort(function(a, b) {
				return y0(a.kraj) - y0(b.kraj);
			});

		var transition = chart.transition().duration(750),
			delay = function(d, i) {
				return i * 50;
			};

		transition.selectAll(".bar rect")
			.delay(delay)
			.attr("y", function(d) {
				return y0(d.kraj);
			});
		transition.selectAll(".bar text")
			.delay(delay)
			.attr("y", function(d) {
				return y0(d.kraj) + 13;
			});
	}
});

function type(d) {
	d.im1990 = +d.im1990;
	d.pop1990 = +d.pop1990;
	return d;
}
