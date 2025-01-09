interface CircularProgressProps {
    value: number
    size?: number
    label?: string
    labelValue?: string
    color?: string
  }
  
  export function CircularProgress({ 
    value, 
    size = 150,
    label,
    labelValue,
    color = "#3B82F6"
  }: CircularProgressProps) {
    const radius = size * 0.4
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference
  
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="transition-all duration-300 ease-in-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          {label ? (
            <>
              <span className="text-2xl font-bold text-white">{labelValue}</span>
              <span className="text-sm text-gray-400">{label}</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-white">{value}%</span>
          )}
        </div>
      </div>
    )
  }
  
  