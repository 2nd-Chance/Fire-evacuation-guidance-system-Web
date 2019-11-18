class EditMapCanvas {

    constructor(canvas, size) {
        this._canvas = document.querySelector("Edit_Map_canvas");
        //document.querySelector("room#room1").getAttribute("alertState")
        this.initialize();
        this.ctx = document.getElementById('Edit_Map_canvas').getContext("2d");
        this.penMode = false;
    }

    drawTrashCan(){
        let trashCan = new Image();
        trashCan.src = "../static/image/trash_bin_black.png";
        this.ctx.drawImage(trashCan, 200, 200, 32, 32);
    }

    initialize() {

    }

    getRoomByID(roomId) {
        return this.room[id];
    }

    changeMode(){
        this.penMode = !this.penMode;
    }

    addRoomToCanvas(roomId){
        let imgClo = new Image();
        let room = document.querySelector('#roomList room[roomId = "' +  roomId + '"]');

        imgClo.src = "../static/image/node_black.png";

        this.ctx.textBaseline = 'top';
        this.ctx.font='13px Verdana';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(roomId, 55, 95);

        room.setAttribute('X',30);
        room.setAttribute('Y', 30);
        document.querySelector('#freeNodeList room[roomId = "' + roomId + '"]').remove();

        this.ctx.drawImage(imgClo, 30, 30, 50, 50);
    }

    deleteNode() {

    }

    selectNodeById(roomId) {
        this.currentNode = document.querySelector('#roomList room[roomId = "' + roomId + '"]');
        this.currentNode.getAttribute('X')
    }

    canvasEvent() {
        var x = event.offsetX;
        var y = event.offsetY;

    }

    saveMap(){

    }
}