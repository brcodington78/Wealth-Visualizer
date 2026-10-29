//wealth written 6/23/2021
//9:50 am
//from forbes billionaires list
import * as d3 from "d3";
import { grabBillions } from "../scraper";
// import * as topojson from 'topojson-client';
import { feature } from "topojson-client";
import "./styles/main.scss";
import { sortByCountry } from "../dataSorters";
import {
  getIndustries,
  sortByIndustry,
  ObjectToArr,
  filterByCountry,
  getCountries,
  netWorthByCountry,
  newIndObj,
  indObjDataFormatter,
  maxIndustryWorth,
} from "../dataSorters";

//Keep this it is necessary
let country = "";
//filled in once data/billionaires.json loads (kept fresh by a scheduled GitHub Action)
let billData = [];
let allIndustries = [];

//this is how the map is generated

const svg = d3.select(".map-svg");

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);
const g = svg.append("g");

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then(
  (data) => {
    const countries = feature(data, data.objects.countries);

    svg.call(
      d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
    );

    g.selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("id", (d) => d.properties.name)
      .attr("class", "country")
      .attr("d", pathGenerator)
      .on("click", function (d, i) {
        showCountry(this.id);
      })
      .append("title")
      .text((d) => d.properties.name);

    shadeCountries();
  }
);

//grays out countries with no billionaires; runs after whichever of the map or data loads last
const shadeCountries = () => {
  if (billData.length === 0) return;
  const countriesWithData = new Set(billData.map((d) => d.country.toLowerCase()));
  g.selectAll("path.country").classed(
    "no-data",
    function () {
      return !countriesWithData.has(this.id.toLowerCase());
    }
  );
};

//shows the graphs for one country (or every country when countryId is null),
//or a message instead when that country has no billionaires
const showCountry = (countryId = null) => {
  if (billData.length === 0) return;

  const people = countryId ? filterByCountry(billData, countryId) : billData;
  const isEmpty = people.length === 0;
  const label = countryId || "All countries";

  document.querySelector(".country-title").textContent = isEmpty
    ? label
    : `${label} · ${people.length.toLocaleString()} billionaires`;
  document.querySelector(".graph-container").hidden = isEmpty;
  document.querySelector(".empty-state").hidden = !isEmpty;

  if (isEmpty) {
    document.querySelector(".empty-state-text").textContent =
      `${countryId} has no billionaires on the Forbes list.`;
    return;
  }

  setGraph1(countryId);
  setGraph2(countryId);
};

const setGraph1 = (countryId = null) => {
  let data = {};
  if (countryId) {
    data = filterByCountry(billData, countryId);
  } else {
    data = billData;
  }
  let circleEle = document.getElementsByClassName("billionaire-circle-packing");
  let toolTip = document.getElementsByClassName("tooltip");

  if (circleEle.length !== 0) {
    circleEle[0].parentNode.removeChild(circleEle[0]);
    toolTip[0].parentNode.removeChild(toolTip[0]);
    billionaireBubbles(data);
  } else {
    billionaireBubbles(data);
  }
};

//Graph that returns circle packing graph of billionaire's wealth sizes
//takes in an array of objects containing json formatted objects
// ex. {"id": 2, "name": "Elon Musk",
// "country": "United States", "netWorth": 151, "age": 49, "source": "Tesla,
// SpaceX", "industry": "Automotive"}

const billionaireBubbles = (data) => {
  const width = 500;
  const height = 500;

  const svg = d3
    .select(".billionaire-circle-container")
    .append("svg")
    .attr("class", "billionaire-circle-packing")
    //viewBox lets the chart shrink to fit narrow screens
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("background-color", "lightblue")
    .style("border-radius", 50 + "%");

  const color = d3
    .scaleOrdinal()
    .domain(allIndustries)
    .range(
      d3
        .quantize(
          (t) => d3.interpolateTurbo(t * 0.8 + 0.1),
          allIndustries.length
        )
        .reverse()
    );

  //scale to the richest person in the full list so bubbles stay comparable across countries
  const size = d3
    .scaleLinear()
    .domain([0, d3.max(billData, (d) => d.netWorth)])
    .range([10, 60]);

  const Tooltip = d3
    .select(".billionaire-circle-container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "lightblue")
    .style("border", "none")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  const mouseover = function (event, d) {
    Tooltip.style("opacity", 1);
  };

  //phones have no hover, so tapping a bubble shows its info card instead
  const tap = function (event, d) {
    Tooltip.style("opacity", 1);
    mousemove(event, d);
  };

  const mousemove = function (event, d) {
    Tooltip.html(
      "<u>" +
        d.name +
        " - " +
        d.source +
        "</u>" +
        "<br>" +
        d.netWorth +
        " billion dollars" +
        "<br>" +
        d.industry +
        " industry" +
        "<br>" +
        d.country
    )
      .style("left", event.x / 2 + 20 + "px")
      .style("top", event.y / 2 - 30 + "px");
  };

  let mouseleave = function (event, d) {
    Tooltip.style("opacity", 0);
  };

  let node = svg
    .append("g")
    .attr("class", "graph1-g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("class", "node")
    .attr("r", (d) => size(d.netWorth))
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", (d) => color(d.industry))
    .style("fill-opacity", 0.8)
    .attr("stroke", "black")
    .style("stroke-width", 1)
    .on("mouseover", mouseover) // What to do when hovered
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .on("click", tap)
    .call(
      d3
        .drag() // call specific function when circle is dragged
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  const simulation = d3
    .forceSimulation()
    .force(
      "center",
      d3
        .forceCenter()
        .x(width / 2)
        .y(height / 2)
    ) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0.1)) // Nodes are attracted one each other of value is > 0
    .force(
      "collide",
      d3
        .forceCollide()
        .strength(0.2)
        .radius(function (d) {
          return size(d.netWorth) + 3;
        })
        .iterations(1)
    ); // Force that avoids circle overlapping

  svg.call(
    d3.zoom().on("zoom", (event) => {
      node.attr("transform", event.transform);
    })
  );
  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation.nodes(data).on("tick", function (d) {
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  // What happens when a circle is dragged?
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0.03);
    d.fx = null;
    d.fy = null;
  }
};

// billionaireBubbles(billData)

//function creates a bar graph showing the aggregated wealth of billionaires for each major industry
// industry format ex. [{industry: "Technology", totalWorth: 1700}]

const industryBarGraph = (industryData) => {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 90, left: 40 },
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select(".industry-bar-graph")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
    )
    .attr("class", "bar-graph-svg")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse the Data
  let data = industryData;

  const color = d3
    .scaleOrdinal()
    .domain(allIndustries)
    .range(
      d3
        .quantize(
          (t) => d3.interpolateTurbo(t * 0.8 + 0.1),
          allIndustries.length
        )
        .reverse()
    );

  // X axis
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d) => d.industry))
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis

  let maxIndustryValue = Math.floor(maxIndustryWorth(data)) + 200;

  const y = d3.scaleLinear().domain([0, maxIndustryValue]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.industry))
    .attr("width", x.bandwidth())
    .attr("fill", (d) => color(d.industry))
    // no bar at the beginning thus:
    .attr("height", (d) => height - y(0)) // always equal to 0
    .attr("y", (d) => y(0))
    .append("title")
    .text((d) => d.totalWorth);

  // Animation
  svg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => y(d.totalWorth))
    .attr("height", (d) => height - y(d.totalWorth))
    .delay((d, i) => {
      return i * 100;
    });
};

const setGraph2 = (countryId = null) => {
  let data = [];
  country = countryId;

  if (countryId) {
    data = filterByCountry(billData, countryId);
  } else {
    data = billData;
  }
  data = sortByIndustry(data);
  data = indObjDataFormatter(data);

  //the caption stays hidden until there's a graph for it to describe
  document.querySelector(".industry-graph-caption").hidden = false;

  let barEle = document.getElementsByClassName("bar-graph-svg");
  if (barEle.length !== 0) {
    barEle[0].parentNode.removeChild(barEle[0]);
    industryBarGraph(data);
  } else {
    industryBarGraph(data);
  }
};

const renderGraphs = () => {
  showCountry(null);
};

let theWorld = document.getElementById("globe-svg");

d3.json("./data/billionaires.json")
  .then((json) => {
    billData = json.billionaires;
    allIndustries = getIndustries(billData);

    const updated = new Date(json.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    document.querySelector(".last-updated").textContent =
      `Data last updated ${updated}.`;
    theWorld.addEventListener("click", renderGraphs);
    //on phones the globe icon is hidden and this button takes its place
    document
      .querySelector(".show-all-btn")
      .addEventListener("click", renderGraphs);
    document
      .querySelector(".empty-state-btn")
      .addEventListener("click", renderGraphs);

    shadeCountries();
  })
  .catch((err) => console.error("Could not load billionaire data", err));
