//Establish the dimensions of the canvas:
var svgWidth = 700;
var svgHeight = 500;

//Establish margins within the canvas:
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

//Esatblish the height and width of the actual scatterplot with the canvas:
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// Use D3 to locate the <div id> containing the term "scatter".
// Add an SVG wrapper withing this section.
// Assign it height and width attributes that align with the canvas size selected earlier:
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create an SVG group "g" and give it the margin attributes established earlier: 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import the data from the CSV file:
d3.csv('./assets/data/data.csv').then(function(rawdata) {

    // Console log the raw data to ensure that it has been retrieved correctly and in full.
    console.log(rawdata);

//Convert the data to numbers:
    rawdata.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

// Create a scale (Linear) for the x-values ('age') in the data so they spread nicely across the chart's width.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(rawdata, data => data.age), d3.max(rawdata, data => data.age)])
        .range([0, chartWidth]);

// Create a scale (Linear) for the y-values ('smokes') in the data so they spread nicely across the chart's height.
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(rawdata, data => data.smokes)])
        .range([chartHeight, 0]);

// Create the y and x axes:
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Add the x axis to the chart group 'g':
    var xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);

// Add the y axis to the chart group 'g':
    var yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .call(leftAxis);

// Add circular markers to the chart for each state:
    var circlesGroup = chartGroup.selectAll('circle')
        .data(rawdata)
        .enter()
        .append('circle')

    // Give each circle a class = "stateCircle" which references the d3Style.css file:
        .classed('stateCircle', true)
        .attr('cx', data => xLinearScale(data.age))
        .attr('cy', data => yLinearScale(data.smokes))
        .attr('r', 10)
        .attr('opacity', '.75');

// Add a text group where each element has the class = "stateText" which references d3Style.css:
    var textGroup = chartGroup.selectAll('stateText')
        .data(rawdata)
        .enter()
        .append('text')
        .classed('stateText', true)

// Use the coordinates used to locate the centre each circle earlier:
        .attr('x', data => xLinearScale(data.age))
        .attr('y', data => yLinearScale(data.smokes))
        .attr('dy', 3)
        .attr('font-size', '10px')

// Return the state name abbreviations from the raw data set:
        .text(function(data){return data.abbr});

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -3)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed('aText', true)
        .text("% of Population that Smokes");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top -5})`)
        .classed('aText', true)
        .text("Average Age of the Population");

//Build a Tool-Tip function:
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function(data) {
        return (`State: ${data.state}<br>Average Age of Population: ${data.age}<br>Percentage of Smokers: ${data.smokes}`);
        });

// Add the Tool-Tip to the chart group established earlier:
    chartGroup.call(toolTip);

// Program the Tool-Tip to activate when the mouse hovers over a circle:
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
        });

// Program the Tool-Tip to disappear when the mouse is moved away:
        on("mouseout", function(data) {
        toolTip.hide(data);
        });

});