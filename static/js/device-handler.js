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
                url: "/deviceIds",
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
                url: "/device",
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
    static createDom(device) {
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
            $listContainer.append(this.createDom(device));
        }
    }

    /**
     * Updates DOM container related to the given device
     * @param $listContainer {jQuery}
     * @param device {jQuery|Device|string}
     */
    static async updateDom($listContainer, device) {
        let uuid;
        uuid = this.getUuid(device);

        const $existDom = $("#device" + uuid);
        if ($existDom.length) {
            $existDom.remove();
        }

        device = await this.getByUuid(uuid);
        $listContainer.append(this.createDom(device));
    }

    static getUuid(device) {
        let uuid;
        if (typeof device === "object" && device.uuid) {
            uuid = device.uuid;
        } else if (typeof device === "object" && device.attr) {
            uuid = device.attr("uuid");
        } else if (typeof device === "string") {
            uuid = device;
        }
        return uuid;
    }
}