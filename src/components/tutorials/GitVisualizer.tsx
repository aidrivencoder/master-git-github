'use client'

import { useEffect, useRef, useState } from 'react'
import { GitVisualization, GitNode, GitEdge } from '@/types/tutorial'

interface GitVisualizerProps {
  visualization: GitVisualization
  interactive?: boolean
  onNodeClick?: (nodeId: string) => void
}

interface Position {
  x: number
  y: number
}

interface Transform {
  scale: number
  offsetX: number
  offsetY: number
}

interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export function GitVisualizer({
  visualization,
  interactive = false,
  onNodeClick
}: GitVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [transform, setTransform] = useState<Transform>({ scale: 1, offsetX: 0, offsetY: 0 })

  const getBounds = (nodes: GitNode[]): Bounds => {
    if (nodes.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    
    return nodes.reduce((bounds, node) => {
      const pos = getNodePosition(node)
      return {
        minX: Math.min(bounds.minX, pos.x),
        maxX: Math.max(bounds.maxX, pos.x),
        minY: Math.min(bounds.minY, pos.y),
        maxY: Math.max(bounds.maxY, pos.y)
      }
    }, {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity
    })
  }

  const fitContent = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const bounds = getBounds(visualization.nodes)
    const padding = 50 // Padding around content
    const contentWidth = bounds.maxX - bounds.minX + padding * 2
    const contentHeight = bounds.maxY - bounds.minY + padding * 2

    const scaleX = canvas.width / contentWidth
    const scaleY = canvas.height / contentHeight
    const scale = Math.min(scaleX, scaleY, 2) // Cap maximum zoom at 2x

    const offsetX = (canvas.width - contentWidth * scale) / 2 - bounds.minX * scale + padding * scale
    const offsetY = (canvas.height - contentHeight * scale) / 2 - bounds.minY * scale + padding * scale

    setTransform({ scale, offsetX, offsetY })
  }

  const handleZoom = (delta: number) => {
    setTransform(prev => {
      const newScale = Math.max(0.1, Math.min(2, prev.scale + delta))
      return { ...prev, scale: newScale }
    })
  }

  useEffect(() => {
    fitContent()
  }, [visualization])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transform
    ctx.save()
    ctx.translate(transform.offsetX, transform.offsetY)
    ctx.scale(transform.scale, transform.scale)

    // Draw edges first
    visualization.edges.forEach(edge => {
      drawEdge(ctx, edge, visualization.nodes)
    })

    // Then draw nodes
    visualization.nodes.forEach(node => {
      drawNode(ctx, node, node.id === hoveredNode)
    })

    ctx.restore()

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const rect = canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left - transform.offsetX) / transform.scale
      const y = (event.clientY - rect.top - transform.offsetY) / transform.scale
      
      setHoveredNode(null)
      visualization.nodes.forEach((node) => {
        if (isPointInNode(x, y, node)) {
          setHoveredNode(node.id)
        }
      })
    }

    const handleClick = (event: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas || !interactive) return
      
      const rect = canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left - transform.offsetX) / transform.scale
      const y = (event.clientY - rect.top - transform.offsetY) / transform.scale
      
      visualization.nodes.forEach((node) => {
        if (isPointInNode(x, y, node)) {
          onNodeClick?.(node.id)
        }
      })
    }

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('click', handleClick)
    }

    return () => {
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('click', handleClick)
      }
    }
  }, [visualization, hoveredNode, interactive, onNodeClick, transform])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={1000}
        height={500}
        className={`w-full transition-all duration-300 ${
          interactive ? 'cursor-pointer' : ''
        } bg-gray-950`}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => handleZoom(0.1)}
          className="rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={fitContent}
          className="rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 8 3 12 7 16"></polyline>
            <polyline points="17 8 21 12 17 16"></polyline>
            <line x1="3" y1="12" x2="21" y2="12"></line>
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
  const radius = 20
  const position = getNodePosition(node)

  // Draw node background
  ctx.beginPath()
  ctx.arc(position.x, position.y, radius, 0, Math.PI * 2)
  ctx.fillStyle = getNodeColor(node.type, isHovered)
  ctx.fill()

  // Add a subtle glow effect
  ctx.shadowColor = getNodeColor(node.type, false)
  ctx.shadowBlur = 10

  // Draw node border
  ctx.strokeStyle = '#ffffff40'
  ctx.lineWidth = 2
  ctx.stroke()

  // Reset shadow
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0

  // Draw node label
  ctx.fillStyle = '#ffffff'
  ctx.font = '14px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(node.label || node.id.substring(0, 7), position.x, position.y)
}

function drawEdge(
  ctx: CanvasRenderingContext2D,
  edge: GitEdge,
  nodes: GitNode[]
) {
  const startNode = nodes.find(n => n.id === edge.source)
  const endNode = nodes.find(n => n.id === edge.target)
  
  if (!startNode || !endNode) return
  
  const startPos = getNodePosition(startNode)
  const endPos = getNodePosition(endNode)
  
  ctx.beginPath()
  ctx.moveTo(startPos.x, startPos.y)
  ctx.lineTo(endPos.x, endPos.y)
  ctx.strokeStyle = getEdgeColor(edge.type)
  ctx.lineWidth = 2
  ctx.stroke()
}

function getNodePosition(node: GitNode): Position {
  return {
    x: node.position?.x || 0,
    y: node.position?.y || 0
  }
}

function findNodeAtPosition(x: number, y: number, nodes: GitNode[]): string | null {
  const radius = 20
  return nodes.find(node => {
    const pos = getNodePosition(node)
    const dx = x - pos.x
    const dy = y - pos.y
    return dx * dx + dy * dy <= radius * radius
  })?.id || null
}

function isPointInNode(x: number, y: number, node: GitNode): boolean {
  const pos = getNodePosition(node)
  const dx = x - pos.x
  const dy = y - pos.y
  const radius = 20
  return dx * dx + dy * dy <= radius * radius
}

function getNodeColor(type: GitNode['type'], isHovered: boolean): string {
  let baseColor = ''
  switch (type) {
    case 'commit':
      baseColor = '#4ade80'
      break
    case 'branch':
      baseColor = '#60a5fa'
      break
    case 'tag':
      baseColor = '#f472b6'
      break
    default:
      baseColor = '#94a3b8'
  }
  return isHovered ? adjustColorBrightness(baseColor, 20) : baseColor
}

function getEdgeColor(type: GitEdge['type']): string {
  return '#ffffff40'
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