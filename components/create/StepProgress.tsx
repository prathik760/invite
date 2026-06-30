const STEPS = [
  { n: 1, label: 'Style' },
  { n: 2, label: 'Names' },
  { n: 3, label: 'Details' },
  { n: 4, label: 'Extras' },
  { n: 5, label: 'Publish' },
]

export default function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0 ml-2">
      {STEPS.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-all"
            style={{ background: step.n === currentStep ? 'rgba(184,121,36,0.09)' : 'transparent' }}
          >
            <span
              className="w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shrink-0"
              style={{
                fontSize: '8px',
                background: step.n < currentStep ? '#2F766D' : step.n === currentStep ? '#B87924' : 'rgba(44,32,28,0.08)',
                color: step.n < currentStep || step.n === currentStep ? '#fff' : 'rgba(44,32,28,0.22)',
              }}
            >
              {step.n < currentStep ? '✓' : step.n}
            </span>
            <span
              className="text-[11px] font-semibold hidden md:inline"
              style={{
                color: step.n === currentStep ? '#B87924' : step.n < currentStep ? '#2F766D' : 'rgba(44,32,28,0.28)',
              }}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-4 h-px mx-0.5" style={{ background: 'rgba(44,32,28,0.12)' }} />
          )}
        </div>
      ))}
    </div>
  )
}
