import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconAnchor: [12, 41],
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


// Props for our component
interface MapSelectorProps {
  onChange: (data: { lat: number; long: number; radius: number }) => void;
  initialPosition?: { lat: number; long: number; };
  initialRadius?: number;
}

// Custom hook to handle map events
function useMapCenter() {
  const map = useMap()
  const [center, setCenter] = useState(map.getCenter())

  useMapEvents({
    moveend: () => {
      setCenter(map.getCenter())
    },
  })

  return center
}

export function MapSelectorComponent({ onChange, initialPosition = { long: 0, lat: 0 }, initialRadius = 1000 }: MapSelectorProps) {
  const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialPosition.lat, initialPosition.long))
  const [radius, setRadius] = useState(initialRadius)

  // Custom hook to get map center
  const MapEvents = () => {
    const center = useMapCenter()

    useEffect(() => {
      setPosition(center)
      onChange({ lat: center.lat, long: center.lng, radius })
    }, [center])

    return null
  }

  // Handle radius change
  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0]
    setRadius(newRadius)
    onChange({ lat: position.lat, long: position.lng, radius: newRadius })
  }

  return (
    <>
      <div className="h-[400px] mb-4">
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} />
          <Circle center={position} radius={radius} />
          <MapEvents />
        </MapContainer>
      </div>
      <div className="space-y-4">
        <Label htmlFor="radius">Radius: {radius}m</Label>
        <Slider
          id="radius"
          min={100}
          max={10000}
          step={100}
          value={[radius]}
          onValueChange={handleRadiusChange}
        />
      </div>
    </>
  )
}