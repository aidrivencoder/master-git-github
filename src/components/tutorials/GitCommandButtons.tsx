import { useState } from 'react'
import { GitVisualization, GitNode, GitEdge } from '../../types/tutorial'

interface GitCommandButtonsProps {
  visualization: GitVisualization
  onVisualizationUpdate: (newVisualization: GitVisualization) => void
}

export function GitCommandButtons({ visualization, onVisualizationUpdate }: GitCommandButtonsProps) {
  const [currentBranch, setCurrentBranch] = useState('main')
  const [lastCommitId, setLastCommitId] = useState(1)
  const [hasUnstagedChanges, setHasUnstagedChanges] = useState(false)
  const [hasStagedChanges, setHasStagedChanges] = useState(false)

  const createNewCommit = (label: string, parentNode: GitNode) => {
    const newCommitId = `commit${lastCommitId + 1}`
    const newPosition = {
      x: parentNode.position.x + 100,
      y: parentNode.position.y
    }

    const newNode: GitNode = {
      id: newCommitId,
      type: 'commit',
      label,
      position: newPosition
    }

    const newEdge: GitEdge = {
      source: newCommitId,
      target: parentNode.id,
      type: 'commit'
    }

    return { newNode, newEdge, newCommitId }
  }

  const handleAddChanges = () => {
    setHasUnstagedChanges(true)
  }

  const handleStageChanges = () => {
    if (hasUnstagedChanges) {
      setHasStagedChanges(true)
      setHasUnstagedChanges(false)
    }
  }

  const handleCommit = () => {
    if (!hasStagedChanges) return

    const currentBranchNode = visualization.nodes.find(n => n.type === 'branch' && n.label === currentBranch)
    if (!currentBranchNode) return

    const lastCommit = visualization.nodes.find(n => {
      return visualization.edges.some(e => e.source === currentBranchNode.id && e.target === n.id)
    })
    if (!lastCommit) return

    const { newNode, newEdge, newCommitId } = createNewCommit('New commit', lastCommit)

    // Update branch to point to new commit
    const updatedEdges = visualization.edges
      .filter(e => e.source !== currentBranchNode.id)
      .concat([
        { source: currentBranchNode.id, target: newCommitId, type: 'branch' as const },
        newEdge
      ])

    onVisualizationUpdate({
      ...visualization,
      nodes: [...visualization.nodes, newNode],
      edges: updatedEdges
    })

    setLastCommitId(prev => prev + 1)
    setHasStagedChanges(false)
  }

  const handleCreateBranch = () => {
    const currentBranchNode = visualization.nodes.find(n => n.type === 'branch' && n.label === currentBranch)
    if (!currentBranchNode) return

    const targetCommit = visualization.nodes.find(n => {
      return visualization.edges.some(e => e.source === currentBranchNode.id && e.target === n.id)
    })
    if (!targetCommit) return

    const newBranchName = `feature${visualization.nodes.filter(n => n.type === 'branch').length}`
    const newBranch: GitNode = {
      id: newBranchName,
      type: 'branch',
      label: newBranchName,
      position: {
        x: targetCommit.position.x,
        y: targetCommit.position.y + 100
      }
    }

    const newEdge: GitEdge = {
      source: newBranch.id,
      target: targetCommit.id,
      type: 'branch'
    }

    onVisualizationUpdate({
      ...visualization,
      nodes: [...visualization.nodes, newBranch],
      edges: [...visualization.edges, newEdge]
    })
  }

  const handleSwitchBranch = (branchName: string) => {
    setCurrentBranch(branchName)
  }

  const handleMergeBranch = (sourceBranch: string) => {
    const targetBranchNode = visualization.nodes.find(n => n.type === 'branch' && n.label === currentBranch)
    const sourceBranchNode = visualization.nodes.find(n => n.type === 'branch' && n.label === sourceBranch)
    
    if (!targetBranchNode || !sourceBranchNode) return

    const targetCommit = visualization.nodes.find(n => {
      return visualization.edges.some(e => e.source === targetBranchNode.id && e.target === n.id)
    })
    const sourceCommit = visualization.nodes.find(n => {
      return visualization.edges.some(e => e.source === sourceBranchNode.id && e.target === n.id)
    })

    if (!targetCommit || !sourceCommit) return

    const { newNode, newEdge, newCommitId } = createNewCommit('Merge commit', targetCommit)
    
    const mergeEdge: GitEdge = {
      source: newCommitId,
      target: sourceCommit.id,
      type: 'commit'
    }

    // Update branch to point to merge commit
    const updatedEdges = visualization.edges
      .filter(e => e.source !== targetBranchNode.id)
      .concat([
        { source: targetBranchNode.id, target: newCommitId, type: 'branch' as const },
        newEdge,
        mergeEdge
      ])

    onVisualizationUpdate({
      ...visualization,
      nodes: [...visualization.nodes, newNode],
      edges: updatedEdges
    })

    setLastCommitId(prev => prev + 1)
  }

  const handlePushChanges = () => {
    const localBranch = visualization.nodes.find(n => n.type === 'branch' && n.label.startsWith('local/'))
    const remoteBranch = visualization.nodes.find(n => n.type === 'branch' && n.label.startsWith('origin/'))
    
    if (!localBranch || !remoteBranch) return

    const localCommit = visualization.nodes.find(n => {
      return visualization.edges.some(e => e.source === localBranch.id && e.target === n.id)
    })
    if (!localCommit) return

    // Update remote to point to the same commit as local
    const updatedEdges = visualization.edges
      .filter(e => e.source !== remoteBranch.id)
      .concat([
        { source: remoteBranch.id, target: localCommit.id, type: 'branch' as const }
      ])

    onVisualizationUpdate({
      ...visualization,
      edges: updatedEdges
    })
  }

  const availableBranches = visualization.nodes
    .filter(n => n.type === 'branch')
    .map(n => n.label)
    .filter(b => b !== currentBranch)

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-wrap gap-2">
        {/* Basic Git Operations */}
        <button
          onClick={handleAddChanges}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={hasUnstagedChanges}
        >
          Add Changes
        </button>

        <button
          onClick={handleStageChanges}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={!hasUnstagedChanges || hasStagedChanges}
        >
          Stage Changes
        </button>
        
        <button
          onClick={handleCommit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          disabled={!hasStagedChanges}
        >
          Commit Changes
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Branch Operations */}
        <button
          onClick={handleCreateBranch}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Create Branch
        </button>

        {availableBranches.length > 0 && (
          <>
            <select
              onChange={(e) => handleSwitchBranch(e.target.value)}
              value={currentBranch}
              className="px-4 py-2 border rounded"
            >
              <option value="main">main</option>
              {availableBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <button
              onClick={() => handleMergeBranch(availableBranches[0])}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Merge Branch
            </button>
          </>
        )}
      </div>

      {/* Remote Operations */}
      {visualization.nodes.some(n => n.label.includes('origin/')) && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePushChanges}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            Push Changes
          </button>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        <div>Current Branch: {currentBranch}</div>
        <div>Status: {hasUnstagedChanges ? 'Changes not staged' : hasStagedChanges ? 'Changes staged' : 'Clean'}</div>
      </div>
    </div>
  )
}
