export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  type: 'tutorial' | 'streak' | 'contribution'
  progress?: {
    current: number
    total: number
  }
}