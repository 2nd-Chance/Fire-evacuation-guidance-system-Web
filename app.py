from flask import Flask, url_for, render_template, request, redirect, session, jsonify
import hashlib
import logging
import redis
import random
from Database import RedisDB

con = RedisDB.RedisDB()
app = Flask(__name__)

logging.basicConfig(level=logging.INFO)


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('home.html')
    # if session.get('logged_in'):
    #    return render_template('home.html')
    # else:
    #    return redirect(url_for('login'))


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        return render_template('login.html')
    else:
        username = request.form['email']
        passwd = hashlib.sha256(request.form['password'].encode()).hexdigest().encode()
        try:
            db_passwd = con.db.hmget("user_list", username)[0]
        except redis.RedisError:
            return render_template('login.html', login_value="Fail to login")
        if passwd == db_passwd:
            session['logged_in'] = True
            return redirect(url_for('home'))
        else:
            return render_template('login.html', login_value="Fail to login")


@app.route("/register/", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['email']
        passwd = hashlib.sha256(request.form['password'].encode()).hexdigest().encode()
        con.db.hmset("user_list", {username: passwd})
        return redirect(url_for('login'))
    return render_template("register.html")


@app.route("/request_alert", methods=['POST'])
def request_alert_status():
    return jsonify(dict(alert=con.get_alert_status()))


@app.route("/request_make_room", methods=['POST'])
def request_make_room():
    value = request.form.to_dict()
    room_info = {}
    for room_key, room_value in value.items():
        room_info[room_key.encode()] = room_value.encode()
    logging.info(room_info)
    con.set_contents(RedisDB.GenericStructure(room_info))
    return jsonify(room_info)


@app.route("/request_statics", methods=['POST'])
def request_statics():
    statics = {"statics": []}
    device_list = con.get_id_from_list('devices')
    logging.info(device_list)
    for id in device_list:
        id = id.decode()
        device = con.get_contents(id)
        logging.info(device.generic_map)
        if device.get('dt') == 's':
            statics["statics"].append("{}_{}".format(id, device.get('st')))
    return jsonify(statics)


@app.route("/request_room_list", methods=['POST'])
def request_room_list():
    result = {'room_list': []}
    for room in con.db.keys("rooms|*"):
        result['room_list'].append(room.decode())
    return jsonify(result)


@app.route("/request_connect_room", methods=['POST'])
def request_connect_room():
    _1 = request.form['0']
    _2 = request.form['1']
    update_1 = {
        b"id": _1,
        b"lk": "links|{}".format(_1),
    }
    update_2 = {
        b"id": _2,
        b"lk": "links|{}".format(_2),
    }
    con.db.hmset(_1, update_1)
    con.db.hmset(_2, update_2)

    con.db.sadd(update_1[b'lk'], _2)
    con.db.sadd(update_2[b'lk'], _1)

    return jsonify(update_1)


if __name__ == '__main__':
    key = hashlib.sha256(str(random.randrange(0, 1e+10)).encode()).hexdigest().encode()
    app.secret_key = key
    app.run(host="0.0.0.0", port="4000")
