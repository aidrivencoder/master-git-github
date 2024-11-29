'use client'

import { useEffect, useRef, useState } from 'react'
import { GitVisualization, GitNode, GitEdge } from '@/types/tutorial'
import { useTheme } from '@/components/theme/ThemeProvider'

interface GitVisualizerV2Props {
  visualization: GitVisualization
  interactive?: boolean
  onNodeClick?: (nodeId: string) => void
}

interface Position {
  x: number
  y: number
}

export function GitVisualizerV2({
  visualization,
  interactive = false,
  onNodeClick
}: GitVisualizerV2Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  const { theme } = useTheme()

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    // Draw edges first
    visualization.edges.forEach(edge => {
      drawEdge(ctx, edge, visualization.nodes)
    })

    // Then draw nodes
    visualization.nodes.forEach(node => {
      drawNode(ctx, node, node.id === hoveredNode)
    })

    ctx.restore()

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mouseup', handleMouseUp)
      canvas.addEventListener('mouseleave', handleMouseUp)
      canvas.addEventListener('wheel', handleWheel)
    }

    return () => {
      if (interactive && canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mouseup', handleMouseUp)
        canvas.removeEventListener('mouseleave', handleMouseUp)
        canvas.removeEventListener('wheel', handleWheel)
      }
    }
  }, [visualization, hoveredNode, interactive, onNodeClick, theme, zoom, pan])

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const delta = -event.deltaY / 1000
    setZoom(prevZoom => {
      const newZoom = prevZoom + delta
      return Math.min(Math.max(0.5, newZoom), 2) // Limit zoom between 0.5x and 2x
    })
  }

  const handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) { // Left click only
      setIsDragging(true)
      setDragStart({
        x: event.clientX - pan.x,
        y: event.clientY - pan.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  const handleMouseMove = (event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (isDragging && dragStart) {
      // Handle panning
      setPan({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      })
    } else {
      // Handle node hover
      const rect = canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left - pan.x) / zoom
      const y = (event.clientY - rect.top - pan.y) / zoom

      const hoveredNodeId = findNodeAtPosition(x, y, visualization.nodes)
      setHoveredNode(hoveredNodeId)
    }
  }

  const handleClick = (event: MouseEvent) => {
    if (!onNodeClick || isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left - pan.x) / zoom
    const y = (event.clientY - rect.top - pan.y) / zoom

    const clickedNodeId = findNodeAtPosition(x, y, visualization.nodes)
    if (clickedNodeId) {
      onNodeClick(clickedNodeId)
    }
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className={`w-full transition-all duration-300 ${
          interactive ? 'cursor-pointer' : ''
        } ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          title="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          title="Reset View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>
      </div>
    </div>
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
