import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const NetworkTree = () => {
  const svgRef = useRef();
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [data] = useState({
    name: "Root",
    children: [
      {
        name: "Child 1",
        children: [{ name: "Grandchild 1" }, { name: "Grandchild 2" }]
      },
      { name: "Child 2" }
    ]
  });

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", 800)
      .attr("height", 600)
      .call(d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform);
      }))
      .append("g")
      .attr("transform", "translate(100,100)");

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([400, 400]);
    treeLayout(root);

    svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 20) 
    .attr("fill", d => 
      d.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ? "#FF6A3D" : "#3498db") 
    .attr("stroke", "white")
    .attr("stroke-width", 3)
    .on("click", (event, d) => setModalData(d.data))
    .on("mouseover", (event, d) => {
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
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y)
      )
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");
    

  }, [data]);

  useEffect(() => {
    d3.select(svgRef.current)
      .selectAll(".node")
      .attr("fill", function(d) {
        return d.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ? "#FF6A3D" : "#3498db";
      });
  }, [searchTerm]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div className="tooltip" style={{ position: 'absolute', opacity: 0 }}></div>
      {modalData && (
        <div className="modal" style={{ position: 'fixed', top: '20%', left: '20%', backgroundColor: 'white', padding: '20px', boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}>
          <h3>{modalData.name}</h3>
          <p>Additional information about {modalData.name}</p>
          <button onClick={() => setModalData(null)}>Close</button>
        </div>
      )}
      <div>
      <input 
        type="text" 
        placeholder="Search for a node" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <svg ref={svgRef}></svg>
    </div>
    </>
  );
};

export default NetworkTree;
