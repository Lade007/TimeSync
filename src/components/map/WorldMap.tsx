import React from 'react';
import { Map, Marker } from 'pigeon-maps';
import { useClockStore, TimeZone } from '../../store/clockStore';
import { getTerminatorCoordinates } from '../../utils/terminatorUtils';
import { useState, useEffect } from 'react';
import TerminatorOverlay from './TerminatorOverlay';
import { findClosestTimeZone } from '../../utils/timeZoneUtils';

const WorldMap: React.FC = () => {
  const { addedTimeZones, allTimezonesData, addUserTimeZone } = useClockStore();
  const { currentTime } = useClockStore(); // Get currentTime from the store

  const [terminatorCoordinates, setTerminatorCoordinates] = useState<[number, number][]>(
    getTerminatorCoordinates(new Date())
  );

  const [clickedLatLng, setClickedLatLng] = useState<[number, number] | null>(null);

  useEffect(() => {
    setTerminatorCoordinates(getTerminatorCoordinates(currentTime));
  }, [currentTime]); // Recalculate when currentTime changes

  const handleMapClick = ({ lat, lng }: { lat: number; lng: number }): void => {
    // Find the closest timezone in our data based on clicked coordinates
    const clickedCoordinates: [number, number] = [lat, lng];
    const closestTimeZone = findClosestTimeZone(clickedCoordinates, allTimezonesData);

    setClickedLatLng([lat, lng]); // Set clicked location for temporary marker

    console.log('Map clicked at coordinates:', { lat, lng });
    console.log('Closest timezone found:', closestTimeZone);

    // Add the new timezone to the store
    if (closestTimeZone) {
      addUserTimeZone({ ...closestTimeZone, id: closestTimeZone.id }); // Use existing ID
    }
  };

  return (
    <div className="map-container w-full h-96">
      <Map
        defaultCenter={[0, 0]}
        defaultZoom={2}
        center={[0,0]}
        zoom={2}
        animate={true}
        onBoundsChanged={() => { /* Handle map move/zoom */ }}
        onClick={({ latLng }) => {
          handleMapClick(latLng);
        }}
        dprs={[1, 2]}
        mouseEvents={true}
        touchEvents={true}
        twoFingerDrag={true}
      >
        {/* Base Map Tiles */}
        <Map
           provider={(x, y, z) => {
             const s = String.fromCharCode(97 + (x + y + z) % 3)
             return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`
           }}
        />

        {/* Day/Night Terminator Line */}
        <TerminatorOverlay terminatorCoordinates={terminatorCoordinates} />

        {/* Temporary marker for clicked location */}
        {clickedLatLng && (
          <Marker
            anchor={clickedLatLng}
            color="red"
            width={40}
          />
        )}

        {/* Markers for timezones in the added list */}
        {allTimezonesData.map((tz: TimeZone) => (
          tz.coordinates && tz.coordinates.length === 2 &&
          !addedTimeZones.some(addedTz => addedTz.timezone === tz.timezone) && (
            <Marker
              key={tz.id + '-all'} // Use a different key to avoid conflicts
              anchor={[tz.coordinates[0], tz.coordinates[1]]}
              color="blue" // Use a different color for all timezones
              width={15} // Use a smaller size
            >
               {/* Optional: Add a small popup with timezone name on hover/click */}
            </Marker>
          )
        ))}

        {/* Markers for added timezones */}
        {addedTimeZones.map((tz: TimeZone) => (
          tz.coordinates && tz.coordinates.length === 2 && (
            <Marker
              key={tz.id}
              anchor={[tz.coordinates[0], tz.coordinates[1]]}
            >
               {/* Optional: Add a small popup with timezone name on hover/click */}
            </Marker>
          )
        ))}
      </Map>
    </div>
  );
};

export default WorldMap; 