//wealth written 6/23/2021
//9:50 am
//from forbes billionaires list
import * as d3 from 'd3';
// import * as topojson from 'topojson-client';
import {feature} from 'topojson-client'
import './styles/main.scss';

// const width = 900;
// const height = 600;
const svg = d3.select('svg');


const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);


d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {
	const countries = feature(data, data.objects.countries);
	console.log(data)
	
	svg.selectAll('path')
		.data(countries.features)
		.enter().append('path')
			.attr('class', 'country')
			.attr('d', pathGenerator)
		.append('title')
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


	
	




