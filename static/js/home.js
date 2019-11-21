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
    if (alert === false) {
        html_code += "<h1 style='text-align: center; color: green; margin-top: 80px'>당신은 안전합니다.</h1>";
        html_code += "<img src='" + normal_url + "' height='250px' id='run_away'>";
    } else {
        html_code += "<h1 style='text-align: center; color: red; margin-top: 80px'>도망 치십시오.</h1>";
        html_code += "<img src='" + emergency_url + "' height='250px' id='run_away'>";
    }
    $('#main').html("");
    $('#main').append(html_code);
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

var request_timer = null;

window.onload = function() {
    request_timer = setInterval(request_alert_status, 3000);

    $('#cssmenu ul li').click(function(){
        var active_state = {
            'home_btn':false,
            'edit_btn':false,
            'make_room_btn':false,
            'connect_room_btn':false,
            'evac_btn':false,
        };

        clearInterval(request_timer);

        active_state[$(this).attr('id')] = true;
        $('#main').html("");

        $('#cssmenu ul li').each(function() {
            var cur_id = $(this).attr('id');
            $(this).attr('class', '');
            if(active_state[cur_id]) {
                $(this).attr('class', 'active');
                switch(cur_id) {
                    case 'home_btn':
                        request_timer = setInterval(request_alert_status, 500);
                        break;
                    case 'make_room_btn':
                        prepare_to_make_room();
                        break;
                    case 'connect_room_btn':
                        prepare_to_connect_a_room();
                        break;
                    case 'evac_btn':
                        break;
                }
            }
        })
    });
};