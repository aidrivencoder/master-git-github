'use client'

import { useEffect, useRef, useState } from 'react'
import { GitVisualization, GitNode, GitEdge } from '@/types/tutorial'
import { useTheme } from '@/components/theme/ThemeProvider'

interface GitVisualizerV2Props {
  visualization: GitVisualization
  interactive?: boolean
  onNodeClick?: (nodeId: string) => void
}

export function GitVisualizerV2({
  visualization,
  interactive = false,
  onNodeClick
}: GitVisualizerV2Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges first
    visualization.edges.forEach(edge => {
      drawEdge(ctx, edge, visualization.nodes)
    })

    // Then draw nodes
    visualization.nodes.forEach(node => {
      drawNode(ctx, node, node.id === hoveredNode)
    })

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('click', handleClick)
    }

    return () => {
      if (interactive && canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('click', handleClick)
      }
    }
  }, [visualization, hoveredNode, interactive, onNodeClick, theme])

  const handleMouseMove = (event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const hoveredNodeId = findNodeAtPosition(x, y, visualization.nodes)
    setHoveredNode(hoveredNodeId)
  }

  const handleClick = (event: MouseEvent) => {
    if (!onNodeClick) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const clickedNodeId = findNodeAtPosition(x, y, visualization.nodes)
    if (clickedNodeId) {
      onNodeClick(clickedNodeId)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={500}
      className={`w-full transition-all duration-300 ${
        interactive ? 'cursor-pointer' : ''
      } ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    />
  )
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: GitNode,
  isHovered: boolean
) {
  const { x, y } = node.position
  const radius = isHovered ? 24 : 20
  const shadowBlur = isHovered ? 15 : 10

  // Draw shadow
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = shadowBlur
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.beginPath()
  ctx.arc(x, y, radius + 2, 0, 2 * Math.PI)
  ctx.fillStyle = getNodeColor(node.type, isHovered)
  ctx.fill()
  ctx.restore()

  // Draw node
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fillStyle = getNodeColor(node.type, isHovered)
  ctx.fill()

  // Draw label
  ctx.fillStyle = isHovered ? '#FFFFFF' : '#F8F8F8'
  ctx.font = `${isHovered ? 'bold ' : ''}${isHovered ? '15px' : '14px'} system-ui, -apple-system, sans-serif`
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
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.stroke()
}

function findNodeAtPosition(x: number, y: number, nodes: GitNode[]): string | null {
  const radius = 20
  return nodes.find(node => {
    const dx = x - node.position.x
    const dy = y - node.position.y
    return dx * dx + dy * dy <= radius * radius
  })?.id || null
}

function getNodeColor(type: GitNode['type'], isHovered: boolean): string {
  const baseColors = {
    commit: '#22c55e',
    branch: '#3b82f6',
    tag: '#eab308'
  }

  const color = baseColors[type] || '#9E9E9E'
  return isHovered ? adjustColorBrightness(color, 20) : color
}

function getEdgeColor(type: GitEdge['type']): string {
  return type === 'commit' ? '#64748b' : '#3b82f6'
}

function adjustColorBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return `#${(
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1)}`
}