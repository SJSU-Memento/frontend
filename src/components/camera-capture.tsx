import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Camera, SwitchCamera } from 'lucide-react'

export function CameraCaptureComponent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streamDimensions, setStreamDimensions] = useState<
    { width: number, height: number } | null
  >(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0)
  const { toast } = useToast()

  // Fetch available cameras
  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setCameras(videoDevices)
    } catch (err) {
      console.error("Error getting camera devices", err)
      toast({
        title: "Device Error",
        description: "Unable to get camera devices.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    getCameras()
  }, [getCameras, isStreaming])

  const [watchLocation, setWatchLocation] = useState(false)
  const [geoLocation, setGeoLocation] = useState<GeolocationPosition | null>(null)

  useEffect(() => {
    if (watchLocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setGeoLocation(position)
        },
        (err) => {
          setWatchLocation(false)
          setGeoLocation(null)
          console.error("Error watching location", err)
          toast({
            title: "Location Error",
            description: "Unable to get location. Please check your permissions.",
            variant: "destructive",
          })
        }
      )

      console.log("Watching location", watchId)

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [toast, watchLocation])



  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }

      const constraints = {
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
          deviceId: cameras[currentCameraIndex]?.deviceId
            ? { exact: cameras[currentCameraIndex].deviceId }
            : undefined
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setWatchLocation(true)

      if (!geoLocation) {
        navigator.geolocation.getCurrentPosition(function () { }, function () { }, {});

        const position: GeolocationPosition = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          })
        })

        setGeoLocation(position)
      }

      if (videoRef.current) {
        const video = videoRef.current
        videoRef.current.onloadedmetadata = () => {
          setStreamDimensions({ width: video.videoWidth, height: video.videoHeight })
        };
        videoRef.current.srcObject = stream

        setIsStreaming(true)
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
      toast({
        title: "Camera Error",
        description: "Unable to access the camera. Please check your permissions.",
        variant: "destructive",
      })
    }
  }, [cameras, currentCameraIndex, toast, geoLocation])

  const switchCamera = useCallback(async () => {
    if (cameras.length < 2) {
      toast({
        title: "Camera Switch",
        description: "No other cameras available.",
        variant: "destructive",
      })
      return
    }

    const nextIndex = (currentCameraIndex + 1) % cameras.length
    setCurrentCameraIndex(nextIndex)

    // Restart the camera with new device
    if (isStreaming) {
      await startCamera()
    }
  }, [cameras, currentCameraIndex, isStreaming, startCamera, toast])

  const captureImage = useCallback(async () => {
    console.log("Capturing image")
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')

        // Get current local time
        const currentTime = new Date().toISOString()
        const locationData = geoLocation ? `${geoLocation.coords.latitude},${geoLocation.coords.longitude}` : ''

        const payload = {
          image: imageDataUrl,
          timestamp: currentTime,
          location: locationData
        }



        console.log("Uploading image", payload)

        // Upload to server
        try {
          const response = await fetch('/api/upload/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
          if (response.ok) {
            toast({
              title: "Success",
              description: "Image uploaded successfully!",
            })
          } else {
            throw new Error('Upload failed')
          }
        } catch (err) {
          console.error("Error uploading image", err)
          toast({
            title: "Upload Error",
            description: "Failed to upload the image. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        console.error("Canvas context not available")
        toast({
          title: "Error",
          description: "Canvas context not available. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      console.error("Camera or canvas not available")
      toast({
        title: "Error",
        description: "Camera or canvas not available. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast, geoLocation, videoRef, canvasRef])

  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCapturing) {
      intervalRef.current = setInterval(captureImage, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCapturing, captureImage, geoLocation]);

  const handleStartStopCapture = () => {
    setIsCapturing(!isCapturing);
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Camera Capture
          {cameras.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              Camera {currentCameraIndex + 1} of {cameras.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-muted" style={streamDimensions ? {
          aspectRatio: `${streamDimensions.width}/${streamDimensions.height}`,
        } : undefined}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="object-cover"
          />
          {streamDimensions && <canvas ref={canvasRef} className="hidden" width={streamDimensions.width} height={streamDimensions.height} />}
        </div>
        {geoLocation ? `${geoLocation.coords.latitude},${geoLocation.coords.longitude}` : 'No location'}
      </CardContent>
      <CardFooter className="flex justify-between flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <Button onClick={startCamera} disabled={isStreaming}>
            {isStreaming ? "Camera Active" : "Start Camera"}
          </Button>
          <Button
            onClick={switchCamera}
            disabled={!isStreaming || cameras.length < 2}
            variant="outline"
          >
            <SwitchCamera className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={captureImage} disabled={!isStreaming}>
          <Camera className="mr-2 h-4 w-4" /> Capture and Upload
        </Button>
        <Button onClick={handleStartStopCapture}>
          {isCapturing ? 'Stop Capture' : 'Start Capture'}
        </Button>
      </CardFooter>
    </Card>
  )
}