'use client'

import { useState } from 'react'
import { Quiz as QuizType } from '@/types/tutorial'

interface QuizProps {
  quiz: QuizType
  onComplete?: () => void
}

export function Quiz({ quiz, onComplete }: QuizProps) {
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1))
  const [submitted, setSubmitted] = useState(false)

  const score = answers.reduce((acc, answer, index) => {
    return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0)
  }, 0)

  const handleSubmit = async () => {
    setSubmitted(true)
    if (score >= quiz.passingScore && onComplete) {
      await onComplete()
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quiz</h3>
      
      {quiz.questions.map((question, questionIndex) => (
        <div key={question.id} className="space-y-4">
          <p className="font-medium text-gray-900 dark:text-white">{question.text}</p>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 cursor-pointer transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/10 dark:border-gray-700"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={optionIndex}
                  checked={answers[questionIndex] === optionIndex}
                  onChange={() => {
                    const newAnswers = [...answers]
                    newAnswers[questionIndex] = optionIndex
                    setAnswers(newAnswers)
                  }}
                  disabled={submitted}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-900 dark:text-gray-100">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={answers.includes(-1)}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md transition-colors hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20">
          <p className="font-medium text-gray-900 dark:text-white">
            Score: {score} / {quiz.questions.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {score >= quiz.passingScore ? 
              'Congratulations! You passed the quiz!' : 
              'Keep practicing and try again!'}
          </p>
        </div>
      )}
    </div>
  )
}
