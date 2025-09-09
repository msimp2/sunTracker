function getInputs() {
    // Get the selected date from the date picker
    const dateValue = document.getElementById('datePicker').value; // format: "YYYY-MM-DD"
    let yyyy, mm, dd;
    if (dateValue) {
        const dateParts = dateValue.split('-');
        yyyy = parseInt(dateParts[0], 10);
        mm = parseInt(dateParts[1], 10);
        dd = parseInt(dateParts[2], 10);
    } else {
        yyyy = mm = dd = null;
    }

    // Get the desired elevation angle
    const desiredAngle = parseFloat(document.getElementById('elevationAngle').value);

    // Get latitude and longitude
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);

    return { yyyy, mm, dd, desiredAngle, lat, lon };
}

// Example usage: call getInputs() whenever you need the latest values
const { yyyy, mm, dd, desiredAngle, lat, lon } = getInputs();

function updateMorningTime() {
    const elevationAngle = parseFloat(document.getElementById('elevationAngle').value);
    if (!isNaN(elevationAngle)) {
        document.getElementById('morning').value = elevationAngle + 10;
    } else {
        document.getElementById('morning').value = '';
    }
}

// Add event listeners to update morning time on input changes
document.getElementById('datePicker').addEventListener('input', updateMorningTime);
document.getElementById('latitude').addEventListener('input', updateMorningTime);
document.getElementById('longitude').addEventListener('input', updateMorningTime);
document.getElementById('elevationAngle').addEventListener('input', updateMorningTime);

// Initial calculation on page load
updateMorningTime();