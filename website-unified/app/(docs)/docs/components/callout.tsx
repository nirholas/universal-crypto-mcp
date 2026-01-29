import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: React.ReactNode
}

const styles = {
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-300',
    Icon: Info,
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-900 dark:text-yellow-300',
    Icon: AlertTriangle,
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-900 dark:text-red-300',
    Icon: AlertCircle,
  },
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-900 dark:text-green-300',
    Icon: CheckCircle,
  },
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const style = styles[type]
  const Icon = style.Icon

  return (
    <div className={`my-6 p-4 border-l-4 rounded-r-lg ${style.container}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.icon}`} />
        <div className="flex-1">
          {title && (
            <h5 className={`font-semibold mb-1 ${style.title}`}>
              {title}
            </h5>
          )}
          <div className="text-sm prose-sm dark:prose-invert">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
