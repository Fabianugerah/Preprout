import { Check } from 'lucide-react'
import { cn } from '@/utils'

interface Step {
  label: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number // 0-indexed
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            {/* Step node */}
            <div
              className={cn(
                'step-item',
                isActive && 'step-active',
                isCompleted && 'step-completed',
                !isActive && !isCompleted && 'step-inactive',
              )}
            >
              <div className="step-circle">
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-primary-700' : isCompleted ? 'text-primary-600' : 'text-slate-400',
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-slate-400">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'step-connector mx-3',
                  isCompleted && 'step-connector-done',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}