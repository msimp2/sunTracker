// Calculations are based on the following:
// https://gml.noaa.gov/grad/solcalc/NOAA_Solar_Calculations_day.xls
// Results are about 10-15 minutes off, max. 

function getSolarElevationAngle(HH, MM) {
    // Get the selected date from the date picker
    const dateValue = document.getElementById('datePicker').value; // format: "YYYY-MM-DD"
    let yyyy, mm, dd;
    if (dateValue) {
        const dateParts = dateValue.split('-');
        yyyy = parseInt(dateParts[0], 10);
        mm = parseInt(dateParts[1], 10);
        dd = parseInt(dateParts[2], 10);
    } else {
        return null;
    }

    // Get latitude and longitude
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);

    // Julian Date Conversion
    // Excel date: days since 1899-12-30
    const excelEpoch = new Date(1899, 11, 30); // JS months are 0-based
    const selectedDate = new Date(yyyy, mm - 1, dd);
    const excel_date = Math.floor((selectedDate - excelEpoch) / (1000 * 60 * 60 * 24));

    // Get the number of minutes past midnight
    const minutes_past_midnight = HH * 60 + MM;

    // Timezone offset (example: UTC-4)
    const timezone_offset = -4;

    // Latitude
    const B3 = lat;

    // Longitude
    const B4 = lon;

    // Time zone offset
    const B5 = timezone_offset;

    // Minutes past local midnight / mins in a day
    const EE2 = (minutes_past_midnight / 1440);

    // Calculate Julian Day
    const F2 = excel_date + 2415018.5 + (minutes_past_midnight / 60) - timezone_offset / 24;

    // Julian century
    const G2 = (F2 - 2451545) / 36525;

    // Mean longitude
    const I2 = (280.46646 + G2 * (36000.76983 + G2 * 0.0003032)) % 360;

    // Mean anomaly
    const J2 = 357.52911 + G2 * (35999.05029 - 0.0001537 * G2);

    // Eccentricity
    const K2 = 0.016708634 - G2 * (0.000042037 + 0.0000001267 * G2);

    // Sun equation of center
    const L2 = Math.sin(deg2rad(J2)) * (1.914602 - G2 * (0.004817 + 0.000014 * G2))
        + Math.sin(deg2rad(2 * J2)) * (0.019993 - 0.000101 * G2)
        + Math.sin(deg2rad(3 * J2)) * 0.000289;

    // Sun true longitude
    const M2 = I2 + L2;

    // Sun true anomaly
    const N2 = J2 + L2;

    // Sun radius vector
    const O2 = (1.000001018 * (1 - K2 * K2)) / (1 + K2 * Math.cos(deg2rad(N2)));

    // Sun apparent longitude
    const P2 = M2 - 0.00569 - 0.00478 * Math.sin(deg2rad(125.04 - 1934.136 * G2));

    // Mean obliquity of ecliptic
    const Q2 = 23 + (26 + ((21.448 - G2 * (46.815 + G2 * (0.00059 - G2 * 0.001813)))) / 60) / 60;

    // Obliquity correction
    const R2 = Q2 + 0.00256 * Math.cos(deg2rad(125.04 - 1934.136 * G2));

    // Sun right ascension
    const S2 = rad2deg(Math.atan2(Math.cos(deg2rad(R2)) * Math.sin(deg2rad(P2)), Math.cos(deg2rad(P2))));

    // Sun declination
    const T2 = rad2deg(Math.asin(Math.sin(deg2rad(R2)) * Math.sin(deg2rad(P2))));

    // Variable gamma
    const U2 = Math.tan(deg2rad(R2 / 2)) * Math.tan(deg2rad(R2 / 2));

    // Equation of time
    const V2 = 4 * rad2deg(
        U2 * Math.sin(2 * deg2rad(I2))
        - 2 * K2 * Math.sin(deg2rad(J2))
        + 4 * K2 * U2 * Math.sin(deg2rad(J2)) * Math.cos(2 * deg2rad(I2))
        - 0.5 * U2 * U2 * Math.sin(4 * deg2rad(I2))
        - 1.25 * K2 * K2 * Math.sin(2 * deg2rad(J2))
    );

    // Hour angle sunrise
    const W2 = rad2deg(Math.acos(
        Math.cos(deg2rad(90.833)) / (Math.cos(deg2rad(B3)) * Math.cos(deg2rad(T2)))
        - Math.tan(deg2rad(B3)) * Math.tan(deg2rad(T2))
    ));

    // Solar noon
    const X2 = (720 - 4 * B4 - V2 + B5 * 60) / 1440;

    // Sunrise time
    const Y2 = X2 - W2 * 4 / 1440;

    // Sunset time
    const Z2 = X2 + W2 * 4 / 1440;

    // Sunlight duration
    const AA2 = 8 * W2;

    // True solar time
    const AB2 = ((EE2 * 1440 + V2 + 4 * B4 - 60 * B5 + 1440) % 1440);

    // Hour angle
    let AC2;
    if ((AB2 / 4) < 0) {
        AC2 = AB2 / 4 + 180;
    } else {
        AC2 = AB2 / 4 - 180;
    }

    // Solar zenith angle
    const AD2 = rad2deg(Math.acos(
        Math.sin(deg2rad(B3)) * Math.sin(deg2rad(T2))
        + Math.cos(deg2rad(B3)) * Math.cos(deg2rad(T2)) * Math.cos(deg2rad(AC2))
    ));

    // Solar elevation angle
    const AE2 = 90 - AD2;

    return AE2;
}

// Helper functions for degree/radian conversion
function deg2rad(deg) {
    return deg * Math.PI / 180;
}
function rad2deg(rad) {
    return rad * 180 / Math.PI;
}

// Update the morning time
function updateMorningTime() {

    // Get desired angle from input
    const desired_angle = parseFloat(document.getElementById('elevationAngle').value);
    if (isNaN(desired_angle)) {
        document.getElementById('morning').value = '';
        return;
    }

    // Start with 9:00 AM
    let HH = 9;
    let MM = 0;
    const initialOutput = getSolarElevationAngle(HH, MM);

    // If initial output is within 1 degree tolerance
    if (Math.abs(initialOutput - desired_angle) < 1) {
        document.getElementById('morning').value =
            `${HH}: ${MM}`;
        return;
    }

    // If desired angle is less than initial output, search earlier in the morning
    if (desired_angle < initialOutput) {
        for (let i = HH - 1; i >= 0; i--) {
            const newOutput = getSolarElevationAngle(i, MM);
            if (Math.abs(newOutput - desired_angle) < 1) {
                document.getElementById('morning').value =
                    `${i}: ${MM}`;
                return;
            }
            if (Math.abs(newOutput - desired_angle) > 1) {
                for (let j = 0; j <= 55; j += 5) {
                    const newOutput2 = getSolarElevationAngle(i, j);
                    if (Math.abs(newOutput2 - desired_angle) < 1) {
                        document.getElementById('morning').value =
                            `${i}: ${j}`;
                        return;
                    }
                }
            }
        }
    }

    // If desired angle is greater than initial output, search later in the morning
    if (desired_angle > initialOutput) {
        for (let i = HH; i <= HH + 6; i++) {
            const newOutput = getSolarElevationAngle(i, MM);
            if (Math.abs(newOutput - desired_angle) < 1) {
                document.getElementById('morning').value =
                    `${i}: ${MM}`;
                return;
            }
            if (Math.abs(newOutput - desired_angle) > 1) {
                for (let j = 55; j >= 0; j -= 5) {
                    const newOutput2 = getSolarElevationAngle(i, j);
                    if (Math.abs(newOutput2 - desired_angle) < 1) {
                        document.getElementById('morning').value =
                            `${i}: ${j}`;
                        return;
                    }
                }
            }
        }
    }

    // If no match found
    document.getElementById('morning').value = 'No time found within 1° tolerance';
}

// Update the morning time
function updateEveningTime() {
    // Get desired angle from input
    const desired_angle = parseFloat(document.getElementById('elevationAngle').value);
    if (isNaN(desired_angle)) {
        document.getElementById('evening').value = '';
        return;
    }

    // Start with 18:00 (6:00 PM)
    let HH = 18;
    let MM = 0;
    const initialOutput = getSolarElevationAngle(HH, MM);

    // If initial output is within 1 degree tolerance
    if (Math.abs(initialOutput - desired_angle) < 1) {
        document.getElementById('evening').value =
            `${HH}: ${MM}`;
        return;
    }

    // If desired angle is greater than initial output, search earlier in the evening
    if (desired_angle > initialOutput) {
        for (let i = HH - 1; i >= HH - 6; i--) {
            const newOutput = getSolarElevationAngle(i, MM);
            if (Math.abs(newOutput - desired_angle) < 1) {
                document.getElementById('evening').value =
                    `${i}: ${MM}`;
                return;
            }
            if (Math.abs(newOutput - desired_angle) > 1) {
                for (let j = 0; j <= 55; j += 5) {
                    const newOutput2 = getSolarElevationAngle(i, j);
                    if (Math.abs(newOutput2 - desired_angle) < 1) {
                        document.getElementById('evening').value =
                            `${i}: ${j}`;
                        return;
                    }
                }
            }
        }
    }

    // If desired angle is less than initial output, search later in the evening
    if (desired_angle < initialOutput) {
        for (let i = HH; i <= HH + 6; i++) {
            const newOutput = getSolarElevationAngle(i, MM);
            if (Math.abs(newOutput - desired_angle) < 1) {
                document.getElementById('evening').value =
                    `${i}: ${MM}`;
                return;
            }
            if (Math.abs(newOutput - desired_angle) > 1) {
                for (let j = 55; j >= 0; j -= 5) {
                    const newOutput2 = getSolarElevationAngle(i, j);
                    if (Math.abs(newOutput2 - desired_angle) < 1) {
                        document.getElementById('evening').value =
                            `${i}: ${j}`;
                        return;
                    }
                }
            }
        }
    }

    // If no match found
    document.getElementById('evening').value = 'No time found within 1° tolerance';
}

// Add event listeners to update morning time on input changes
document.getElementById('datePicker').addEventListener('input', updateMorningTime);
document.getElementById('latitude').addEventListener('input', updateMorningTime);
document.getElementById('longitude').addEventListener('input', updateMorningTime);
document.getElementById('elevationAngle').addEventListener('input', updateMorningTime);

// Initial calculation on page load
updateMorningTime();
updateEveningTime();