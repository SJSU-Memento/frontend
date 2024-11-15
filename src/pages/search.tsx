import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateRangeSelector from "@/components/m/date-range-selector";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapSelectorComponent } from "@/components/map-selector";
import FilterSection from "@/components/FilterSection";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const [filterByDate, setFilterByDate] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [filterByLocation, setFilterByLocation] = useState(false);
  const [locationFilter, setLocationFilter] = useState({
    long: -121.88286505229732,
    lat: 37.33329157948267,
    radius: 10,
  });

  const [memories, setMemories] = useState<{
    id: number;
    image_path: string;
    timestamp: string;
  }[]>([]);

  const handleSearch = async () => {
    const paramObject: {
      query: string;

      // date filter
      start?: string;
      end?: string;

      // location filter
      lat?: string;
      long?: string;
      radius?: string;
    } = { query };

    if (filterByDate && date?.from && date?.to) {
      paramObject.start = date.from.toISOString();
      paramObject.end = date.to.toISOString();
    }

    if (filterByLocation && locationFilter) {
      paramObject.lat = `${locationFilter.lat}`;
      paramObject.long = `${locationFilter.long}`;
      paramObject.radius = `${locationFilter.radius}`;
    }

    const params = new URLSearchParams(paramObject);
    const request = await fetch(`/api/memory/?${params}`);
    const data = await request.json();
    setMemories(data.memories);
  };

  return (
    <div className="w-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">Search Memories</h1>

      <div className="flex space-x-2">
        <Input
          placeholder="Search your memories..."
          className="flex-grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" onClick={handleSearch}>
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
          <FilterSection
            label="Date Range"
            filterBy={filterByDate}
            setFilterBy={setFilterByDate}
            content={<DateRangeSelector date={date} setDate={setDate} />}
          />
          <FilterSection
            className="space-y-2"
            label="Location"
            filterBy={filterByLocation}
            setFilterBy={setFilterByLocation}
            content={
              <MapSelectorComponent
                onChange={(center) => setLocationFilter(center)}
                initialPosition={locationFilter}
                initialRadius={locationFilter.radius}
              />
            }
          />
        </CollapsibleContent>
      </Collapsible>

      <div className="grid gap-4">
        {memories.map((memory) => (
          <div key={memory.id} className="border rounded-md p-4 bg-gray-100" onClick={() => {
            navigate(`/timeline/?timestamp=${memory.timestamp}`);
          }}>
            <img src={memory.image_path} className="w-full h-48 object-cover rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}