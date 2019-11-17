class EditMapCanvas {
    constructor(canvas, size) {
        this._canvas = document.querySelector("Edit_Map_canvas");
        document.querySelector("room#room1").getAttribute("alertState")
        this.initialize();
    }

    setCanvasSize() {
        this._canvas.width = this._canvas.parentElement.width;
        this._canvas.height = this._canvas.parentElement.height;
    }

    initialize() {

    }

    getRoomByID(roomId) {
        return this.room[id];
    }

    addRoomToCanvas(){
        
    }

}