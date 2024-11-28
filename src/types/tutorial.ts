export interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  steps: TutorialStep[]
  prerequisites?: string[]
  estimatedTime: number
  isPremium: boolean
}

export interface TutorialStep {
  id: string
  title: string
  content: string
  type: 'text' | 'video' | 'interactive'
  gitVisualization?: GitVisualization
  quiz?: Quiz
}

export interface GitVisualization {
  type: 'commit' | 'branch' | 'merge'
  nodes: GitNode[]
  edges: GitEdge[]
}

export interface GitNode {
  id: string
  type: 'commit' | 'branch' | 'tag'
  label: string
  position: { x: number; y: number }
}

export interface GitEdge {
  source: string
  target: string
  type: 'commit' | 'branch'
}

export interface Quiz {
  questions: QuizQuestion[]
  passingScore: number
}

export interface QuizQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}