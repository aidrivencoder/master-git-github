'use client'

import { useEffect, useRef } from 'react'
import { GitVisualization, GitNode, GitEdge } from '@/types/tutorial'

interface GitVisualizerProps {
  visualization: GitVisualization
}

export function GitVisualizer({ visualization }: GitVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw edges
    visualization.edges.forEach(edge => {
      drawEdge(ctx, edge, visualization.nodes)
    })

    // Draw nodes
    visualization.nodes.forEach(node => {
      drawNode(ctx, node)
    })
  }, [visualization])

  return (
    <div className="border rounded-lg p-4 bg-white">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full"
      />
    </div>
  )
}

function drawNode(ctx: CanvasRenderingContext2D, node: GitNode) {
  const { x, y } = node.position
  
  // Draw circle
  ctx.beginPath()
  ctx.arc(x, y, 20, 0, 2 * Math.PI)
  ctx.fillStyle = getNodeColor(node.type)
  ctx.fill()
  
  // Draw label
  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(node.label, x, y)
}

function drawEdge(
  ctx: CanvasRenderingContext2D, 
  edge: GitEdge, 
  nodes: GitNode[]
) {
  const sourceNode = nodes.find(n => n.id === edge.source)
  const targetNode = nodes.find(n => n.id === edge.target)
  
  if (!sourceNode || !targetNode) return

  ctx.beginPath()
  ctx.moveTo(sourceNode.position.x, sourceNode.position.y)
  ctx.lineTo(targetNode.position.x, targetNode.position.y)
  ctx.strokeStyle = getEdgeColor(edge.type)
  ctx.stroke()
}

function getNodeColor(type: GitNode['type']) {
  switch (type) {
    case 'commit': return '#4CAF50'
    case 'branch': return '#2196F3'
    case 'tag': return '#FFC107'
    default: return '#9E9E9E'
  }
}

function getEdgeColor(type: GitEdge['type']) {
  switch (type) {
    case 'commit': return '#666'
    case 'branch': return '#2196F3'
    default: return '#9E9E9E'
  }
}