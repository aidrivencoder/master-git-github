import { Tutorial } from '../../types/tutorial'
import { gitBasicsTutorial } from './git-basics'
import { gitBranchingTutorial } from './git-branching'
import { gitRemoteTutorial } from './git-remote'
import { gitAdvancedTutorial } from './git-advanced'
import { gitVisualTutorial } from './git-visual'
import { gitAIAssistanceTutorial } from './git-ai-assistance'

export const tutorials: Tutorial[] = [
  gitBasicsTutorial,
  gitBranchingTutorial,
  gitRemoteTutorial,
  gitAdvancedTutorial,
  gitVisualTutorial,
  gitAIAssistanceTutorial,
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
