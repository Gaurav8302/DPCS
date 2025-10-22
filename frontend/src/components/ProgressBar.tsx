import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentSection: number
  totalSections: number
  completedSections: string[]
}

const sections = [
  'Trail Making',
  'Cube/2D Copy',
  'Clock Drawing',
  'Naming',
  'Attention',
  'Language',
  'Abstraction',
  'Delayed Recall',
  'Orientation'
]

export default function ProgressBar({ 
  currentSection, 
  totalSections, 
  completedSections 
}: ProgressBarProps) {
  const progress = (completedSections.length / totalSections) * 100

  return (
    <div className="w-full bg-white shadow-md p-4 mb-6 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Section {currentSection} of {totalSections}
        </span>
        <span className="text-sm font-medium text-primary-600">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Section indicators */}
      <div className="flex justify-between items-center">
        {sections.map((section, idx) => {
          const isCompleted = completedSections.includes(section.toLowerCase().replace(/\//g, '_').replace(/\s/g, '_'))
          const isCurrent = idx + 1 === currentSection
          
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                  ${isCompleted ? 'bg-green-600 text-white' : 
                    isCurrent ? 'bg-primary-600 text-white' : 
                    'bg-gray-300 text-gray-600'}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className="text-xs mt-1 text-gray-600 hidden md:block max-w-[60px] text-center">
                {section.split(' ')[0]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
