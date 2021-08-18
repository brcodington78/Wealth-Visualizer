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
import {getIndustries, sortByIndustry, ObjectToArr} from '../dataSorters';


let data = billData





// FUNCTION TO SCRAPE WEB AND GET BILLIONAIRE DATA
// async function getData() {
// 	const response = await fetch('https://www.forbes.com/billionaires/');
// 	console.log('response', response)
// }

// getData()






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
			
})

// function makePieGraph() {
// 	let svg2 = d3.select('.industry-pie-container');
// 	let width = svg2.attr('width');
// 	let height = svg2.attr('height');
// 	let radius = Math.min(width, height) / 2;

// 	let data = sortByIndustry(billData);
// 	console.log('data', data)

// 	let g = svg2.append('g').attr('transform', 'translate('+ width / 2 + ',' + height / 2 + ')');
// 	let color = d3.scaleOrdinal().domain(data.map(d => d.name))
//     .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

// 	let pie = d3.pie();

// 	let arc = d3.arc()
// 				.innerRadius(0)
// 				.outerRadius(radius);

// 	let arcs = g.selectAll('arc')
// 				.data(pie(data))
// 				.enter().append('g')
// 				.attr('class','arc')
// 	arcs.append('path')
// 		.attr("fill", d => color(d.data.name))
// 		.attr('d', arc);

// 	console.log('color', color())
// }

// makePieGraph()




function makePieChart3() {
	let width = 450;
	let height = 450;
	let margin = 40;

	console.log('sortByIndustry', sortByIndustry(billData), sortByIndustry(billData).length)
	let data = sortByIndustry(billData);
	let newData = ObjectToArr(data)

	let radius = Math.min(width, height) / 2 - margin;

	let svg2 = d3.select('.industry-pie-container')
		.append('svg')
			.attr("width", width)
			.attr('height', height)
		.append("g")
			.attr("transform", `translate(${width/2}, ${height/2})`);
	
		const color = d3.scaleOrdinal()
			.range( d3.schemePaired)

		// const color = d3.scaleOrdinal().domain(newData)
		// .range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"])

	// let color = d3.scaleOrdinal().domain(data.map(d => d.name))
    // .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

	let pie = d3.pie()
		.value(function(d) {return d[1] })
	
	let dataReady = pie(Object.entries(data))

	const arcGenerator = d3.arc()
		.innerRadius(0)
		.outerRadius(radius)

	svg2
		.selectAll('whatever')
		.data(dataReady)
		.join('path')
		.attr('d', arcGenerator
		)
		.attr('fill', function(d){ return(color(d.data[1])) })
		.attr("stroke", "black")
		.style("stroke-width", "2px")
		.style("opacity", 0.7)

	svg2
		.selectAll('whatever')
		.data(dataReady)
		.join('text')
		.text(function(d){ return d.data[0]})
		.attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
  		.style("text-anchor", "middle")
  		.style("font-size", 10)



}

makePieChart3()





	
	




