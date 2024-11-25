import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const meaningfulNames = [
  "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel",
  "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa",
  "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray",
  "Yankee", "Zulu", "Phoenix", "Orion", "Lyra", "Pegasus", "Aurora", "Vega",
];

const getRandomName = (usedNames) => {
  let randomName;
  do {
    randomName = meaningfulNames[Math.floor(Math.random() * meaningfulNames.length)] +
                 Math.floor(Math.random() * 1000); // Add a random number for uniqueness
  } while (usedNames.has(randomName)); // Ensure no duplicates
  usedNames.add(randomName);
  return randomName;
};

const generateTestData = (numNodes) => {
  const usedNames = new Set();
  const generateNode = (level, index) => ({
    name: getRandomName(usedNames),
    image: `https://picsum.photos/seed/${level}-${index}100/100`,
    children: level < Math.log2(numNodes) ? Array(2).fill(null).map((_, i) => generateNode(level + 1, index * 2 + i)) : []
  });

  return generateNode(0, 0);
};

const NetworkTree = () => {
  const svgRef = useRef();
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const [data, setData] = useState(generateTestData(1000));

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove();

    const zoomBehavior = d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

    const g = svg
      .attr("width", 800)
      .attr("height", 600)
      .call(zoomBehavior)
      .append("g")
      .attr("transform", "translate(100,100)");
    
    const renderTree = () => {
      const root = d3.hierarchy(data);
      
      const treeLayout = d3.tree().nodeSize([100, 200]);
      treeLayout(root);

      const nodes = g.selectAll(".node")
      .data(root.descendants(), d => d.data.name); 

      const links = g.selectAll(".link")
        .data(root.links(), d => d.target.data.name);
      
      const nodeEnter = nodes.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .on("click", (event, d) => setModalData(d.data));

      nodeEnter.append("rect")
        .attr("width", 100)
        .attr("height", 60)
        .attr("x", -50)
        .attr("y", -30)
        .attr("fill", d => 
          d.data.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ? "#ffeb3b" : "#fff")
        .attr("stroke", d => 
          d.data.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ? "#ff6a3d" : "#3498db")
        .attr("stroke-width", d =>
          d.data.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ? 3 : 2)
        .attr("rx", 10);
      
      nodeEnter.append("image")
        .attr("xlink:href", d => d.data.image)
        .attr("x", -30)
        .attr("y", -25)
        .attr("width", 30)
        .attr("height", 30)
        .attr("clip-path", "circle(15px at 15px 15px)");

      nodeEnter.append("text")
        .attr("dy", 10)
        .attr("x", 15)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("fill", "#333")
        .text(d => d.data.name); 

    // Remove old nodes
    nodes.exit().remove();
    
    // Links

    links.enter()
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

      // Remove old links
      links.exit().remove();

      //zoom on to the searched node
      if (debouncedSearchTerm) {
        const targetNode = root
          .descendants()
          .find((node) =>
            node.data.name
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
          );

        if (targetNode) {

          let current = targetNode;
          while (current) {
              current._children = current.children;
              current.children = current._children;
              current = current.parent;
          }

          treeLayout(root);
          
          const [x, y] = [targetNode.x, targetNode.y];
          const transform = d3.zoomIdentity.translate(400 - x * 2, 300 - y * 2).scale(2)
          svg.transition().duration(1000).call(zoomBehavior.transform, transform);
        }
      }
    };

    renderTree();

  }, [data, debouncedSearchTerm]);


  return (
    <>
      <input 
        type="text" 
        placeholder="Search for a node" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ marginBottom: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
      />
      <svg ref={svgRef} width="800" height="600"></svg>
      <div className="tooltip" style={{ position: 'absolute', opacity: 0, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', borderRadius: '5px', pointerEvents: 'none' }}></div>
      {modalData && (
        <div className="modal" style={{ position: 'fixed', top: '20%', left: '20%', backgroundColor: 'white', padding: '20px', boxShadow: '0px 4px 8px rgba(0,0,0,0.2)', borderRadius: '5px' }}>
          <h3>{modalData.name}</h3>
          <p>Additional information about {modalData.name}</p>
          <button onClick={() => setModalData(null)}>Close</button>
        </div>
      )}
    </>
  );
};

export default NetworkTree;
