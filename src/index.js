//wealth written 6/23/2021
//9:50 am
//from forbes billionaires list
import * as d3 from 'd3';
import { grabBillions } from '../scraper';
// import * as topojson from 'topojson-client';
import {feature} from 'topojson-client';
import './styles/main.scss';
import {billData} from '../billionaireData';
import {sortByCountry} from '../dataSorters';
import {getIndustries, sortByIndustry, ObjectToArr, filterByCountry, 
	getCountries, netWorthByCountry, newIndObj,
indObjDataFormatter, maxIndustryWorth} from '../dataSorters';



let data = billData
let testData1 = sortByIndustry(billData)
let testData2 = indObjDataFormatter(testData1)

console.log('billData',billData)
console.log('industries before conversion', sortByIndustry(billData))
console.log('testData2', testData2)




//Keep this it is necessary
const allIndustries = ["Technology", "Automotive", 
						"Fashion & Retail", "Finance & Investments", 
						"Diversified", "Food & Beverage", 
						"Telecom", "Media & Entertainment", 
						"Service", "Gambling & Casinos", 
						"Manufacturing", "Real Estate", "Metals & Mining", 
						"Energy", "Logistics", "Healthcare", 
						"Construction & Engineering"]


// FUNCTION TO SCRAPE WEB AND GET BILLIONAIRE DATA
// async function getData() {
// 	const response = await fetch('https://www.forbes.com/billionaires/');
// 	console.log('response', response)
// }

// getData()




//this is how the map is generated

const svg = d3.select('svg');


const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);
const g = svg.append('g')

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then(data => {
	const countries = feature(data, data.objects.countries);
	
	svg.call(d3.zoom().on("zoom", (event) => {
		g.attr('transform', event.transform)
	}))
	
	
	g.selectAll('path')
	.data(countries.features)
	.enter().append('path')
	.attr('id', d => d.properties.name)
	.attr('class', 'country')
	.attr('d', pathGenerator)
	.on('click', function(d,i){ 
		let countryId = this.id
		setGraph1(countryId)
		setGraph2(countryId)
	})
	.append('title')
	.text(d => d.properties.name)

	
	// svg.call(d3.zoom().on('zoom', () => {
	// 	console.log('svg',svg)
	// 	svg.attr('transform', d3.event.transform)
	// }));
			
})


const setGraph1 = (countryId) => {
	let data = filterByCountry(billData, countryId)	
	let circleEle = document.getElementsByClassName('billionaire-circle-packing')
	let toolTip = document.getElementsByClassName('tooltip')
	console.log('tooltip', circleEle)
	if(circleEle.length !== 0) {
		circleEle[0].parentNode.removeChild(circleEle[0])
		toolTip[0].parentNode.removeChild(toolTip[0])
		billionaireBubbles(data)
	
		
	} else {
	
		billionaireBubbles(data)
	}
}




//Graph that returns circle packing graph of billionaire's wealth sizes
//takes in an array of objects containing json formatted objects 
// ex. {"id": 2, "name": "Elon Musk",
// "country": "United States", "netWorth": 151, "age": 49, "source": "Tesla,
// SpaceX", "industry": "Automotive"}

const billionaireBubbles = (data) => {
	const width = 500;
	const height = 500;

	const svg = d3.select('.billionaire-circle-container')
				.append('svg')
				.attr('class', 'billionaire-circle-packing')
				.attr('width', height)
				.attr('height', height)
				.style('background-color', 'lightblue')
				.style('border-radius', 50 + '%')
	
	const color = d3.scaleOrdinal()
			.domain(allIndustries)
			.range(d3.quantize(t => d3.interpolateTurbo(t * 0.8 + 0.1), allIndustries.length).reverse())

	const size = d3.scaleLinear()
		.domain([0, 190])
		.range([10,60]) 

	const Tooltip = d3.select(".billionaire-circle-container")
		.append("div")
		.style("opacity", 0)
		.attr("class", "tooltip")
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "2px")
		.style("border-radius", "5px")
		.style("padding", "5px")
	
	const mouseover = function(event, d) {
		Tooltip
			.style("opacity", 1)
	}

	const mousemove = function(event, d) {
		Tooltip
			.html('<u>' + d.name + ' - ' + d.source + '</u>' + "<br>" + d.netWorth + " billion dollars" + "<br>" + d.industry + " industry")
			.style("left", (event.x/2+20) + "px")
			.style("top", (event.y/2-30) + "px")
	}
	
	let mouseleave = function(event, d) {
		Tooltip
			.style("opacity", 0)
	}

	let node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("class", "node")
      .attr("r", d => size(d.netWorth))
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", d => color(d.industry))
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

		   const simulation = d3.forceSimulation()
		   .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
		   .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
		   .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.netWorth)+3) }).iterations(1)) // Force that avoids circle overlapping
	 
	   // Apply these forces to the nodes and update their positions.
	   // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
	   simulation
		   .nodes(data)
		   .on("tick", function(d){
			 node
				 .attr("cx", d => d.x)
				 .attr("cy", d => d.y)
		   });
	 
	   // What happens when a circle is dragged?
	   function dragstarted(event, d) {
		 if (!event.active) simulation.alphaTarget(.03).restart();
		 d.fx = d.x;
		 d.fy = d.y;
	   }
	   function dragged(event, d) {
		 d.fx = event.x;
		 d.fy = event.y;
	   }
	   function dragended(event, d) {
		 if (!event.active) simulation.alphaTarget(.03);
		 d.fx = null;
		 d.fy = null;
	   }
}

// billionaireBubbles(billData)


	

//function creates a bar graph showing the aggregated wealth of billionaires for each major industry
// industry format ex. [{industry: "Technology", totalWorth: 1700}]

const industryBarGraph = (industryData) => {

	// set the dimensions and margins of the graph
	const margin = {top: 10, right: 30, bottom: 90, left: 40},
		width = 460 - margin.left - margin.right,
		height = 460 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3.select(".industry-bar-graph")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr('class', 'bar-graph-svg')
		.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

	// Parse the Data
	let data = industryData;

	const color = d3.scaleOrdinal()
			.domain(allIndustries)
			.range(d3.quantize(t => d3.interpolateTurbo(t * 0.8 + 0.1), allIndustries.length).reverse())

	// X axis
	const x = d3.scaleBand()
		.range([ 0, width ])
		.domain(data.map(d => d.industry))
		.padding(0.2);
		svg.append("g")
		.attr("transform", `translate(0,${height})`)
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Add Y axis
	console.log('industry d', data)
	let maxIndustryValue = Math.floor(maxIndustryWorth(data)) + 200
	console.log('max', maxIndustryValue)


	const y = d3.scaleLinear()
	.domain([0, maxIndustryValue])
	.range([ height, 0]);
	svg.append("g")
	.call(d3.axisLeft(y));

	// Bars
	svg.selectAll("mybar")
	.data(data)
	.join("rect")
	.attr("x", d => x(d.industry))
	.attr("width", x.bandwidth())
	.attr("fill",  d => color(d.industry) )
	// no bar at the beginning thus:
	.attr("height", d => height - y(0)) // always equal to 0
	.attr("y", d => y(0))
	.append('title')
	.text(d => d.totalWorth)

	// Animation
	svg.selectAll("rect")
	.transition()
	.duration(800)
	.attr("y", d => y(d.totalWorth))
	.attr("height", d => height - y(d.totalWorth))
	.delay((d,i) => {console.log(i); return i*100})
	

	
}

const setGraph2 = (countryId) => {
	let data = []
	
	data = filterByCountry(billData, countryId)
	data = sortByIndustry(data)
	data = indObjDataFormatter(data)
		

	let barEle = document.getElementsByClassName('bar-graph-svg')
	if(barEle.length !== 0) {
		barEle[0].parentNode.removeChild(barEle[0])
		industryBarGraph(data)
	
	} else {
		industryBarGraph(data)
	}
	

}
// setGraph2('Brazil')


// industryBarGraph(testData2)

