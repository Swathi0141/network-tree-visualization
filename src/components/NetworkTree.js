import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkTree = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', 800)
      .attr('height', 600)
      .style('border', '1px solid black')
      .call(d3.zoom().on('zoom', (event) => {
        svg.attr('transform', event.transform);
      }))
      .append('g');

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([400, 400]);
    const treeData = treeLayout(root);

    // Links
    svg.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', 'black');

    // Nodes
    svg.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 20)
      .attr('fill', 'blue');
    
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default NetworkTree;