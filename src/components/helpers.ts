import { DateTime } from "luxon"

const getTime = () => DateTime.now().minus({ hours: 4 })

export const recentFilters = [
    { label: "5 minutes ago", value: "5m", producer: () => getTime().minus({ minutes: 5 }) },
    { label: "15 minutes ago", value: "15m", producer: () => getTime().minus({ minutes: 15 }) },
    { label: "30 minutes ago", value: "30m", producer: () => getTime().minus({ minutes: 30 }) },
    { label: "1 hour ago", value: "1h", producer: () => getTime().minus({ hours: 1 }) },
    { label: "1 day ago", value: "1d", producer: () => getTime().minus({ days: 1 }) },
    { label: "1 week ago", value: "1w", producer: () => getTime().minus({ weeks: 1 }) },
  ]
  
  export const getProducer = (value: string) => {
    return recentFilters.find((filter) => filter.value === value)?.producer
  }