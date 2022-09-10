import numpy as np
import cv2
import urllib.request
import json

WRITE_API_KEY = "P3RYOEFOD90DB9FY"
READ_API_KEY = "5Y175EF80D2KQ470"
CHANNEL_ID = "1848369"

eye_cascade = cv2.CascadeClassifier("haarcascae_eye.xml")

cap = cv2.VideoCapture(0)

diameters = []
blink = False
bcount = -1
kernel = np.ones((5, 5), np.uint8)
font = cv2.FONT_HERSHEY_DUPLEX
status = 0
global a

while 1:
    print("\\033c", end="")
    print("Diameters:", diameters)

    # read status from status.txt file
    with open("status.txt", "r") as f:
        status = int(f.read())

    while status == 0:
        ts = urllib.request.urlopen(
            f"http://api.thingspeak.com/channels/{CHANNEL_ID}/feeds/last.json?api_key={READ_API_KEY}"
        )
        data = json.loads(ts.read())
        ts.close()
        status = int(data["field7"])

    if len(diameters) >= 1 and status==1:
        diameters = []
        status = 2

        with open("status.txt", "w") as f:
            f.write(str(status))

        # ts = urllib.request.urlopen(
        #     f"http://api.thingspeak.com/update?api_key={WRITE_API_KEY}&field7={status}"
        # )

    ret, img = cap.read()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    eyes = eye_cascade.detectMultiScale(gray, 1.1, 7)
    if len(eyes) > 0:
        a = "Eye's Open"

        if blink == True:
            blink = False

        cv2.putText(img, a, (10, 30), font, 1, (0, 0, 255), 2, cv2.LINE_AA)

        for (ex, ey, ew, eh) in eyes:
            # cv2.rectangle(img,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
            roi_gray2 = gray[ey: ey + eh, ex: ex + ew]
            roi_color2 = img[ey: ey + eh, ex: ex + ew]
            blur = cv2.GaussianBlur(roi_gray2, (5, 5), 10)
            erosion = cv2.erode(blur, kernel, iterations=2)
            ret3, th3 = cv2.threshold(
                erosion, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )
            circles = cv2.HoughCircles(
                erosion,
                cv2.HOUGH_GRADIENT,
                4,
                200,
                param1=20,
                param2=150,
                minRadius=0,
                maxRadius=0,
            )
            try:
                for i in circles[0, :]:
                    if int(i[2]) > 0 and int(i[2]) < 55:
                        cv2.circle(
                            roi_color2,
                            (int(i[0]), int(i[1])),
                            int(i[2]),
                            (0, 0, 255),
                            1,
                        )
                        cv2.putText(
                            img,
                            "Pupil Position:",
                            (450, 30),
                            font,
                            1,
                            (0, 0, 255),
                            2,
                            cv2.LINE_AA,
                        )
                        cv2.putText(
                            img,
                            "X " + str(int(i[0])) + " Y " + str(int(i[1])),
                            (430, 60),
                            font,
                            1,
                            (0, 0, 255),
                            2,
                            cv2.LINE_AA,
                        )
                        d = int(i[2]) * 2.0
                        dmm = 1 / (25.4 / d)
                        diameters.append(dmm)
                        cv2.putText(
                            img,
                            str("{0:.2f}".format(dmm)) + "mm",
                            (10, 60),
                            font,
                            1,
                            (0, 0, 255),
                            2,
                            cv2.LINE_AA,
                        )
                        cv2.circle(
                            roi_color2, (int(i[0]), int(
                                i[1])), 2, (0, 0, 255), 3
                        )
                        # cv2.imshow('erosion',erosion)
            except Exception as e:
                pass

    else:
        if blink == False:
            blink = True
            if blink == True:
                cv2.putText(
                    img, "Blink", (10, 90), font, 1, (0,
                                                      0, 255), 2, cv2.LINE_AA
                )
        a = "Eye's Close"
        cv2.putText(img, a, (10, 30), font, 1, (0, 0, 255), 2, cv2.LINE_AA)

    cv2.imshow("img", img)
    if status==3:
        diameters_str = ",".join([str(d) for d in diameters])

        conn = urllib.request.urlopen(
            f"http://api.thingspeak.com/update?api_key={WRITE_API_KEY}&field6={diameters_str}"
        )

        conn.close()

        print("Diameters: " + diameters_str)
        # write status to status.txt file
        status = 0
        with open("status.txt", "w") as f:
            f.write(str(status))
    # k = cv2.waitKey(30) & 0xFF
    # if k == 27:
    #     break

# cap.release()
# cv2.destroyAllWindows()


# if len(diameters) == 0:
#     print("No data")
#     sys.exit(0)

# plt.plot(diameters)
# plt.ylabel("Pupil's Diameter")
# plt.show()


