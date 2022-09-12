import json
import RPi.GPIO as GPIO
import time
import urllib.request

R_PIN = 11  # Physical Pin 11
G_PIN = 13  # Physical Pin 13
B_PIN = 15  # Physical Pin 15

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

GPIO.setup(R_PIN, GPIO.OUT)
GPIO.setup(G_PIN, GPIO.OUT)
GPIO.setup(B_PIN, GPIO.OUT)

R_PWM = GPIO.PWM(R_PIN, 100)
G_PWM = GPIO.PWM(G_PIN, 100)
B_PWM = GPIO.PWM(B_PIN, 100)


TS_COLORS = {
    0: {"name": "red", "pins": R_PIN, "pwm": R_PWM},
    1: {"name": "green", "pins": G_PIN, "pwm": G_PWM},
    2: {"name": "blue", "pins": B_PIN, "pwm": B_PWM},
    3: {"name": "yellow", "pins": (R_PIN, G_PIN), "pwm": (R_PWM, G_PWM)},
    4: {
        "name": "white",
        "pins": (R_PIN, G_PIN, B_PIN),
        "pwm": (R_PWM, G_PWM, B_PWM),
    },
}

PREV_TIME = None

CHANNEL_ID = "1848369"
WRITE_API_KEY = "P3RYOEFOD90DB9FY"
READ_API_KEY = "5Y175EF80D2KQ470"

while True:
    ts = urllib.request.urlopen(
        f"http://api.thingspeak.com/channels/{CHANNEL_ID}/feeds/last.json?api_key={READ_API_KEY}"
    )

    with open("status.txt", "r") as f:
        status = int(f.read())

    while status != 2:
        continue

    data = json.loads(ts.read())

    TIME = data["created_at"]
    if PREV_TIME is None or TIME == PREV_TIME:
        PREV_TIME = TIME
        continue

    ITERATIONS = int(data["field1"])
    DURATION = float(data["field2"])
    DELAY = float(data["field3"])
    INTENSITY = int(data["field4"])
    COLOR_NAME = TS_COLORS[int(data["field5"])]["name"]
    COLOR_PINS = TS_COLORS[int(data["field5"])]["pins"]
    COLOR_PWMS = TS_COLORS[int(data["field5"])]["pwm"]

    print(
        f"[$] {ITERATIONS} iterations of {INTENSITY}% {COLOR_NAME} for {DURATION}s with {DELAY}s delay"
    )

    for _ in range(ITERATIONS):
        if isinstance(COLOR_PWMS, tuple):
            for COLOR_PWM in COLOR_PWMS:
                COLOR_PWM.ChangeDutyCycle(100 - INTENSITY)
        else:
            COLOR_PWMS.ChangeDutyCycle(100 - INTENSITY)

        time.sleep(DURATION)

        if isinstance(COLOR_PWMS, tuple):
            for COLOR_PWM in COLOR_PWMS:
                COLOR_PWM.ChangeDutyCycle(100)
        else:
            COLOR_PWMS.ChangeDutyCycle(100)

        time.sleep(DELAY)

    PREV_TIME = TIME

    with open("status.txt", "w") as f:
        f.write("3")

    ts.close()

    R_PWM.start(100)
    G_PWM.start(100)
    B_PWM.start(100)

    time.sleep(1)
