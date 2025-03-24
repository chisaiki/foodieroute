// calculate the perpendicular distance from a point to a line formed by two points
function perpendicularDistance(px, py, x1, y1, x2, y2) {
    return Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) / 
           Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
}

// function to convert meters to degrees of latitude (approximate)
function metersToDegrees(meters) {
    const metersPerDegree = 111320;
    return meters / metersPerDegree;
}

// main function that reduces the set of coordinates
function reduceCoordinates(coords) {
    const thresholdDistanceDeg = metersToDegrees(REDUCTION_CONSTANT); //distance straight path

    let i = 0;
    while (i < coords.length - 2) { // get the first, second, and third points
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];
        const [x3, y3] = coords[i + 2];

        // calculate the perpendicular distance from the second point to the line formed by the first and third points
        const dist = perpendicularDistance(x2, y2, x1, y1, x3, y3);

        // if the distance is smaller than the threshold, remove the second point
        if (dist < thresholdDistanceDeg) {
            coords.splice(i + 1, 1); // remove the second point
        } else {
            // otherwise, make the second point the first point and continue
            i++;
        }
    }
    
    return coords;
}