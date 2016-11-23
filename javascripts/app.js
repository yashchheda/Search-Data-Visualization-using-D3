// Client-side code
/*jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
//Size for the SVG
var width = 400,
  height = 400;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

//Tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
  return d.name + "</span>";
});
svg.call(tip);

//Center the svg
$("svg").css({
  margin: 'auto',
  display: 'block'
});

//Set up the colour scale
var color = d3.scale.category20();

//Set up the force layout
var force = d3.layout.force()
  .charge(-120)
  .linkDistance(30)
  .size([width, height]);

//Read the data from the mis element 
var mis = document.getElementById('mis').innerHTML;
graph = JSON.parse(mis);

//Creates the graph data structure out of the json data
force.nodes(graph.nodes)
  .links(graph.links)
  .start();

//Create all the line svgs but without locations yet
var link = svg.selectAll(".link")
  .data(graph.links)
  .enter().append("line")
  .attr("class", "link")
  .style("stroke-width", 4);

//Do the same with the circles for the nodes - no 
var node = svg.selectAll(".node")
  .data(graph.nodes)
  .enter().append("circle")
  .attr("class", "node")
  .attr("r", 10)
  .style("fill", function(d) {
  return color(d.group);
})
  .call(force.drag)
  .on('mouseover', tip.show) //Added
.on('mouseout', tip.hide); //Added

//Update the x and y attributes using the force layout 
force.on("tick", function() {
  link.attr("x1", function(d) {
    return d.source.x;
  })
    .attr("y1", function(d) {
    return d.source.y;
  })
    .attr("x2", function(d) {
    return d.target.x;
  })
    .attr("y2", function(d) {
    return d.target.y;
  });

  node.attr("cx", function(d) {
    return d.x;
  })
    .attr("cy", function(d) {
    return d.y;
  });
});

var optArray = [];
for (var i = 0; i < graph.nodes.length - 1; i++) {
  optArray.push(graph.nodes[i].name);
}

optArray = optArray.sort();

$(function() {
  $("#search").autocomplete({
    source: optArray
  });
});

$("#btnClear").click(function() {
  $('input:text').val('');
  node.style("stroke", "white").style("stroke-width", "1");
  d3.selectAll(".node, .link").transition()
    .duration(1000)
    .style("opacity", 1);
  node.on('mouseover', tip.show);
});

function searchNode() {
  //find the node
  var selectedVal = document.getElementById('search').value;
  var node = svg.selectAll(".node");
  if (selectedVal == "") {
    node.style("stroke", "white").style("stroke-width", "1");
    d3.selectAll(".node, .link").transition()
      .duration(1000)
      .style("opacity", 1);
    node.on('mouseover', tip.show);
  } else {
    var selected = node.filter(function(d) {
      node.on('mouseover', tip.hide);
      return d.name != selectedVal;
    });
    selected.style("opacity", "0");
    var link = svg.selectAll(".link");
    link.style("opacity", "0");
  }
}