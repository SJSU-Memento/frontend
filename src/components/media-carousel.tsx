import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronLeft, ChevronRight, Play, Pause, ChevronDown, ChevronUp } from 'lucide-react'
import { DateTime } from 'luxon'


export interface MediaItem {
  image_path: string;
  audio_path: string;
  transcript: string;
  timestamp: string;
}

export function MediaCarouselComponent({ items = [], value, onChange }: {
  items: MediaItem[], value: number, onChange: (value: string) => void,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)



  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (valueRef.current >= items.length - 1) {
          setIsPlaying(false);
          return;
        }
        onChange(items[valueRef.current + 1].timestamp);
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, items, onChange]);

  const handlePrevious = () => {
    onChange(items[(value - 1 + items.length) % items.length].timestamp)
  }

  const handleNext = () => {
    onChange(items[(value + 1) % items.length].timestamp)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const currentItem = items[value]

  console.log('currentItem', value, currentItem)

  if (!currentItem) {
    return (
      <p>The current item is undefined</p>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full max-w-md aspect-video bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={currentItem.image_path}
          alt={`Image ${value + 1}`}
          className="h-full w-max-full m-auto"
        />
      </div>
      <p>{DateTime.fromISO(currentItem.timestamp).toRelative()}</p>

      <div className="flex justify-center space-x-4">
        <Button onClick={handlePrevious} variant="outline" size="icon" disabled={
          value <= 0
        }>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button onClick={togglePlayPause} variant="outline" size="icon" disabled={
          value >= items.length - 1
        }>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button onClick={handleNext} variant="outline" size="icon" disabled={
          value >= items.length - 1
        }>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <audio ref={audioRef} controls className="w-full max-w-md">
        <source src={currentItem.audio_path} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full max-w-md"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between">
            Transcript
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="rounded-md bg-muted p-3">
            <p>{currentItem.transcript}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}