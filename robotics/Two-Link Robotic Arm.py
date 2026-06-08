import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Link lengths
L1 = 2
L2 = 1.5

# Time variable (angle change karega)
t = np.linspace(0, 2*np.pi, 200)

# First link position
x1 = L1 * np.cos(t)
y1 = L1 * np.sin(t)

# Second link position
x2 = x1 + L2 * np.cos(2*t)
y2 = y1 + L2 * np.sin(2*t)

# Plot setup
fig, ax = plt.subplots()
ax.set_xlim(-4, 4)
ax.set_ylim(-4, 4)

line, = ax.plot([], [], 'o-', lw=3)

def update(i):
    # Points: origin → joint1 → joint2
    xs = [0, x1[i], x2[i]]
    ys = [0, y1[i], y2[i]]
    
    line.set_data(xs, ys)
    return line,

ani = FuncAnimation(fig, update, frames=len(t), interval=50)
plt.show()