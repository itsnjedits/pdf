import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Create S-curve
t_curve = np.linspace(-2*np.pi, 2*np.pi, 300)
x = t_curve
y = np.sin(t_curve)

# Rotation pivot
px, py = 0, 0

# Rotation angle over time
t = np.linspace(0, 2*np.pi, 200)

fig, ax = plt.subplots()
ax.set_xlim(-10, 10)
ax.set_ylim(-10, 10)

line, = ax.plot([], [], 'r-', lw=2)

def rotate(x, y, theta):
    
    # Shift to origin
    x_shift = x - px
    y_shift = y - py
    
    # Rotate
    x_new = x_shift * np.cos(theta) - y_shift * np.sin(theta)
    y_new = x_shift * np.sin(theta) + y_shift * np.cos(theta)
    
    # Shift back
    x_final = x_new + px
    y_final = y_new + py
    
    return x_final, y_final

def update(i):
    x_rot, y_rot = rotate(x, y, t[i])
    line.set_data(x_rot, y_rot)
    return line,

ani = FuncAnimation(fig, update, frames=len(t), interval=50)
plt.show()