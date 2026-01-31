import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut,
  Maximize,
  Download
} from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { PremiumFeatureGate } from './PremiumFeatureGate';

interface Vehicle3DPreviewProps {
  vehicle: Vehicle;
}

export function Vehicle3DPreview({ vehicle }: Vehicle3DPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  import { useState } from 'react';

interface Vehicle3DPreviewProps {
  vehicle: Vehicle;
}

export function Vehicle3DPreview({ vehicle }: Vehicle3DPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Placeholder for Three.js integration
  useEffect(() => {
    if (!canvasRef.current) return;

    // In production, this would initialize Three.js scene
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw placeholder
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#3b82f6';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('3D Preview', canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillText('(Three.js Ready)', canvas.width / 2, canvas.height / 2 + 20);
    }
  }, []);

  return (
    <PremiumFeatureGate featureId="advanced_analytics">
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">3D Vehicle Preview</h3>
            <p className="text-gray-400 text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Premium
          </Badge>
        </div>

        <div className="relative bg-gray-950 rounded-lg overflow-hidden mb-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-auto"
            style={{ maxHeight: '600px' }}
          />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setRotation({ x: 0, y: 0 })}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <p>Interactive 3D model with Three.js</p>
            <p className="text-xs mt-1">Drag to rotate • Scroll to zoom</p>
          </div>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export Model
          </Button>
        </div>
      </Card>
    </PremiumFeatureGate>
  );
}
