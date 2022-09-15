import numpy as np
import cv2
import matplotlib.pyplot as plt
import urllib.request
import json
from config import *

eye_cascade = cv2.CascadeClassifier("haarcascae_eye.xml")
cap = cv2.VideoCapture(0)

diameters = []
status = 0

PREV_TIME = None

while True:
    print("\033c", end="")
    print("Diameters:", diameters)

    with open("status.txt", "r") as f:
        status = int(f.read())

    while status == 0:
        ts = urllib.request.urlopen(
            f"http://api.thingspeak.com/channels/{CHANNEL_ID}/feeds/last.json?api_key={READ_API_KEY}"
        )

        data = json.loads(ts.read())
        status = -1
        if data["field7"] is not None:
            status = int(data["field7"])
            with open("xinfo.txt", "w") as f:
                f.write(json.dumps(data))                
        else:
            status = 0

        ts.close()

    if len(diameters) >= 1 and status == 1:
        diameters = []
        status = 2

        with open("status.txt", "w") as f:
            f.write(str(status))

    _, img = cap.read()
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    eyes = eye_cascade.detectMultiScale(gray_img, 1.1, 7)

    if len(eyes) > 0:
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(img, (ex, ey), (ex + ew, ey + eh), (0, 0, 0), 2)
            blur = cv2.GaussianBlur(
                gray_img[ey: ey + eh, ex: ex + ew], (5, 5), 10)
            erosion = cv2.erode(blur, np.ones((5, 5), np.uint8), iterations=4)

            circles = cv2.HoughCircles(
                erosion,
                cv2.HOUGH_GRADIENT,
                dp=4,
                minDist=200,
                param1=20,
                param2=150,
                minRadius=0,
                maxRadius=50,
            )

            if circles is None:
                continue

            circles = np.uint16(np.around(circles))

            for (x, y, r) in circles[0, :]:
                cv2.circle(img, (x + ex, y + ey), r, (0, 0, 0), 2)

                d = ((r * 2) / 25.4).round(2)
                diameters.append(d)

                if len(diameters) >= 3 and len(set(diameters[-3:])) <= 2:
                    cv2.imwrite("eye.png", img)

                cv2.putText(
                    img,
                    str(round(d, 2)) + "mm",
                    (x + ex, y + ey),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 0, 0),
                    2,
                )

    cv2.imshow("img", img)

    if status == 3:
        DIAMETER_STR = ",".join([str(d) for d in diameters])

        conn = urllib.request.urlopen(
            f"http://api.thingspeak.com/update?api_key={WRITE_API_KEY}&field6={DIAMETER_STR}"
        )

        conn.close()

        status = 0
        with open("status.txt", "w") as f:
            f.write(str(status))

    if cv2.waitKey(1) & 0xFF in [ord("q"), 27]:
        break

cap.release()
cv2.destroyAllWindows()

THINGSPEAK_ST = input("Do you want to send the data to ThingSpeak? (y/n): ")

if THINGSPEAK_ST == "y":
    if len(diameters) == 0:
        print("No data")
        exit()

    DIAMETER_STR = ",".join([str(d) for d in diameters])

    conn = urllib.request.urlopen(
        f"http://api.thingspeak.com/update?api_key={WRITE_API_KEY}&field6={DIAMETER_STR}"
    )

    conn.close()

GRAPH_ST = input("Do you want to see a graph? (y/n): ")

if GRAPH_ST == "y":
    diameters = np.array(diameters)
    diameters = np.convolve(
        diameters[np.abs(diameters - np.mean(diameters))
                  < 2 * np.std(diameters)],
        np.ones(5) / 5,
        mode="valid",
    )

    plt.ylabel("Pupil Diameter (mm)")
    plt.plot(diameters)
    plt.show()
