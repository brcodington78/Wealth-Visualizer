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