import matplotlib.pyplot as plt

def bresenham(x1, y1, x2, y2):
    points = []

    dx = x2 - x1
    dy = y2 - y1

    p = 2*dy - dx

    x, y = x1, y1

    while x <= x2:
        points.append((x, y))

        if p < 0:
            p = p + 2*dy
        else:
            y = y + 1
            p = p + 2*dy - 2*dx

        x = x + 1

    return points


# Example
pts = bresenham(2, 2, 10, 6)

# Plot
x_vals = [p[0] for p in pts]
y_vals = [p[1] for p in pts]

plt.scatter(x_vals, y_vals)
plt.plot(x_vals, y_vals)
plt.grid()
plt.show()