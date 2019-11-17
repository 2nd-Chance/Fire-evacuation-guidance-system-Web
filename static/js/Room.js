class Room {
    constructor(name, id, location, alertState, aliveState, links, staticDevices, dynamicDevices) {
        this._id = id;
        this._location = location;
        this._alertState = alertState;
        this._aliveState = aliveState;
        this._links = links;
        this._staticDevices = staticDevices;
        this._dynamicDevices = dynamicDevices;
    }

    set id(value) {
        this._id = value;
    }

    get id() {
        return this._id;
    }

    set location(value) {
        this._location = value;
    }

    get location() {
        return this._location;
    }

    set alertState(value) {
        this._alertState = value;
    }

    get alertState() {
        return this._alertState;
    }

    set aliveState(value) {
        this._aliveState = value;
    }

    get aliveState() {
        return this._aliveState;
    }

    set links(value) {
        this._links = value;
    }

    get links() {
        return this._links;
    }

    set staticDevices(value) {
        this._staticDevices.append(value);
    }

    get staticDevices() {
        return this._staticDevices;
    }

    set dynamicDevices(value) {
        this._dynamicDevices.append(value);
    }

    get dynamicDevices() {
        return this._dynamicDevices;
    }

}