//wealth written 6/23/2021
//9:50 am
//from forbes billionaires list
import * as d3 from 'd3';
import { grabBillions } from '../scraper';
// import * as topojson from 'topojson-client';
import {feature} from 'topojson-client'
import './styles/main.scss';
import {billData} from '../billionaireData'

console.log('billData',billData)


// FUNCTION TO SCRAPE WEB AND GET BILLIONAIRE DATA
// async function getData() {
// 	const response = await fetch('https://www.forbes.com/billionaires/');
// 	console.log('response', response)
// }

// getData()





// const width = 900;
// const height = 600;
const svg = d3.select('svg');


const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);


d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {
	const countries = feature(data, data.objects.countries);
	// console.log('countries',countries)


	console.log(countries.features)
	svg.selectAll('path')
		.data(countries.features)
		.enter().append('path')
			// .classed(d => d.properties.name)
			// .attr('id', d => d.properties.name)
			// .attr('class', 'country')
			// .classed('country', true)
			.attr('id', d => d.properties.name)
			.attr('class', 'country')
			// .classed(d => d.properties.features, true)
			.attr('d', pathGenerator)
			.text(d => console.log(d.properties.name))
			

		

})

d3.selectAll("p").style("color", function() {
	return "hsl(" + Math.random() * 360 + ",100%,50%)";
  });

const country = document.querySelectorAll('.country')

country.addEventListener('click', e => {
	console.log(e)
})

const we = document.querySelector('.we')

we.addEventListener('click', e => {
	console.log(e)
})

// const g = svg.append('g');

// svg.call(d3.zoom().on('zoom', () => {
// 	g.attr('transform', d3.event.transform);
// }))


	
	




