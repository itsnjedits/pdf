import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Hut shape (simple triangle + square)
hut = np.array([
    [0, 0], [2, 0], [2, 2], [0, 2], [0, 0],  # square
    [0, 2], [1, 3], [2, 2]                   # roof
])

# Fixed rotation point (pivot)
px, py = 1, 1

# Angle values
t = np.linspace(0, 2*np.pi, 200)

fig, ax = plt.subplots()
ax.set_xlim(-3, 5)
ax.set_ylim(-3, 5)

line, = ax.plot([], [], 'b-', lw=2)

def rotate(points, theta):
    rotated = []
    for x, y in points:
        
        # Step 1: shift to origin
        x_shift = x - px
        y_shift = y - py
        
        # Step 2: rotate
        x_new = x_shift * np.cos(theta) - y_shift * np.sin(theta)
        y_new = x_shift * np.sin(theta) + y_shift * np.cos(theta)
        
        # Step 3: shift back
        x_final = x_new + px
        y_final = y_new + py
        
        rotated.append([x_final, y_final])
    
    return np.array(rotated)

def update(i):
    new_hut = rotate(hut, t[i])
    line.set_data(new_hut[:,0], new_hut[:,1])
    return line,

ani = FuncAnimation(fig, update, frames=len(t), interval=50)
plt.show()