import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Square points
points = [(2,2), (8,2), (8,8), (2,8), (2,2)]

# Generate full path
x_path = []
y_path = []

for i in range(len(points)-1):
    x1, y1 = points[i]
    x2, y2 = points[i+1]
    
    t_vals = np.linspace(0, 1, 50)
    
    x = x1 + t_vals * (x2 - x1)
    y = y1 + t_vals * (y2 - y1)
    
    x_path.extend(x)
    y_path.extend(y)

fig, ax = plt.subplots()
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)

point, = ax.plot([], [], 'ro')
path_line, = ax.plot(x_path, y_path, 'b--')

def update(i):
    point.set_data(x_path[i], y_path[i])
    return point,

ani = FuncAnimation(fig, update, frames=len(x_path), interval=50)
plt.grid()
plt.show()