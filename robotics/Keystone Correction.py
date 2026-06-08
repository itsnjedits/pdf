import cv2
import numpy as np

# Load image
img = cv2.imread('input.jpg')

# Points in distorted image
pts1 = np.float32([
    [100, 100],
    [400, 80],
    [420, 300],
    [80, 320]
])

# Points in corrected image (rectangle)
pts2 = np.float32([
    [0, 0],
    [300, 0],
    [300, 400],
    [0, 400]
])

# Get transformation matrix
matrix = cv2.getPerspectiveTransform(pts1, pts2)

# Apply transformation
result = cv2.warpPerspective(img, matrix, (300, 400))

# Show result
cv2.imshow("Original", img)
cv2.imshow("Corrected", result)
cv2.waitKey(0)
cv2.destroyAllWindows()