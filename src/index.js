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
indObjDataFormatter} from '../dataSorters';



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


d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {
	const countries = feature(data, data.objects.countries);
	// console.log('countries',countries)


	svg.selectAll('path')
		.data(countries.features)
		.enter().append('path')
			.attr('id', d => d.properties.name)
			.attr('class', 'country')
			.attr('d', pathGenerator)
			.on('click', function(d,i){ 
				let countryId = this.id
				setGraph1(countryId)
			})
			
})

const setGraph1 = (countryId) => {
	let data = []
	if (countryId === 'Malaysia') {
		data = filterByCountry(billData, countryId).concat(filterByCountry(billData, 'Singapore'))
		console.log('malaysia', data)
	} else if (countryId === 'China') {
		data = filterByCountry(billData, countryId).concat(filterByCountry(billData, 'Hong Kong'))
	} else {
		data = filterByCountry(billData, countryId)
	}	
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

// const setGraph2 = (countryId) => {

// }


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
	const y = d3.scaleLinear()
	.domain([0, 1600])
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

	// Animation
	svg.selectAll("rect")
	.transition()
	.duration(800)
	.attr("y", d => y(d.totalWorth))
	.attr("height", d => height - y(d.totalWorth))
	.delay((d,i) => {console.log(i); return i*100})

	
}


industryBarGraph(testData2)

//makes a circle packing graph using industry networth data 
//need to make it more general purpose and able to take in whatever industry networth data

// takes in array of objects where arrays are formatted as so {industry: 'Technology', totalWorth: 1700}

// const makeIndustryBubblesPlz = () => {
// 	const width = 460;
// 	const height = 460;

// 	const svg2 = d3.select('.industry-pie-container')
// 		.append('svg')
// 			.attr('width', width)
// 			.attr('height', height)

	
// 	const data = testData2;

// 	let color = d3.scaleOrdinal()
// 		.domain(allIndustries)
// 		.range(d3.schemeSet1);

// 	const size = d3.scaleLinear()
// 		.domain([0,1800])
// 		.range([7,55])

// 	const Tooltip = d3.select('.industry-pie-container')
// 		.append('div')
// 		.style('opacity', 0)
// 		.attr('class', 'tooltip')
// 		.style('background-color', 'white')
// 		.style("border", "solid")
// 		.style("border-width", "2px")
// 		.style("border-radius", "5px")
// 		.style("padding", "5px")

// 	let mouseover = function(event, d) {
// 		Tooltip
// 			.style("opacity", 1)
// 	}

	
// 	let mousemove = function(event, d) {
// 		console.log('event', event)
// 		console.log('mousemove hitting')
// 		console.log('mousemove d', d)
// 		const [x, y] = d3.pointer(event);
// 		Tooltip
// 		  	.html('<u>' + d.industry + '</u>' + "<br>" + `${d.totalWorth}` + " dollars in billions" )
// 			.style('position', 'relative')
// 			.style('z-index', 100)
// 			.style("left", 230 + "px")
//       		.style("top", 250 + "px")
// 		console.log(Tooltip)
// 	}

// 	let mouseleave = function(event, d) {
// 		Tooltip
// 		  .style("opacity", 0)
// 	}


// 	let node = svg2.append("g")
//     .selectAll("circle")
//     .data(data)
//     .join("circle")
//       .attr("class", "node")
//       .attr("r", d => size(d.totalWorth))
//       .attr("cx", width / 2)
//       .attr("cy", height / 2)
//       .style("fill", d => color(d.industry))
//       .style("fill-opacity", 0.8)
//       .attr("stroke", "black")
//       .style("stroke-width", 1)
//       .on("mouseover", mouseover) // What to do when hovered
//       .on("mousemove", mousemove)
//       .on("mouseleave", mouseleave)
//       .call(d3.drag() // call specific function when circle is dragged
//            .on("start", dragstarted)
//            .on("drag", dragged)
//            .on("end", dragended));


// 	const simulation = d3.forceSimulation()
// 	.force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
// 	.force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
// 	.force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.totalWorth)+3) }).iterations(1)) // Force that avoids circle overlapping

// 	//changed from v4 to v6
// 	simulation
//       .nodes(data)
//       .on("tick", function(d){
//         node
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y)
//       });

// 	  function dragstarted(event, d) {
// 		if (!event.active) simulation.alphaTarget(.03).restart();
// 		d.fx = d.x;
// 		d.fy = d.y;
// 	  }
// 	  function dragged(event, d) {
// 		d.fx = event.x;
// 		d.fy = event.y;
// 	  }
// 	  function dragended(event, d) {
// 		if (!event.active) simulation.alphaTarget(.03);
// 		d.fx = null;
// 		d.fy = null;
// 	  }

// }

// makeIndustryBubblesPlz()