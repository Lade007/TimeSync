/*
 * Core terminator calculation functions extracted from Leaflet.Terminator
 * Original source: https://github.com/joergdietrich/Leaflet.Terminator/blob/master/L.Terminator.js
 */

function julian(date: Date): number {
  /* Calculate the present UTC Julian Date. Function is valid after
   * the beginning of the UNIX epoch 1970-01-01 and ignores leap
   * seconds. */
  return (date.getTime() / 86400000) + 2440587.5;
}

function GMST(julianDay: number): number {
  /* Calculate Greenwich Mean Sidereal Time according to 
   * http://aa.usno.navy.mil/faq/docs/GAST.php */
  const d = julianDay - 2451545.0;
  // Low precision equation is good enough for our purposes.
  return (18.697374558 + 24.06570982441908 * d) % 24;
}

function sunEclipticPosition(julianDay: number): { lambda: number; R: number } {
  /* Compute the position of the Sun in ecliptic coordinates at
   * julianDay.  Following
   * http://en.wikipedia.org/wiki/Position_of_the_Sun */
  // Days since start of J2000.0
  const n = julianDay - 2451545.0;
  // mean longitude of the Sun
  let L = 280.460 + 0.9856474 * n;
  L %= 360;
  // mean anomaly of the Sun
  let g = 357.528 + 0.9856003 * n;
  g %= 360;
  // ecliptic longitude of Sun
  const lambda = L + 1.915 * Math.sin(g * Math.PI / 180) +
    0.02 * Math.sin(2 * g * Math.PI / 180);
  // distance from Sun in AU
  const R = 1.00014 - 0.01671 * Math.cos(g * Math.PI / 180) -
    0.0014 * Math.cos(2 * g * Math.PI / 180);
  return { lambda: lambda, R: R };
}

function eclipticObliquity(julianDay: number): number {
  // Following the short term expression in
  // http://en.wikipedia.org/wiki/Axial_tilt#Obliquity_of_the_ecliptic_.28Earth.27s_axial_tilt.29
  const n = julianDay - 2451545.0;
  // Julian centuries since J2000.0
  const T = n / 36525;
  const epsilon = 23.43929111 -
    T * (46.836769 / 3600
      - T * (0.0001831 / 3600
        + T * (0.00200340 / 3600
          - T * (0.576e-6 / 3600
            - T * 4.34e-8 / 3600))));
  return epsilon;
}

function sunEquatorialPosition(sunEclLng: number, eclObliq: number): { alpha: number; delta: number } {
  /* Compute the Sun's equatorial position from its ecliptic
   * position. Inputs are expected in degrees. Outputs are in
   * degrees as well. */
  const alpha = Math.atan(Math.cos(eclObliq * Math.PI / 180)
    * Math.tan(sunEclLng * Math.PI / 180)) * 180 / Math.PI;
  const delta = Math.asin(Math.sin(eclObliq * Math.PI / 180)
    * Math.sin(sunEclLng * Math.PI / 180)) * 180 / Math.PI;

  const lQuadrant = Math.floor(sunEclLng / 90) * 90;
  const raQuadrant = Math.floor(alpha / 90) * 90;
  const correctedAlpha = alpha + (lQuadrant - raQuadrant);

  return { alpha: correctedAlpha, delta: delta };
}

function hourAngle(lng: number, sunPos: { alpha: number; delta: number }, gst: number): number {
  /* Compute the hour angle of the sun for a longitude on
   * Earth. Return the hour angle in degrees. */
  const lst = gst + lng / 15;
  return lst * 15 - sunPos.alpha;
}

function latitude(ha: number, sunPos: { alpha: number; delta: number }): number {
  /* For a given hour angle and sun position, compute the
   * latitude of the terminator in degrees. */
  const lat = Math.atan(-Math.cos(ha * Math.PI / 180) /
    Math.tan(sunPos.delta * Math.PI / 180)) * 180 / Math.PI;
  return lat;
}

export function getTerminatorCoordinates(time: Date): [number, number][] {
  const today = time ? new Date(time) : new Date();
  const julianDay = julian(today);
  const gst = GMST(julianDay);
  const latLng: [number, number][] = [];

  const sunEclPos = sunEclipticPosition(julianDay);
  const eclObliq = eclipticObliquity(julianDay);
  const sunEqPos = sunEquatorialPosition(sunEclPos.lambda, eclObliq);

  // Calculate points along the terminator line
  for (let i = 0; i <= 720 * 2; i++) { // Using resolution 2 as default
    const lng = -360 + i / 2; // Using resolution 2
    const ha = hourAngle(lng, sunEqPos, gst);
    const lat = latitude(ha, sunEqPos);
    latLng.push([lat, lng]);
  }

  // Add poles to close the polygon
  if (sunEqPos.delta < 0) { // Sun is south of equator
    latLng.unshift([90, -360]);
    latLng.push([90, 360]);
  } else { // Sun is north of equator
    latLng.unshift([-90, -360]);
    latLng.push([-90, 360]);
  }

  return latLng;
} 