'use client'

import { useState } from 'react'
import { Quiz as QuizType } from '@/types/tutorial'

interface QuizProps {
  quiz: QuizType
}

export function Quiz({ quiz }: QuizProps) {
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1))
  const [submitted, setSubmitted] = useState(false)

  const score = answers.reduce((acc, answer, index) => {
    return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0)
  }, 0)

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Quiz</h3>
      
      {quiz.questions.map((question, questionIndex) => (
        <div key={question.id} className="space-y-4">
          <p className="font-medium">{question.text}</p>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
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
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={answers.includes(-1)}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="font-medium">
            Score: {score} / {quiz.questions.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {score >= quiz.passingScore ? 
              'Congratulations! You passed the quiz!' : 
              'Keep practicing and try again!'}
          </p>
        </div>
      )}
    </div>
  )
}