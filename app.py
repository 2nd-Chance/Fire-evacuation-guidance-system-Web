import redis
from flask import Flask, request, render_template, json, jsonify

app = Flask(__name__)

db = redis.Redis(
    host="192.168.1.102"
)


def byteToString(obj):
    return obj.decode("utf-8")


def get_list(obj, convert_method):
    my_list = list()
    for val in obj:
        my_list.append(convert_method(val))
    return my_list


def string_to_list(list_string):
    if not list_string.startswith("[") or not list_string.endswith("]"):
        raise Exception("Not a list format:", list_string)

    return json.loads(list_string)


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        return render_template("index.html", reqMethod=request.method)
    elif request.method == 'POST':
        return render_template("index.html", reqMethod=request.method)
    else:
        return render_template("index.html")


@app.route('/test')
def test():
    return "testing..."


@app.route('/deviceIds', methods=['GET', 'POST'])
def get_device_ids():
    key = "device"
    if not db.exists(key):
        return 'No Content', 204

    device_ids = get_list(db.lrange(key, 0, -1), byteToString)
    return jsonify(device_ids)


@app.route('/device', methods=['GET', 'POST'])
def get_device():
    if request.method == 'GET':
        key = request.args.get("key")
    else:
        key = request.form["key"]

    if not db.exists(key):
        return 'No Content', 204

    device = dict()
    device["uuid"] = key
    device["bluetoothMac"] = byteToString(db.hget(key, "bm"))
    device["roomId"] = int(db.hget(key, "rm"))
    device["deviceType"] = byteToString(db.hget(key, "dt"))
    device["deviceClass"] = int(db.hget(key, "cl"))
    device["alertState"] = int(db.hget(key, "ar")) != 0
    device["aliveState"] = int(db.hget(key, "al")) != 0
    if device["deviceClass"] in (1, 2):
        device["sensorType"] = byteToString(db.hget(key, "st"))
        device["sensorValue"] = byteToString(db.hget(key, "sv"))
    return jsonify(device)


@app.route('/roomIds', methods=['GET', 'POST'])
def get_room_ids():
    key = "room"
    if not db.exists(key):
        return 'No Content', 204

    room_ids = get_list(db.lrange(key, 0, -1), int)
    return jsonify(room_ids)


@app.route('/room', methods=['GET', 'POST'])
def get_room():
    if request.method == 'GET':
        key = request.args.get("key")
    else:
        key = request.form["key"]

    if not db.exists(key):
        return 'No Content', 204

    room = dict()
    room["id"] = int(key)
    room["name"] = byteToString(db.hget(key, "nm"))
    room["locationX"] = int(db.hget(key, "x"))
    room["locationY"] = int(db.hget(key, "y"))
    room["locationLevel"] = int(db.hget(key, "lv"))
    room["alertState"] = int(db.hget(key, "ar")) != 0
    room["aliveState"] = int(db.hget(key, "al")) != 0
    room["links"] = string_to_list(byteToString(db.hget(key, "lk")))
    room["staticDevices"] = string_to_list(byteToString(db.hget(key, "sd")))
    room["dynamicDevices"] = string_to_list(byteToString(db.hget(key, "dd")))
    return jsonify(room)


if __name__ == '__main__':
    app.config["CACHE_TYPE"] = "null"
    app.run(host="0.0.0.0", port="4000")
