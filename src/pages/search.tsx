import { useState } from "react"
import { Search, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import DateRangeSelector from "@/components/m/date-range-selector"
import { DateRange } from "react-day-picker"

import { addDays } from "date-fns"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Search Memories</h1>
      
      <div className="flex space-x-2">
        <Input placeholder="Search your memories..." className="flex-grow" />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="flex items-center justify-between w-full">
            {isOpen ? "Hide Filters" : "Show Filters"}
            {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DateRangeSelector date={date} setDate={setDate} />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="border rounded-md p-4 bg-gray-100 relative">
              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                Map Placeholder
                <MapPin className="h-8 w-8 text-primary absolute" style={{
                  left: `${(mapCenter.lng + 180) / 360 * 100}%`,
                  top: `${(90 - mapCenter.lat) / 180 * 100}%`,
                }} />
              </div>
              <div className="mt-2 space-y-2">
                <Label>Latitude</Label>
                <Slider
                  min={-90}
                  max={90}
                  step={0.1}
                  value={[mapCenter.lat]}
                  onValueChange={([lat]) => setMapCenter(prev => ({ ...prev, lat }))}
                />
                <Label>Longitude</Label>
                <Slider
                  min={-180}
                  max={180}
                  step={0.1}
                  value={[mapCenter.lng]}
                  onValueChange={([lng]) => setMapCenter(prev => ({ ...prev, lng }))}
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}