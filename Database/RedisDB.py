import logging
import sys

import redis
import copy
import bidict


class GenericStructure:
    def __init__(self, generic_map=None):
        if generic_map is None:
            generic_map = {}
        self.generic_map = copy.deepcopy(generic_map)
        self.device_trans_map = bidict.bidict({
            "id": "uuid",
            "bm": "bluetooth MAC",
            "rm": "room id",
            "dt": "device type",
            "ci": "device class",
            "ar": "alert state",
            "al": "alive state",
            "st": "sensor type",
            "sv": "sensor value"
        })
        self.room_trans_map = bidict.bidict({
            "id": "room id",
            "nm": "name",
            "lx": "location x",
            "ly": "location y",
            "lv": "location level",
            "ar": "alert state",
            "al": "alive state",
            "lk": "links",
            "sd": "static devices",
            "dd": "dynamic devices"
        })

    def keys(self):
        result = []
        for key in self.generic_map:
            result.append(key.decode())
        return result

    def get(self, key=None):
        generic_map = self.generic_map
        if key is None:
            result = {}
            for key in generic_map:
                result[key.decode()] = (generic_map[key].decode())
        else:
            key = key.encode()
            result = generic_map.get(key, b"").decode()
        return result

    def set(self, key, value):
        self.generic_map[key.encode()] = value.encode()


class RedisDB:
    def __init__(self, ip="127.0.0.1", port=6379, db_num=0):
        self.ip = ip
        self.port = port
        self.db_num = db_num
        try:
            self.db = redis.Redis(ip, port, db_num)
        except redis.ConnectionError:
            logging.error("Cannot connect the database")
            sys.exit(-1)

    def get_alert_status(self, key="alert"):
        db = self.db
        key = key.encode()
        if not db.exists(key):
            logging.error("key({}) doesn't exist".format(key))
            raise ValueError
        return db.get(key) == b'1'

    def get_id_from_list(self, key="devices"):
        db = self.db
        key = key.encode()
        if not db.exists(key):
            logging.error("key({}) doesn't exist".format(key))
            raise ValueError
        device_id_list = list(db.smembers(key))
        return device_id_list

    def set_id_to_list(self, key="rooms", id='0'):
        key = key.encode()
        self.db.sadd(key, id.encode())

    def delete_key(self, key=None):
        if key is None:
            logging.warning("None value in parameter...")
            return None
        key = key.encode()
        self.db.delete(key)

    def get_contents(self, key):
        db = self.db
        if key is None:
            logging.error("Current key ==> {}".format(key))
            raise AttributeError
        if not db.exists(key):
            logging.error("key({}) doesn't exist".format(key))
            raise ValueError
        try:
            contents = GenericStructure(db.hgetall(key))
        except redis.ResponseError:
            logging.error("Cannot get the correct value from database")
            raise ValueError

        return contents

    def set_contents(self, contents):
        key = contents.get('id')
        self.db.hmset(key, contents.generic_map)

    def set_alert_state(self, value=True, key='alert'):
        self.db.set(key.encode(), b'1' if value else b'0')

    def get_link_list(self, room_id='1121'):
        return self.db.smembers((room_id+"|link").encode())


if __name__=='__main__':
    import pprint

    db = RedisDB("0.0.0.0")
    key_list = db.get_id_from_list()
    pprint.pprint(key_list)
    device = db.get_contents(key_list[0])
    pprint.pprint(device.get("id"))
    pprint.pprint(device.get())
    pprint.pprint(device.keys())

    keys = device.keys()

    pprint.pprint(db.get_alert_status())
    db.set_alert_state(False)
    pprint.pprint(db.get_alert_status())

    room = GenericStructure({
        b"id": b"1121", # id
        b"nm": b"hello", # name
        b"lx": b"0", # location x
        b"ly": b"10", # location y
        b"lv": b"0", # level
        b"ar": b"0", # alert
        b"al": b"1", # alive
        b"sd": b"1", # static device
        b"dd": b"0" # dynamic device
    })
    room.set("lk", room.get('id') + "|link")

    db.set_id_to_list("rooms", room.get("id"))
    db.set_contents(room)
    db.set_id_to_list(room.get('id') + "|link", key_list[0].decode())
    pprint.pprint(db.get_id_from_list(room.get('id') + "|link"))
    room = db.get_contents(room.get('id'))
    pprint.pprint(room.get())
