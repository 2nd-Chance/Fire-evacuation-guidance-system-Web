class EditMapCanvas {
    constructor() {
        this.canvas = document.getElementById("Edit_Map_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.nodeImg = new Image();
        this.nodeImg.src = "../static/image/node_black.png";
        this.penMode = false;
        this.isDrag = false;
        this.WIDTH = 400;
        this.HEIGHT = 400;
        this.room = [];
        // this.ctx.onmousedown = this.mouseDown();
        // this.ctx.onmouseup = this.mouseUp();

        //this.room은 캔버스에 올라온 노드들의 목록
        //room은 모든 노드들의 목록
    }

    getRoomByID(roomId) {
        return this.room[roomId];
    }

    drawTrashCan(){
        let trashCan = new Image();
        trashCan.src = "./static/image/trash_bin_black.png";
        this.ctx.drawImage(trashCan, 200, 200, 32, 32);
    }

    changeMode(){
        this.penMode = !this.penMode;
        alert(this.penMode);
    }

    saveMap() {
        alert('save function not implemented');
    }

    addRoomToCanvas(roomId){
        let room = document.querySelector('#roomList room[roomId = "' +  roomId + '"]');

        this.ctx.textBaseline = 'top';
        this.ctx.font='13px Verdana';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(roomId, 55, 95);

        room.setAttribute('level', 1);

        room.setAttribute('X',30);
        room.setAttribute('Y', 30);
        this.room[roomId].X = 30;
        this.room[roomId].Y = 30;

        document.querySelector('#freeNodeList room[roomId = "' + roomId + '"]').remove();

        this.ctx.drawImage(this.nodeImg, 30, 30, 50, 50);
    }

    deleteNode(roomId) {
        let room = document.querySelector('#roomList room[roomId = "' +  roomId + '"]');
        room.setAttribute('level', 0);
        this.room.remove(roomId);
    }

    selectNodeById(roomId) {
        this.currentNode = document.querySelector('#roomList room[roomId = "' + roomId + '"]');
        this.currentNode.getAttribute('X');
        this.currentNode.getAttribute('Y');
    }

    clear(){
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    }
/*
    mouseMove(e) {
        if(this.isDrag){
            this.mouseX = e.pageX - this.canvas.offsetLeft;
            this.mouseY = e.pageY - this.canvas.offsetTop;
            this.drawNode();
        }
    }

    drawNode() {
        this.ctx.drawImage(this.nodeImg, this.mouseX - 25, this.mouseY - 25, 50, 50);
    }

    mouseDown(e){
        for(let i = 0; i < this.room.length; i++) {
            if(this.room[i] == null) i++;
            if(e.pageX < this.room[i].X + 25 + this.canvas.offsetLeft && e.pageX < this.room[i].X - 25 + this.canvas.offsetLeft
            && e.pageY < this.room[i].Y + 25  + this.canvas.offsetTop && e.pageY < this.room[i].Y - 25 + this.canvas.offsetTop) {
                this.mouseX = e.pageX - this.ctx.offsetLeft;
                this.mouseY = e.pageY - this.ctx.offsetTop;
                this.isDrag = true;
                this.canvas.onmousemove = this.mouseMove();
            }
        }
        alert("mouse down");
    }

    mouseUp() {
        this.isDrag = false;
        this.canvas.onmousemove = null;
        alert("mouse up");
    }
    */
}