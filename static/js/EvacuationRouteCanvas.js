class EvacuationRouteCanvas {
    constructor() {
        this.blackNode = new Image();
        this.redNode = new Image();
        this.greenNode = new Image();
        this.blackNode.src = "../static/image/node_black.png";
        this.redNode.src = "../static/image/node_red.png";
        this.greenNode.src = "../static/image/node_green.png";
        this.nodeImgWidth = 50;
        this.nodeImgHeight = 50;

        this.canvas = document.getElementById("Evacuation_Route_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.room = document.querySelectorAll("#roomList room");

        setInterval(this.checkAlert,10000);
    }

    checkAlert() {
        control.setAlert(false);
        for(let i = 0; this.room.length; i++){
            if(this.room[i].getAttribute("alertState") === true){
                control.setAlert(true);
            }
        }
        this.clear();
        this.drawMap();
    }

    clear() {
        this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    checkNodeState(i) {
        if(this.room[i].getAttribute("alertState") === true){
            return "red";
        } else if(this.room[i].getAttribute("alertState") === false
            && this.room[i].getAttribute("route") === "green"){
            return "green";
        } else{
            return "black";
        }
    }

    drawMap(){
        for(let i = 0; this.room.length; i++){
            let link = document.querySelectorAll("#roomList room[roomId = " + this.room[i].getAttribute("roomId") + "] linkTo");
            for(let j = 0; j < link.length; j++){
                this.drawEdge(this.room[i].getAttribute("X"), this.room[i].getAttribute("Y"),
                    document.querySelector("#roomList room[roomId = "+ link[j].value + "]").getAttribute("X"),
                    document.querySelector("#roomList room[roomId = "+ link[j].value + "]").getAttribute("Y"));
            }
            this.drawNode(this.room[i].getAttribute("name"), this.room[i].getAttribute("X"),
                this.room[i].getAttribute("Y"), this.checkNodeState(i));
        }
    }

    drawEdge(startX, startY, endX, endY, color) {
        if(color === null || color ==="black"){
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
        }else if(color ==="green") {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.strokeStyle = "green";
            this.ctx.stroke();
        }
    }

    drawNode(name, X, Y, color){
        switch (color) {
            case "black":
                this.ctx.drawImage(this.blackNode, X, Y, this.nodeImgWidth, this.nodeImgHeight);
                break;
            case "red":
                this.ctx.drawImage(this.redNode, X, Y, this.nodeImgWidth, this.nodeImgHeight);
                break;
            case "green":
                this.ctx.drawImage(this.greenNode, X, Y, this.nodeImgWidth, this.nodeImgHeight);
                break;
        }
        this.ctx.textBaseline = 'top';
        this.ctx.font='13px Verdana';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name, X, Y);
    }


}