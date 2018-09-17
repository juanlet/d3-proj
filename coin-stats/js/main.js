/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    CoinStats
 */

 $(document).ready(() => {
     

    var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var bisectDate = d3.bisector(function (d) {
    return d.date;
}).left;

var margin = {
        left: 80,
        right: 100,
        top: 50,
        bottom: 100
    },
    height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;


var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left +
        ", " + margin.top + ")");

$("#date-slider").slider({
    range: true,
    max: parseTime("31/10/2017").getTime(),
    min: parseTime("12/5/2013").getTime(),
    step: 86400000, // One day
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function (event, ui) {
        $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
        $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
        //update();
        console.log("START: " + formatTime(new Date(ui.values[0])) + " END: " + formatTime(new Date(ui.values[1])));

    }
});

let selectedCoin = $("#coin-select").val();
let selectedVariable = $("#var-select").val();

//change events for selects
$(document).on("change","#coin-select", function(){
    const value = $(this).val();

    
});

$(document).on("change","#var-select", function(){
    const value = $(this).val();

});


// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom()
var yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat(function (d) {

        const dailyVolume = d["24h_vol"];

        if(dailyVolume < 1000000){
           return dailyVolume;
        }else if (dailyVolume < 1000000000){
            //MILLIONS
           return parseInt(dailyVolume) / 1000000 + "M";
        }else {
            //BILLIONS
           return parseInt(dailyVolume) / 1000000000 + "B";
        }

    });

// Axis groups
var xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g")
    .attr("class", "y axis")

// X-Axis label

xAxis.append("text")
     .attr("class","axis-title")
     .attr("x", width / 2)
     .attr("y", 50)
     .attr("fill", "#5D6971")
     .text("Time(Year)");


// Y-Axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor","middle")
    .attr("y", -50)
    .attr("x", -height/2)
    .attr("fill", "#5D6971")
    .text("Price(USD)");

// Line path generator
var line = d3.line()
    .x(function (d) {
        return x(d.year);
    })
    .y(function (d) {
        return y(d.value);
    });

d3.json("data/coins.json").then(function (coins) {

    let formattedData = {};

    for (const coin in coins) {

        if (!coins.hasOwnProperty(coin)) {
            continue;
        }

        formattedData[coin] = coins[coin].filter((dayData) => {

            dayData["24h_vol"] = +dayData["24h_vol"];
            dayData.market_cap = +dayData.market_cap;
            dayData.price_usd = +dayData.price_usd;
            //dayData.date = parseTime(dayData.date).getTime();

            return !(dayData["price_usd"] == null);
        });


        // Set scale domains
        x.domain(d3.extent(coins[coin], function (d) {            
            return parseTime(d.date).getTime();
        }));

        y.domain([d3.min(coins[coin], function (d) {
                return d["24h_vol"];
            }),
            d3.max(coins[coin], function (d) {
                return d["24h_vol"];
            })
        ]);

        // Generate axes once scales have been set
        xAxis.call(xAxisCall.scale(x))
        yAxis.call(yAxisCall.scale(y))

        // Add line to chart
       /*  g.append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-with", "3px")
            .attr("d", line(data)); */


    }


    /******************************** Tooltip Code ********************************/

    /*  var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
     //   .on("mousemove", mousemove);
*/

    /* 
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
            focus.select("text").text(d.value);
            focus.select(".x-hover-line").attr("y2", height - y(d.value));
            focus.select(".y-hover-line").attr("x2", -x(d.year));
        } */


    /******************************** Tooltip Code ********************************/

});




 });

