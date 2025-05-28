import React from 'react';
import { Map, Marker } from 'pigeon-maps';
import { useClockStore, TimeZone } from '../../store/clockStore';

const WorldMap: React.FC = () => {
  const { timeZones, addTimeZone } = useClockStore();

  return (
    <div className="map-container w-full h-96">
      <Map
        defaultCenter={[0, 0]}
        defaultZoom={2}
        center={[0,0]}
        zoom={2}
        animate={true}
        onBoundsChanged={({ center: _center, zoom: _zoom }) => { /* Handle map move/zoom */ }}
        onClick={({ event: _event, latLng, pixel: _pixel }) => {
          console.log('Map clicked at coordinates:', latLng);
          // TODO: Implement timezone lookup based on latLng
          // Once timezone info is obtained, create a TimeZone object and call addTimeZone(newTimeZone);
        }}
        dprs={[1, 2]}
        mouseEvents={true}
        touchEvents={true}
        twoFingerDrag={true}
      >
        <Map
           provider={(x, y, z) => {
             const s = String.fromCharCode(97 + (x + y + z) % 3)
             return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`
           }}
        />

        {timeZones.map((tz: TimeZone) => (
          tz.coordinates && tz.coordinates.length === 2 && (
            <Marker
              key={tz.id}
              anchor={[tz.coordinates[0], tz.coordinates[1]]}
            >
              <div style={{ padding: '5px', background: 'white', border: '1px solid #ccc' }}>
                {tz.city}, {tz.country}
              </div>
            </Marker>
          )
        ))}
      </Map>
    </div>
  );
};

export default WorldMap; 