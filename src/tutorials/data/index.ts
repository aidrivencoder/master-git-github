import { Tutorial } from '@/types/tutorial'
import { gitBasicsTutorial } from './git-basics'
import { gitBranchingTutorial } from './git-branching'

export const tutorials: Tutorial[] = [
  gitBasicsTutorial,
  gitBranchingTutorial,
]

export const getTutorialById = (id: string): Tutorial | undefined => {
  return tutorials.find(tutorial => tutorial.id === id)
}

export const getPrerequisiteTutorials = (tutorial: Tutorial): Tutorial[] => {
  if (!tutorial.prerequisites?.length) {
    return []
  }

  return tutorial.prerequisites
    .map(prereqId => tutorials.find(t => t.id === prereqId))
    .filter((t): t is Tutorial => t !== undefined)
}
