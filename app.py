import redis
from flask import *

app = Flask(__name__)

db = redis.Redis(
    host="192.168.1.102"
)


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
    return db.get('test')


# @app.route('/deviceKeys')
# def print_device_keys():
#     return to_str(get_device_keys())
#
#
# def get_device_keys():
#     return decode_redis(db.lrange('device', 0, -1))
#
#
# @app.route('/device/<key>')
# def print_device(key):
#     return to_str(get_device(key))
#
#
# def get_device(key):
#     return jsonify(db.hgetall(key))
#
#
# def set_device(device):
#     uuid = to_str(device["id"])
#     bluetooth_mac = to_str(device["bt"])
#     device_type = to_str(device["dt"])
#     alert_state = to_str(device["ar"])
#     alive_state = to_str(device["al"])
#     room_id = to_str(device["rm"])
#     class_id = to_str(device["cl"])
#
#     if class_id == "1" or class_id == "2":
#         sensor_type = to_str(device["st"])
#         sensor_value = to_str(device["sv"])
#         db.rpush("device", uuid)
#         db.hmset(uuid, {
#             "bt": bluetooth_mac,
#             "dt": device_type,
#             "cl": class_id,
#             "ar": alert_state,
#             "al": alive_state,
#             "st": sensor_type,
#             "sv": sensor_value,
#             "rm": room_id
#         })
#     elif class_id == "3":
#         db.rpush("device", uuid)
#         db.hmset(uuid, {
#             "bt": bluetooth_mac,
#             "dt": device_type,
#             "cl": class_id,
#             "ar": alert_state,
#             "al": alive_state,
#             "rm": room_id
#         })
#     else:
#         pass  # exception
#
#
# @app.route('/devices')
# def print_devices():
#     return to_str(get_devices())
#
#
# def get_devices():
#     device_map = dict()
#     device_keys = get_device_keys()
#     for i, val in enumerate(device_keys):
#         device_map[val] = get_device(val)
#     return device_map
#
#
# @app.route('/roomKeys')
# def print_room_keys():
#     return to_str(get_device_keys())
#
#
# def get_room_keys():
#     return decode_redis(db.lrange('room', 0, -1))
#
#
# @app.route('/room/<key>')
# def print_room(key):
#     return to_str(key)
#
#
# def get_room(key):
#     return decode_redis(db.hgetall(key))
#
#
# def set_room(room):
#     room_id = to_str(room["id"])
#     name = to_str(room["nm"])
#     location_x = to_str(room["x"])
#     location_y = to_str(room["y"])
#     location_lv = to_str(room["lv"])
#     alert_state = to_str(room["ar"])
#     alive_state = to_str(room["al"])
#     links = to_str(room["lk"])
#     static_devices = to_str(room["sd"])
#     dynamic_devices = to_str(room["dd"])
#     db.hmset(room_id, {
#         "nm": name,
#         "x": location_x,
#         "y": location_y,
#         "lv": location_lv,
#         "ar": alert_state,
#         "al": alive_state,
#         "lk": links,
#         "sd": static_devices,
#         "dd": dynamic_devices
#     })
#
#
# @app.route('/getRooms')
# def print_rooms():
#     return to_str(get_rooms())
#
#
# def get_rooms():
#     room_map = dict()
#     room_keys = get_room_keys()
#     for i, val in enumerate(room_keys):
#         room_map[val] = get_room(val)
#     return room_map
#
#
# def to_str(obj):
#     return "{}".format(obj)
#
#
# def decode_redis(src):
#     if isinstance(src, list):
#         rv = list()
#         for key in src:
#             rv.append(decode_redis(key))
#         return rv
#     elif isinstance(src, dict):
#         rv = dict()
#         for key in src:
#             rv[key.decode()] = decode_redis(src[key])
#         return rv
#     elif isinstance(src, bytes):
#         return src.decode()
#     else:
#         raise Exception("type not handled: " + type(src))


if __name__ == '__main__':
    app.config["CACHE_TYPE"] = "null"
    app.run(host="0.0.0.0", port="4000")
