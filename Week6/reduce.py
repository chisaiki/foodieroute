import matplotlib.pyplot as plt
import numpy as np

# coords
points = [
    (40.76507, -73.96520000000001), (40.763870000000004, -73.96236), (40.76375, -73.96206000000001),
    (40.763180000000006, -73.96248), (40.762660000000004, -73.96285), (40.76205, -73.9633),
    (40.761250000000004, -73.96389), (40.761030000000005, -73.96406), (40.76098, -73.9641),
    (40.760310000000004, -73.96458000000001), (40.75864000000001, -73.96579000000001), (40.75601, -73.96770000000001),
    (40.75175, -73.97081), (40.749840000000006, -73.9722), (40.748520000000006, -73.97316000000001),
    (40.746430000000004, -73.97469000000001), (40.7462, -73.97487000000001), (40.74579000000001, -73.97516),
    (40.74443, -73.97614), (40.74351, -73.97683), (40.742940000000004, -73.97723), (40.74289, -73.97727),
    (40.743320000000004, -73.97831000000001), (40.74383, -73.97951), (40.74421, -73.98041),
    (40.744730000000004, -73.98163000000001), (40.744800000000005, -73.98182), (40.745650000000005, -73.98383000000001),
    (40.74823000000001, -73.98996000000001), (40.74888000000001, -73.99152000000001),
    (40.749590000000005, -73.99317), (40.74991, -73.99389000000001)
]

# calc distance from point to line
def perpendicular_distance(px, py, x1, y1, x2, y2):
    return abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) / np.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)

# threshold in meters
threshold_distance = 50

# meters to degrees of latitude
threshold_distance_deg = threshold_distance / 111320  

# for plot later
original_points = points.copy()


i = 0
while i < len(points) - 2: 
    # select 3 adjacent points
    x1, y1 = points[i]
    x2, y2 = points[i + 1]
    x3, y3 = points[i + 2]

    dist = perpendicular_distance(x2, y2, x1, y1, x3, y3)

    if dist < threshold_distance_deg:
        points.pop(i + 1)
    else:
        i += 1

fig, ax = plt.subplots(1, 2, figsize=(14, 7))  

# before
ax[0].plot([point[1] for point in original_points], [point[0] for point in original_points], color='blue', linewidth=2)
ax[0].scatter([point[1] for point in original_points], [point[0] for point in original_points], color='red')
ax[0].set_xlabel('Longitude')
ax[0].set_ylabel('Latitude')
ax[0].set_title('Before: All Points Connected by Line')

# after
filtered_points = np.array(points)
ax[1].plot(filtered_points[:, 1], filtered_points[:, 0], color='blue', linewidth=2)
ax[1].scatter(filtered_points[:, 1], filtered_points[:, 0], color='red')
ax[1].set_xlabel('Longitude')
ax[1].set_ylabel('Latitude')
ax[1].set_title('After: Filtered Path')

plt.tight_layout()
plt.show()
