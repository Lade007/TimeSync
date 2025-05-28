import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useClockStore, formatTimeForTimeZone } from '../../store/clockStore';

// Simple world map geojson
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const WorldMap: React.FC = () => {
  const { timeZones, currentTime } = useClockStore();
  
  return (
    <div className="section">
      <h2 className="text-xl font-semibold mb-4">World Map View</h2>
      <div className="clock-card overflow-hidden">
        <ComposableMap 
          projection="geoMercator" 
          projectionConfig={{ scale: 120 }}
          style={{ width: "100%", height: "400px" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#D6D6DA"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { fill: "#D6D6DA", outline: "none" },
                    hover: { fill: "#F5F5F5", outline: "none" },
                    pressed: { fill: "#E0E0E0", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          
          {timeZones.map(({ id, city, coordinates, timezone }) => (
            <Marker key={id} coordinates={coordinates}>
              <circle r={5} fill="#F00" />
              <text
                textAnchor="middle"
                y={-12}
                style={{ 
                  fontFamily: "system-ui", 
                  fontSize: "10px",
                  fill: "#333",
                  fontWeight: "bold",
                  textShadow: "1px 1px 1px white"
                }}
              >
                {city}
              </text>
              <text
                textAnchor="middle"
                y={0}
                style={{ 
                  fontFamily: "system-ui", 
                  fontSize: "8px",
                  fill: "#333",
                  textShadow: "1px 1px 1px white"
                }}
              >
                {formatTimeForTimeZone(currentTime, timezone, false)}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Timezone locations are approximate. Map is for illustration purposes only.
      </p>
    </div>
  );
};

export default WorldMap;