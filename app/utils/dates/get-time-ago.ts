interface TimeAgo {
  elapsed: number
  unit: string
}

/**
 *  Time differences as constants
 */
const YEAR = 60 * 60 * 24 * 365
const MONTH = 60 * 60 * 24 * 30
const WEEK = 60 * 60 * 24 * 7
const DAY = 60 * 60 * 24
const HOUR = 60 * 60
const MINUTE = 60

/**
 *  Get the elapsed time from the current date
 *
 */
function __getTimeElapsed(isoDate?: string): number {
  if (!isoDate) return 0

  const now = new Date()
  const then = new Date(isoDate)

  return (Number(now) - Number(then)) / 1000
}

/**
 *  Convert number to named time ago
 */
function __convertToTimeAgo(isoTime: string): TimeAgo {
  const timeAgoInSeconds = __getTimeElapsed(isoTime)

  if (timeAgoInSeconds > YEAR) {
    return {
      elapsed: timeAgoInSeconds / YEAR,
      unit: 'year'
    }
  }

  if (timeAgoInSeconds > MONTH) {
    return {
      elapsed: timeAgoInSeconds / MONTH,
      unit: 'month'
    }
  }

  if (timeAgoInSeconds > WEEK) {
    return {
      elapsed: timeAgoInSeconds / WEEK,
      unit: 'week'
    }
  }

  if (timeAgoInSeconds > DAY) {
    return {
      elapsed: timeAgoInSeconds / DAY,
      unit: 'day'
    }
  }

  if (timeAgoInSeconds > HOUR) {
    return {
      elapsed: timeAgoInSeconds / HOUR,
      unit: 'hour'
    }
  }

  if (timeAgoInSeconds > MINUTE) {
    return {
      elapsed: timeAgoInSeconds / MINUTE,
      unit: 'minute'
    }
  }

  return {
    elapsed: timeAgoInSeconds,
    unit: 'second'
  }
}

/**
 *  Convert ISO date time to human-readable time elapsed (e.g. '4 days ago')
 */
export function getTimeAgo(isoTime: string): string {
  const { elapsed, unit } = __convertToTimeAgo(isoTime)

  // Round down to whole numbers
  const elapsedRounded = Math.floor(elapsed)

  // Format as human-readable string
  return `${elapsedRounded} ${unit}${elapsedRounded === 1 ? '' : 's'} ago`
}