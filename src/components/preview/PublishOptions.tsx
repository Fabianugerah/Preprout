import { Calendar } from 'lucide-react'

type LiveUntilOption =
  | 'always'
  | '1week'
  | '2weeks'
  | '3weeks'
  | '1month'
  | 'custom'

interface Props {
  publishTab: 'now' | 'schedule'
  onTabChange: (tab: 'now' | 'schedule') => void
  liveUntil: LiveUntilOption
  onLiveUntilChange: (val: LiveUntilOption) => void
  scheduleDate: string
  onScheduleDateChange: (v: string) => void
  scheduleTime: string
  onScheduleTimeChange: (v: string) => void
  endDate: string
  onEndDateChange: (v: string) => void
  endTime: string
  onEndTimeChange: (v: string) => void
}

const LIVE_OPTIONS: { value: LiveUntilOption; label: string }[] = [
  { value: 'always', label: 'Always Available' },
  { value: '1week', label: '1 Week' },
  { value: '2weeks', label: '2 Weeks' },
  { value: '3weeks', label: '3 Weeks' },
  { value: '1month', label: '1 Month' },
  { value: 'custom', label: 'Custom Duration' },
]

function RadioOption({
  value,
  label,
  selected,
  onChange,
}: {
  value: LiveUntilOption
  label: string
  selected: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={onChange}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          selected ? 'border-primary-600' : 'border-slate-300'
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  )
}

export default function PublishOptions({
  publishTab,
  onTabChange,
  liveUntil,
  onLiveUntilChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange,
  endDate,
  onEndDateChange,
  endTime,
  onEndTimeChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Tabs */}
      <div className="flex border border-slate-200 rounded-xl p-1 w-fit mb-6">
        {(['now', 'schedule'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              publishTab === tab
                ? 'bg-white text-slate-800 font-semibold shadow-sm border border-slate-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab === 'now' ? 'Publish Now' : 'Schedule Publish'}
          </button>
        ))}
      </div>

      {/* Schedule: date + time picker */}
      {publishTab === 'schedule' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Select Date and Time
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => onScheduleDateChange(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            <div className="relative">
              <select
                value={scheduleTime}
                onChange={(e) => onScheduleTimeChange(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select Time</option>
                {Array.from({ length: 24 }, (_, i) => {
                  const h = i.toString().padStart(2, '0')
                  return (
                    <option key={h} value={`${h}:00`}>
                      {`${h}:00`}
                    </option>
                  )
                })}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
                ▼
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Live Until */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Live Until</h3>
        <p className="text-sm text-slate-500 mb-5">
          Choose how long this test should remain available on the platform.
        </p>

        {/* Options grid: 2 columns */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-5">
          {LIVE_OPTIONS.map((opt) => (
            <RadioOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              selected={liveUntil === opt.value}
              onChange={() => onLiveUntilChange(opt.value)}
            />
          ))}
        </div>

        {/* Custom duration inputs */}
        {liveUntil === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                placeholder="Select End Date"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-400"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            <div className="relative">
              <select
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select End Time</option>
                {Array.from({ length: 24 }, (_, i) => {
                  const h = i.toString().padStart(2, '0')
                  return (
                    <option key={h} value={`${h}:00`}>
                      {`${h}:00`}
                    </option>
                  )
                })}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
                ▼
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}