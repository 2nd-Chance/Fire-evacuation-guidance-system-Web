class DeviceHandler {
    /**
     * @typedef {{uuid, deviceType, bluetoothMac, deviceClass, aliveState, alertState, roomId}} Device
     */

    /**
     * Gets the list of uuid of all registered devices from the server
     * @returns {Promise<string[]>} returns a list
     */
    static getUuids() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/get/deviceIds",
                type: "POST",
                success: (data) => {
                    resolve(data);
                },
                error: (data) => {
                    reject(data);
                }
            });
        });
    }

    /**
     * Gets the device from the server according to the given uuid
     * @param uuid {string}
     * @returns {Promise<Device>} returns device object
     */
    static getByUuid(uuid) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/get/device",
                type: "POST",
                data: {
                    key: uuid
                },
                dataType: "json",
                success: (data) => {
                    resolve(data);
                },
                error: (data) => {
                    reject(data);
                }
            });
        });
    }

    /**
     * Gets all the devices from the server
     * @returns {Promise<{Object<string,Device>}>} format in '{uuid: deviceObject}'
     */
    static async getAll() {
        const devices = {};
        const deviceIds = await this.getUuids();

        for (const uuid of deviceIds) {
            const deviceJson = await this.getByUuid(uuid);
            // log(arguments, "uuid:", uuid, "\njson:", JSON.stringify(deviceJson));
            devices[deviceJson.uuid] = deviceJson;
        }
        return devices;
    }

    /**
     * Creates DOM representing the given device
     * @param device {Device}
     * @returns {jQuery} returns a DOM
     */
    static toDom(device) {
        return $("<device/>")
            .attr("id", "device" + device.uuid)
            .attr("uuid", device.uuid)
            .attr("type", device.deviceType)
            // .attr("btMac", device.bluetoothMac)
            // .attr("class", device.deviceClass)
            // .attr("alert", device.alertState)
            // .attr("alive", device.aliveState)
            .attr("room", device.roomId);
    }

    /**
     * Updates DOM container that contains all the device DOMs
     * @param $listContainer {jQuery}
     * @returns {Promise<void>}
     */
    static async updateDomList($listContainer) {
        const devices = await this.getAll();
        $listContainer.empty();

        for (const devicesKey in devices) {
            if (!devices.hasOwnProperty(devicesKey)) {
                continue;
            }

            const device = devices[devicesKey];
            // log(arguments, "key:", devicesKey, "\njson:", JSON.stringify(device));
            $listContainer.append(this.toDom(device));
        }
    }

    /**
     * Updates DOM container related to the given device
     * @param $listContainer {jQuery}
     * @param device {jQuery|Device|string}
     */
    static async updateDom($listContainer, device) {
        const uuid = this.toUuid(device);
        const $existDom = $("#device" + uuid);
        if ($existDom.length) {
            $existDom.remove();
        }

        device = await this.getByUuid(uuid);
        $listContainer.append(this.toDom(device));
    }

    /**
     * @param device {jQuery|Device|string}
     * @returns {Promise<void>}
     */
    static updateToServer(device) {
        device = this.toDevice(device);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/update/device",
                type: "POST",
                data: {
                    deviceJson: JSON.stringify(device)
                },
                dataType: "json",
                success: (data) => {
                    resolve(data);
                },
                error: (data) => {
                    reject(data);
                }
            });
        });
    }

    /**
     * @param device {jQuery|Device|string}
     * @returns {Promise<void>}
     */
    static addToServer(device) {
        device = this.toDevice(device);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/add/device",
                type: "POST",
                data: {
                    deviceJson: JSON.stringify(device)
                },
                dataType: "json",
                success: (data) => {
                    resolve(data);
                },
                error: (data) => {
                    reject(data);
                }
            });
        });
    }

    /**
     * @param device {jQuery|Device|string}
     * @returns {string}
     */
    static toUuid(device) {
        let uuid;
        if (typeof device === "object" && device.attr) {
            uuid = device.attr("uuid");
        } else if (typeof device === "object" && device.uuid) {
            uuid = device.uuid;
        } else if (typeof device === "string") {
            uuid = device;
        }
        return uuid;
    }

    /**
     * @param device {jQuery|Device|string}
     * @returns {Device}
     */
    static toDevice(device) {
        let object;
        if (typeof device === 'object' && device.attr) {
            object = this.domToDevice(device);
        } else if (typeof device === 'object' && device.uuid) {
            object = device;
        } else if (typeof device === 'string') {
            object = this.domToDevice($("#device" + device));
        }
        return object;
    }

    /**
     * @param dom {jQuery}
     * @returns {Device}
     */
    static domToDevice(dom) {
        const device = {};
        device["uuid"] = dom.attr("uuid");
        device["deviceType"] = dom.attr("type");
        // device["bluetoothMac"] = dom.attr("btMac");
        // device["deviceClass"] = dom.attr("class");
        // device["alertState"] = dom.attr("alert");
        // device["aliveState"] = dom.attr("alive");
        device["roomId"] = dom.attr("room");
        return device;
    }
}