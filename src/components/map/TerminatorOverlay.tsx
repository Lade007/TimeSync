import React from 'react';

interface TerminatorOverlayProps {
  terminatorCoordinates: [number, number][];
  mapState: { center: [number, number]; zoom: number; bounds?: { ne: [number, number]; sw: [number, number] }; width: number; height: number };
  latLngToPixel: (latLng: [number, number], center: [number, number], zoom: number) => [number, number];
}

const TerminatorOverlay = ({
  terminatorCoordinates,
  mapState,
  latLngToPixel,
}: TerminatorOverlayProps) => {
  // Use mapState.center and mapState.zoom if needed for the projection helper
  const pixelPoints = terminatorCoordinates.map(coord =>
    latLngToPixel(coord, mapState.center, mapState.zoom)
  );

  // Format pixel coordinates for the SVG polygon points attribute
  const pointsString = pixelPoints.map(point => `${point[0]},${point[1]}`).join(' ');

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <polygon
        points={pointsString}
        style={{ fill: 'rgba(0, 0, 0, 0.3)', stroke: 'none' }}
      />
    </svg>
  );
};

export default TerminatorOverlay; 