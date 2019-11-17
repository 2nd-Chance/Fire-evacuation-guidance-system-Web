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


@app.route('/get/deviceIds', methods=['GET', 'POST'])
def get_device_ids():
    key = "device"
    if not db.exists(key):
        return 'No Content', 204

    device_ids = get_list(db.smembers(key), byteToString)
    return jsonify(device_ids)


@app.route('/get/device', methods=['GET', 'POST'])
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


@app.route('/update/device', methods=['GET', 'POST'])
def update_device():
    if request.method == 'GET':
        device_json = request.args.get("deviceJson")
        print(device_json)
    else:
        device_json = request.form["deviceJson"]
        print(device_json)
    device = json.loads(device_json)

    if not db.exists(device["uuid"]):
        return 'No Content', 204

    result = add_device_to_db(device)
    return "{}".format(result)


@app.route('/add/device', methods=['GET', 'POST'])
def add_device():
    if request.method == 'GET':
        device_json = request.args.get("deviceJson")
        print(device_json)
    else:
        device_json = request.form["deviceJson"]
        print(device_json)
    device = json.loads(device_json)

    result = add_device_to_db(device)
    return "{}".format(result)


def add_device_to_db(device):
    if not "uuid" in device or device["uuid"] == "":
        return False

    value_dict = dict()
    if "uuid" in device:
        value_dict["id"] = device["uuid"]
    if "bluetoothMac" in device:
        value_dict["bm"] = device["bluetoothMac"]
    if "roomId" in device:
        value_dict["rm"] = device["roomId"]
    if "deviceType" in device:
        value_dict["dt"] = device["deviceType"]
    if "deviceClass" in device:
        value_dict["dc"] = device["deviceClass"]
    if "alertState" in device:
        value_dict["ar"] = 1 if device["alertState"] == 'true' else 0
    if "aliveState" in device:
        value_dict["al"] = 1 if device["aliveState"] == 'true' else 0
    if "sensorType" in device:
        value_dict["st"] = device["sensorType"]
    if "sensorValue" in device:
        value_dict["sv"] = device["sensorValue"]

    db.sadd("device", device["uuid"])
    db.hmset(device["uuid"], value_dict)
    return True


@app.route('/get/roomIds', methods=['GET', 'POST'])
def get_room_ids():
    key = "room"
    if not db.exists(key):
        return 'No Content', 204

    room_ids = get_list(db.smembers(key), int)
    return jsonify(room_ids)


@app.route('/get/room', methods=['GET', 'POST'])
def get_room():
    if request.method == 'GET':
        key = request.args.get("key")
    else:
        key = request.form["key"]

    if not db.exists(key):
        return 'No Content', 204

    room = dict()
    room["roomId"] = int(key)
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


@app.route('/update/room', methods=['GET', 'POST'])
def update_room():
    if request.method == 'GET':
        room_json = request.args.get("roomJson")
    else:
        room_json = request.form["roomJson"]
    room = json.loads(room_json)

    if not db.exists(room["roomId"]):
        return 'No Content', 204

    result = add_room_to_db(room)
    return "{}".format(result)


@app.route('/add/room', methods=['GET', 'POST'])
def add_room():
    if request.method == 'GET':
        room_json = request.args.get("roomJson")
    else:
        room_json = request.form["roomJson"]
    room = json.loads(room_json)

    result = add_room_to_db(room)
    return "{}".format(result)


def add_room_to_db(room):
    if not "roomId" in room or room["roomId"] == "":
        return False

    value_dict = dict()
    if "roomId" in room:
        value_dict["id"] = room["roomId"]
    if "name" in room:
        value_dict["nm"] = room["name"]
    if "locationX" in room:
        value_dict["x"] = room["locationX"]
    if "locationY" in room:
        value_dict["y"] = room["locationY"]
    if "locationLevel" in room:
        value_dict["lv"] = room["locationLevel"]
    if "alertState" in room:
        value_dict["ar"] = 1 if room["alertState"] == 'true' else 0
    if "aliveState" in room:
        value_dict["al"] = 1 if room["aliveState"] == 'true' else 0
    if "links" in room:
        value_dict["lk"] = "[" \
                           + (','.join(str(e) for e in room["links"])) + \
                           "]"
    if "staticDevices" in room:
        value_dict["sd"] = "[" \
                           + (','.join(("\"" + e + "\"") for e in room["staticDevices"])) \
                           + "]"
    if "dynamicDevices" in room:
        value_dict["dd"] = "[" \
                           + (','.join(("\"" + e + "\"") for e in room["dynamicDevices"])) \
                           + "]"
    db.sadd("room", room["roomId"])
    db.hmset(room["roomId"], value_dict)
    return True


if __name__ == '__main__':
    app.config["CACHE_TYPE"] = "null"
    app.run(host="0.0.0.0", port="4000")
