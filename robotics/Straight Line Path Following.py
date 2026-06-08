import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Start and end points
x1, y1 = 2, 2
x2, y2 = 10, 8

# Parameter t
t_vals = np.linspace(0, 1, 100)

# Interpolated positions
x = x1 + t_vals * (x2 - x1)
y = y1 + t_vals * (y2 - y1)

fig, ax = plt.subplots()
ax.set_xlim(0, 12)
ax.set_ylim(0, 12)

point, = ax.plot([], [], 'ro')
line, = ax.plot(x, y, 'b--')  # path

def update(i):
    point.set_data(x[i], y[i])
    return point,

ani = FuncAnimation(fig, update, frames=len(t_vals), interval=50)
plt.grid()
plt.show()