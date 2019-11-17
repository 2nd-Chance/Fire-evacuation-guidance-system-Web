class RoomHandler {
    /**
     * @typedef {{id,name,locationX,locationY,locationLevel,alertState,aliveState,links,staticDevices,dynamicDevices}} Room
     */

    /**
     * Gets the list of ids of all registered rooms from the server
     * @returns {Promise<string[]>} returns a list
     */
    static getIds() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/roomIds",
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
     * Gets the room from the server according to the given id
     * @param id {number}
     * @returns {Promise<Room>} returns room object
     */
    static getById(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/room",
                type: "POST",
                data: {
                    key: id
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
     * Gets all the rooms from the server
     * @returns {Promise<{Object<number,Room>}>} format in '{id: roomObject}'
     */
    static async getAll() {
        const rooms = {};
        const roomIds = await this.getIds();

        for (const id of roomIds) {
            const roomJson = await this.getById(id);
            // log(arguments, "id:", id, "\njson:", JSON.stringify(roomJson));
            rooms[roomJson.id] = roomJson;
        }
        return rooms;
    }

    /**
     * Creates DOM representing the given room
     * @param room {Room}
     * @returns {jQuery} returns a DOM
     */
    static createDom(room) {
        const roomDom = $("<room/>")
            .attr("id", "room" + room.id)
            .attr("roomId", room.id)
            .attr("name", room.name)
            .attr("alert", room.alertState)
            // .attr("alive", room.aliveState)
            .attr("x", room.locationX)
            .attr("y", room.locationY)
            .attr("level", room.locationLevel);

        for (const link of room.links) {
            roomDom.append($("<linkTo/>").text(link));
        }
        for (const staticDevice of room.staticDevices) {
            roomDom.append($("<staticDevice/>").text(staticDevice));
        }
        for (const dynamicDevice of room.dynamicDevices) {
            roomDom.append($("<dynamicDevice/>").text(dynamicDevice));
        }
        return roomDom;
    }

    /**
     * Updates DOM container that contains all the room DOMs
     * @param $listContainer {jQuery}
     * @returns {Promise<void>}
     */
    static async updateDomList($listContainer) {
        const rooms = await this.getAll();
        $listContainer.empty();

        for (const roomsKey in rooms) {
            if (!rooms.hasOwnProperty(roomsKey)) {
                continue;
            }

            const room = rooms[roomsKey];
            // log(arguments, "key:", roomsKey, "\njson:", JSON.stringify(room));
            $listContainer.append(this.createDom(room));
        }
    }

    /**
     * Updates DOM container related to the given room
     * @param $listContainer {jQuery}
     * @param room {jQuery|Room|number}
     */
    static async updateDom($listContainer, room) {
        let id;
        if (typeof room === "object" && room.id) {
            id = parseInt(room.id, 10);
        } else if (typeof room === "object" && room.attr) {
            id = parseInt(room.attr("roomId"), 10);
        } else if (typeof room === "number") {
            id = room;
        }

        const $existDom = $("#room" + id);
        if ($existDom.length) {
            $existDom.remove();
        }

        room = await this.getById(id);
        $listContainer.append(this.createDom(room));
    }
}