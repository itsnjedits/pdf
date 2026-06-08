import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Link lengths
L1, L2, L3 = 2, 1.5, 1

# Time (angles)
t = np.linspace(0, 2*np.pi, 200)

# Angles (different speeds)
theta1 = t
theta2 = 2*t
theta3 = 3*t

# Positions
x1 = L1 * np.cos(theta1)
y1 = L1 * np.sin(theta1)

x2 = x1 + L2 * np.cos(theta2)
y2 = y1 + L2 * np.sin(theta2)

x3 = x2 + L3 * np.cos(theta3)
y3 = y2 + L3 * np.sin(theta3)

# Plot
fig, ax = plt.subplots()
ax.set_xlim(-5, 5)
ax.set_ylim(-5, 5)

line, = ax.plot([], [], 'o-', lw=3)

def update(i):
    xs = [0, x1[i], x2[i], x3[i]]
    ys = [0, y1[i], y2[i], y3[i]]
    
    line.set_data(xs, ys)
    return line,

ani = FuncAnimation(fig, update, frames=len(t), interval=50)
plt.show()