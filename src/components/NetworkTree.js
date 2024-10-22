import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkTree = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = {
      name: "Root",
      children: [
        {
          name: "Child 1",
          children: [{ name: "Grandchild 1" }, { name: "Grandchild 2" }]
        },
        { name: "Child 2" }
      ]
    };

    const svg = d3.select(svgRef.current)
      .attr("width", 800)
      .attr("height", 600)
      .call(d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform);
      }))
      .append("g");

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([400, 400]);
    treeLayout(root);

    // Nodes
    svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 20)
      .on("mouseover", (event, d) => {
        // Display tooltip
        d3.select(".tooltip")
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`)
          .style("opacity", 1)
          .text(d.data.name);
      })
      .on("mouseout", () => {
        d3.select(".tooltip").style("opacity", 0);
      });

    // Links
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "black");

  }, []);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div className="tooltip" style={{ position: 'absolute', opacity: 0 }}></div>
    </>
  );
};

export default NetworkTree;
