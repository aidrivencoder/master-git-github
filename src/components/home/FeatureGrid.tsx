import { CodeBracketIcon, AcademicCapIcon, RocketLaunchIcon, UserGroupIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Interactive Tutorials',
    description: 'Learn by doing with our interactive, hands-on tutorials that guide you through real Git workflows.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Visual Learning',
    description: 'Understand complex Git concepts through clear, animated visualizations.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Project-Based',
    description: 'Apply your knowledge to real-world scenarios and build your portfolio.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Community Support',
    description: 'Join our community of learners and get help when you need it.',
    icon: UserGroupIcon,
  },
]

export function FeatureGrid() {
  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 dark:text-primary-500 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A better way to learn Git
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            Master version control with our comprehensive learning platform.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white mb-4">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}