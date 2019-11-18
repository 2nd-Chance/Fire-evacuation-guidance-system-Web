class Control {

    changeHomeText(){
        if(this.getAlert()){
            document.getElementById("home_text").innerHTML = "Fire alert! <br> Please evacuate";
            document.getElementById("Home").style.backgroundColor = "#FFABAB";
            document.getElementById("home_image").src = "../static/image/running_black.png";
        }else{
            document.getElementById("home_text").innerHTML = "There is no fire. <br> You are safe.";
            document.getElementById("Home").style.backgroundColor = "white";
            document.getElementById("home_image").src = "../static/image/standing_black.png";
        }
    }

    setAlert(alert){
        this._alert = alert;
        this.changeHomeText(alert);
    }

    getAlert(){
        return this._alert;
    }


}