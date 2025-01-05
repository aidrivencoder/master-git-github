import { Tutorial } from '@/types/tutorial'
import { gitBasicsTutorial } from './git-basics'
import { gitBranchingTutorial } from './git-branching'

export const tutorials: Tutorial[] = [
  gitBasicsTutorial,
  gitBranchingTutorial,
]

export const getTutorial = (id: string): Tutorial | undefined => {
  return tutorials.find(tutorial => tutorial.id === id)
}

export const getPublicTutorials = (): Tutorial[] => {
  return tutorials.filter(tutorial => !tutorial.isPremium)
}

export const getAllTutorials = (): Tutorial[] => {
  return tutorials
}
