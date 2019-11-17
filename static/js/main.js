window.onload = function(){
    log(arguments,"Welcome!");
};

function log(methodArgs, ...message) {
    let name = methodArgs.callee.name;
    name = name === "" ? "(anonymous)" : name;
    console.log("[" + name + "]\n" + message.join(" "));
}

function refreshRoomHtml() {
    $("#roomHtml").text($("#roomList").html());
}

async function getRoom(){
    await RoomHandler.updateDomList($('#roomList'));
    refreshRoomHtml();
}

function refreshDeviceHtml() {
    $("#deviceHtml").text($("#deviceList").html());
}

async function getDevices() {
    await DeviceHandler.updateDomList($('#deviceList'));
    refreshDeviceHtml();
}