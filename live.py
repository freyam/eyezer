import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import psutil

diameters = []

fig = plt.figure(figsize=(6, 6), facecolor="#DEDEDE")
ax = plt.subplot()
ax.set_facecolor("#DEDEDE")


def render(_):
    diameters.append(psutil.cpu_percent())
    ax.cla()

    ax.plot(diameters)
    ax.scatter(len(diameters) - 1, diameters[-1])
    ax.text(len(diameters) - 1, diameters[-1] + 2, diameters[-1])

    ax.set_ylabel("Pupil Diameter (mm)")
    ax.set_xlabel("Time (s)")


anim = FuncAnimation(fig, render, interval=1000)
plt.show()
