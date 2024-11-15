import { useCallback, useEffect, useState, useMemo, useRef } from "react"

import { MediaCarouselComponent, MediaItem } from "@/components/media-carousel"
import { useSearchParams } from "react-router-dom"

const fetchTimeline = async (timestamp: string, direction: 'before' | 'after' | 'both') => {
  const request = await fetch(`/api/memory/timeline?timestamp=${timestamp}&direction=${direction}`)
  const data = await request.json()

  return data.memories
}

export default function TimelinePage() {
  const [params] = useSearchParams()
  const [timestamp, setTimestamp] = useState(params.get('timestamp'))

  const [items, setItems] = useState<MediaItem[]>([])

  const currentIndex = useMemo(() => items.findIndex((item) => item.timestamp === timestamp), [items, timestamp])

  const [reachedBeginningOfTimeline, setReachedBeginningOfTimeline] = useState(false)
  const [reachedEndOfTimeline, setReachedEndOfTimeline] = useState(false)

  useEffect(() => {
    if (!timestamp) {
      return
    }

    if (currentIndex === -1) {
      fetchTimeline(timestamp, 'both').then(setItems)
    } else if (!reachedBeginningOfTimeline && currentIndex < 5) {
      fetchTimeline(items[0].timestamp, 'before').then((newItems) => {
        if (newItems.length === 0) {
          setReachedBeginningOfTimeline(true)
          return
        }

        setItems((items) => [...newItems, ...items])
      })
    } else if (!reachedEndOfTimeline && currentIndex > items.length - 5) {
      fetchTimeline(items[items.length - 1].timestamp, 'after').then((newItems) => {
        if (newItems.length === 0) {
          setReachedEndOfTimeline(true)
          return
        }
        setItems((items) => [...items, ...newItems])
      })
    }
  }, [currentIndex, timestamp, items, reachedBeginningOfTimeline, reachedEndOfTimeline])

  if (!timestamp) {
    return <p>Timestamp is invalid.</p>
  }

  if (items.length === 0) {
    return <p>Loading...</p>
  }

  return (
    <div className="p-4">
      <MediaCarouselComponent items={items} value={currentIndex} onChange={setTimestamp} />
    </div>
  )
}