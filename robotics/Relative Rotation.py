import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Base (fixed square)
base = np.array([
    [0, 0], [2, 0], [2, 2], [0, 2], [0, 0]
])

# Roof (triangle - will rotate)
roof = np.array([
    [0, 2], [1, 3], [2, 2]
])

# Pivot point (roof base center)
px, py = 1, 2

t = np.linspace(0, 2*np.pi, 200)

fig, ax = plt.subplots()
ax.set_xlim(-3, 5)
ax.set_ylim(-3, 5)

line_base, = ax.plot([], [], 'b-', lw=2)
line_roof, = ax.plot([], [], 'r-', lw=2)

def rotate(points, theta):
    rotated = []
    for x, y in points:
        
        # Shift to pivot
        x_shift = x - px
        y_shift = y - py
        
        # Rotate
        x_new = x_shift * np.cos(theta) - y_shift * np.sin(theta)
        y_new = x_shift * np.sin(theta) + y_shift * np.cos(theta)
        
        # Shift back
        x_final = x_new + px
        y_final = y_new + py
        
        rotated.append([x_final, y_final])
    
    return np.array(rotated)

def update(i):
    # Base stays same
    line_base.set_data(base[:,0], base[:,1])
    
    # Roof rotates
    new_roof = rotate(roof, t[i])
    line_roof.set_data(
        list(new_roof[:,0]) + [new_roof[0,0]],
        list(new_roof[:,1]) + [new_roof[0,1]]
    )
    
    return line_base, line_roof

ani = FuncAnimation(fig, update, frames=len(t), interval=50)
plt.show()