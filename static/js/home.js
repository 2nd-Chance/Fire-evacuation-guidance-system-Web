let request_timer = null;
let request_display_timer = null;
let previous_alert_state = null;
let previous_info_data = null;

function request_alert_status() {
    $.ajax({
        type:'POST',
        url:'/request_alert',
        data: {
            alert:false
        },
        dataType:'JSON',
        success:function(result){
            home_btn_state(result.alert)
        },
        error:function(xtr, status, error) {
            alert(xtr+":"+status+":"+error)
        }
    })
}

function home_btn_state(alert) {
    let normal_url = "/static/image/peaceful.gif";
    let emergency_url = "/static/image/emergency.gif";
    let html_code = "";
    if (previous_alert_state !== alert) {
        if (alert === false) {
            html_code += "<h1 style='text-align: center; color: green; margin-top: 80px'>아무 문제 없으니 마음껏 돌아다니십시오.</h1>";
            html_code += "<img src='" + normal_url + "' height='250px' id='run_away'>";
        } else {
            html_code += "<h1 style='text-align: center; color: red; margin-top: 80px'>도망 치십시오.</h1>";
            html_code += "<img src='" + emergency_url + "' height='250px' id='run_away'>";
        }
        $('#main').html("");
        $('#main').append(html_code);
        previous_alert_state = alert;
    }
}

function prepare_to_make_room() {
    $.ajax({
        type:'POST',
        url:'/request_statics',
        data: {
            statics:[]
        },
        dataType:'JSON',
        success:function(result){
            static_list = result.statics;
            $('#main').html("");
            result = `
                        <div class="form-group">
                        <label for="xloc_label">방 이름:</label>
                        <input type="text" class="form-control" id="room_name">
                    </div>
                    <div class="form-group">
                        <label for="xloc_label">X 위치(0~800):</label>
                        <input type="text" class="form-control" id="xloc">
                    </div>
                    <div class="form-group">
                        <label for="yloc_label">Y 위치(0~600):</label>
                        <input type="text" class="form-control" id="yloc">
                    </div> 
                    <div class="form-group">
                        <label for="select_contents">항목</label>
                        <select id="selected_contents" class="form-control" name="static_list">
                        `;
            static_list.forEach(function(item, index, array) {
               result += "<option value='"+item+"'>"+"정적 장치: "+item+"</option>"
            });
            result += "<option value='server'>공유기(서버)</option>";
            result += "<option value='exit'>나가기</option>";
            result += `
                        </select>
                    </div> 
                    <button type="button" class="btn" id="submit">제출</button>
                    `;
            $('#main').append(result);

            $('#main #submit').click(function(){
                result = {
                    nm: $('#room_name').val(),
                    x: $('#xloc').val(),
                    y: $('#yloc').val(),
                    id: 'rooms|'+$('#selected_contents').find(":selected").attr('value'),
                };
                const is_num = !isNaN(result.x) && !isNaN(result.y);
                const is_empty = result.room_name === "";
                if (is_num && !is_empty) {
                    $.ajax({
                        type:'POST',
                        url:'/request_make_room',
                        data: result,
                        dataType:'JSON',
                        success:function(){
                            $('#room_name').val('');
                            $('#xloc').val('');
                            $('#yloc').val('');
                            alert("등록이 완료되었습니다.");
                        }
                    });
                } else {
                    alert("등록에 실패 하였습니다.");
                }

            });

        },
        error:function(xtr, status, error) {
            alert(xtr+":"+status+":"+error)
        }
    });
}

function prepare_to_connect_a_room() {
    $('#main').html('');
    $.ajax({
        type: 'POST',
        url: '/request_room_list',
        data: {
            room_list: []
        },
        dataType: 'JSON',
        success: function (value) {
            let room_list = value.room_list;
            result = '<div class="form-group">';
            result += '<label for="select_contents">노드 1</label>';
            result += '<select id="src_contents" class="form-control" name="static_list">';
            room_list.forEach(function (item, index, array) {
                result += "<option value='" + item + "'>" + "노드 리스트: " + item + "</option>"
            });
            result += '</select>'
            result += '<label for="select_contents">노드 2</label>';
            result += '<select id="dst_contents" class="form-control" name="static_list">';
            room_list.forEach(function (item, index, array) {
                result += "<option value='" + item + "'>" + "노드 리스트: " + item + "</option>"
            });
            result += '</select>'
            result += '</div><button type="button" class="btn" id="submit">제출</button>'
            $('#main').html(result)
            $('#main #submit').click(function(){
                result = {
                    0: $('#src_contents').find(":selected").attr('value'),
                    1: $('#dst_contents').find(":selected").attr('value'),
                };
                $.ajax({
                    type:'POST',
                    url:'/request_connect_room',
                    data: result,
                    dataType:'JSON',
                    success:function(){
                        alert("등록이 완료되었습니다.");
                    }
                });

            });
        }
    });
}

function request_display_modules() {
    $.ajax({
        type: 'POST',
        url: '/request_devices_status',
        data: {
            devices_info: []
        },
        dataType: 'JSON',
        success: function (value) {

            let device_info_list = value.devices_info;
            let result = "";
            let keys = new Set();
            device_info_list.forEach(function (item, index, array) {
                for (let field in item)
                    keys.add(field)
            });
            result += "<div class=\"table-responsive\">";
            result += "<table class=\"table table-small-font table-bordered table-striped\">";
            result += "<caption>등록된 모듈</caption>";
            result += "<thead><tr>";
            for (let field of keys) {
                if (field === "room id")
                    field = "room name";
                result += "<th>"+field+"</th>"
            }
            result += "</tr></thead>";
            result += "<tbody>";
            device_info_list.forEach(function (item, index, array) {
                let option = item['alert state'] === "1" ? "style=\"background-color: #ffa7ac;\"" : "";
                result += "<tr "+option+">";
                for (let field of keys) {
                    if (field in item) {
                        if (field === "room id") {
                            result += "<td>"+item[field]["name"]+"</td>";
                        } else {
                            result += "<td>" + item[field] + "</td>";
                        }
                    } else {
                        result += "<td></td>"
                    }
                }
                result += "</tr>";
            });
            result += "</tbody>";
            result += "</table></div>";

            if (previous_info_data !== result) {
                $('#main').html(result);
                previous_info_data = result
            }
        }
    });
}

window.onload = function() {
    request_alert_status();
    request_timer = setInterval(request_alert_status, 500);
    $('#cssmenu ul li').click(function(){
        let active_state = {
            'home_btn':false,
            'edit_btn':false,
            'make_room_btn':false,
            'connect_room_btn':false,
            'display_status':false,
        };

        clearInterval(request_timer);
        clearInterval(request_display_timer);
        previous_info_data = null;
        previous_alert_state = null;

        active_state[$(this).attr('id')] = true;
        $('#main').html("");

        $('#cssmenu ul li').each(function() {
            let cur_id = $(this).attr('id');
            $(this).attr('class', '');
            if(active_state[cur_id]) {
                $(this).attr('class', 'active');
                switch(cur_id) {
                    case 'home_btn':
                        console.log("clicked");
                        request_alert_status();
                        request_timer = setInterval(request_alert_status, 500);
                        break;
                    case 'make_room_btn':
                        prepare_to_make_room();
                        break;
                    case 'connect_room_btn':
                        prepare_to_connect_a_room();
                        break;
                    case 'display_status':
                        request_display_timer = setInterval(request_display_modules, 500);
                        break;
                }
            }
        })
    });
};
