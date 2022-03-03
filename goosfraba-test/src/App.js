import { useQuery, gql } from "@apollo/client";
import React, { useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

const GET_POSTS = gql`
  query {
    allPosts(count: 500) {
      title
      createdAt
      author {
        firstName
        lastName
      }
    }
  }
`;

function App() {
  const {  data, loading } = useQuery(GET_POSTS);
  let monthsValues = {};
  let dateList = [];
  if (loading === false) {
    dateList = data["allPosts"].map((item) => {
      const aux = {};
      aux["date"] = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(item.createdAt)
        .replace(/[^\d].*/, "");

      return aux;
    });
  }
  for (let val in dateList) {
    if (!monthsValues[dateList[val].date]) {
      monthsValues[dateList[val].date] = 1;
    } else {
      monthsValues[dateList[val].date]++;
    }
  }
  const months = [
    { name: "January", value: monthsValues["01"] },
    { name: "February", value: monthsValues["02"] },
    { name: "March", value: monthsValues["03"] },
    { name: "April", value: monthsValues["04"] },
    { name: "May", value: monthsValues["05"] },
    { name: "June", value: monthsValues["06"] },
    { name: "July", value: monthsValues["07"] },
    { name: "August", value: monthsValues["08"] },
    { name: "September", value: monthsValues["09"] },
    { name: "October", value: monthsValues["10"] },
    { name: "November", value: monthsValues["11"] },
    { name: "December", value: monthsValues["12"] },
  ];

  useEffect(() => {
    const margin = 60;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;
    const svg = d3.select(".target");

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, Math.max(...months.map((d) => d.value))]);
    chart.append("g").call(d3.axisLeft(yScale));

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(months.map((d) => d.name))
      .padding(0.2);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    chart
      .selectAll()
      .data(months)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => height - yScale(d.value))
      .attr("width", (d) => xScale.bandwidth())
      .style("fill", (d, i) => colorScale(i))
      .append("title")
      .text((d) => `Posts in ${d.name} : ${d.value}`);
  });

  return (
    <div className="App">
      <svg className="target"></svg>
    </div>
  );
}

export default App;
