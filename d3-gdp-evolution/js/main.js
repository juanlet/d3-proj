/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

var margin = {
	left: 80,
	right: 20,
	top: 50,
	bottom: 100
};

var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var t = d3.transition().duration(750);

//log scale x axis population Y life expectancy

//creating canvas
var g = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


//creating groups for axis
var xAxisGroup = g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g")
	.attr("class", "y axis");

//create scales

var x = d3.scaleLog().base(10).range([0, width]).domain([100, 200000]);

var y = d3.scaleLinear().range([height, 0]).domain([0, 90]);

var time = 0;

var area = d3.scaleLinear()
	.range([25 * Math.PI, 1500 * Math.PI])
	.domain([2000, 1400000000]);

var continentColor = d3.scaleOrdinal(d3.schemePastel1);



// Labels
var xLabel = g.append("text")
	.attr("y", height + 50)
	.attr("x", width / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)");
var yLabel = g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Life Expectancy (Years)")


var timeLabel = g.append("text")
	.attr("y", height - 10)
	.attr("x", width - 40)
	.attr("font-size", "30px")
	.attr("opacity", "0.4")
	.attr("text-anchor", "middle")
	.text("1800");


//axis calls

var xAxisCall = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat(d3.format("$"));

xAxisGroup.call(xAxisCall);

var yAxisCall = d3.axisLeft(y);

yAxisGroup.call(yAxisCall);




d3.json("data/data.json").then(function (yearsArray) {



	const formattedData = yearsArray.map(countriesYearData => {
		//YEAR AREA
		return countriesYearData.countries.filter(country => {

			return country.life_exp && country.income;

		}).map(country => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;

			return country;
		});
	});

	console.log(formattedData[0]);



	d3.interval(() => {

		time = time < formattedData.length - 1 ? time + 1 : 0;
		update(formattedData[time]);

	}, 20);

	update(formattedData[0]);

});

function update(data) {


	var t = d3.transition().duration(20);

	var circles = g.selectAll("circle").data(data, (d) => {
		return d.country;
	});


	circles.exit()
		.attr("class", "exit")
		.remove();

	//Enter
	circles.enter().append("circle").attr("fill", (d) => {
			return continentColor(d.continent);
		})
		.merge(circles)
		.attr("r", function (d) {
			return Math.sqrt(area(d.population) / Math.PI)
		})
		.transition(t)
		.attr("cx", (d) => {
			return x(d.income);
		})
		.attr("cy", (d) => {
			return y(d.life_exp);
		});



	timeLabel.text(1800 + time);





}