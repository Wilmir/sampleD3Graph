var width = 1000, height = 600

var nodes = [
    {name:"Dublin", homing: true},
    {name:"Belfast", homing: true},
    {name:"Wicklow", homing: false},
    {name:"Cork", homing: false},
    {name:"Galway", homing: false},
    {name:"Westmeath", homing: false},
    {name:"Kildare", homing: false},
    {name:"Wexford", homing: false},
    {name:"Carlow", homing: false},
    {name:"Laois", homing: false},
    {name:"Donegal", homing: false},
    {name:"Cavan", homing: false},
    {name:"Monaghan", homing: false},
    {name:"Armagh", homing: false},
    {name:"Meath", homing: false},
    {name:"Fermanagh", homing: false},
    {name:"Tyrone", homing: false},
    {name:"Leitrim", homing: false},
    {name:"Derry", homing: false},
    {name:"Antrim", homing: false},
    {name:"Sligo", homing: false},
    {name:"Kerry", homing: false},
    {name:"Clare", homing: false},
    {name:"Mayo", homing: false},
    {name:"Rosscommon", homing: false},
    {name:"Limerick", homing: false}
]

var links = [
{source: "Westmeath",  target: "Dublin",  type: "microwave",  capacity: 10000,  utilization: 5000},
{source: "Cork",  target: "Dublin",  type: "microwave",  capacity: 1000,  utilization: 750},
{source: "Galway",  target: "Dublin",  type: "microwave",  capacity: 10000,  utilization: 2000},
{source: "Wicklow",  target: "Dublin",  type: "microwave",  capacity: 1000,  utilization: 245},
{source: "Wicklow",  target: "Cork",  type: "fiber",  capacity: 10000,  utilization: 2000},
{source: "Galway",  target: "Cork",  type: "fiber",  capacity: 10000,  utilization: 5000},
{source: "Belfast",  target: "Dublin",  type: "fiber",  capacity: 100000,  utilization: 5000},
{source: "Wicklow",  target: "Westmeath",  type: "fiber",  capacity: 10000,  utilization: 5000},
{source: "Donegal",  target: "Monaghan",  type: "fiber",  capacity: 100,  utilization: 5000},
{source: "Wexford",  target: "Wicklow",  type: "microwave",  capacity: 100,  utilization: 50},
{source: "Kildare",  target: "Wicklow",  type: "microwave",  capacity: 100,  utilization: 34},
{source: "Carlow",  target: "Wicklow",  type: "microwave",  capacity: 100,  utilization: 49},
{source: "Laois",  target: "Kildare",  type: "microwave",  capacity: 100,  utilization: 34},
{source: "Cavan",  target: "Westmeath",  type: "microwave",  capacity: 100,  utilization: 45},
{source: "Monaghan",  target: "Westmeath",  type: "microwave",  capacity: 1000,  utilization: 40},
{source: "Armagh",  target: "Westmeath",  type: "microwave",  capacity: 100,  utilization: 90},
{source: "Meath",  target: "Westmeath",  type: "microwave",  capacity: 100,  utilization: 100},
{source: "Kerry",  target: "Cork",  type: "microwave",  capacity: 100,  utilization: 67},
{source: "Limerick",  target: "Galway",  type: "microwave",  capacity: 100,  utilization: 80},
{source: "Clare",  target: "Galway",  type: "microwave",  capacity: 100,  utilization: 78},
{source: "Mayo",  target: "Galway",  type: "microwave",  capacity: 100,  utilization: 20},
{source: "Rosscommon",  target: "Galway",  type: "microwave",  capacity: 100,  utilization: 56},
{source: "Sligo",  target: "Galway",  type: "microwave",  capacity: 100,  utilization: 78},
{source: "Fermanagh",  target: "Belfast",  type: "microwave",  capacity: 100,  utilization: 90},
{source: "Tyrone",  target: "Belfast",  type: "microwave",  capacity: 100,  utilization: 40},
{source: "Leitrim",  target: "Belfast",  type: "microwave",  capacity: 100,  utilization: 30},
{source: "Derry",  target: "Belfast",  type: "microwave",  capacity: 100,  utilization: 80},
{source: "Antrim",  target: "Belfast",  type: "microwave",  capacity: 100,  utilization: 60},
]

var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-200))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', d3.forceLink(links).id(d => d.name).distance(100))
  .on('tick', ticked);

function updateLinks() {
  var u = d3.select('.links')
    .selectAll('line')
    .data(links)

  u.enter()
    .append('line')
    .merge(u)
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('stroke-width', d => {
        if(d.capacity >= 10000){
            return 5;
        }else if (d.capacity >= 1000){
            return 3;
        }else{
            return 1;
        }
    }
    );

  u.exit().remove()
}

function updateNodes() {
  u = d3.select('.nodes')
    .selectAll('circle')
    .data(nodes)

  u.enter().append('circle')
    .merge(u)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.homing ? 12 : 8)
    .attr('fill', d => d.homing? "#1167b1": "black")
    .call(
        d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

  u.exit().remove()
}


function addText(){
    u = d3.select('.nodes')
      .selectAll("text")
      .data(nodes)

    u.enter().append("text")
    .text(d => d.name)
    .merge(u)
    .attr('x', d => d.x + 12)
    .attr('y', d => d.y - 10)
    .style('font-size', '10px');

    u.exit().remove();
}

function dragstarted(d){
    if(!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d){
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d){
    if(!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function calculateUtilization(){

    let linkSet = document.querySelector(".links");

    linkSet.classList.toggle("linkcolordefault");
    

    d3.select('.links')
    .selectAll('line')
    .attr("stroke", d => {
        let util = d.utilization/d.capacity;
        if(util >= 0.75){
            return "#bf0000";
        }else if(util >= 0.5){
            return "#efa536";
        }else{
            return "green";
        }
    })
}

function ticked() {
  addText();
  updateLinks();
  updateNodes();
}