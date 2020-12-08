// 마커를 담을 배열
var markers = [];
var click_marker = new kakao.maps.Marker(); 
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

var iconmenu = document.getElementById('icon-menu');
// 지도를 생성   
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체를 생성
var ps = new kakao.maps.services.Places();  

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성
var infowindow = new kakao.maps.InfoWindow({
    zIndex:1,
    removable : true
});



// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();

var geocoder = new kakao.maps.services.Geocoder();


// 지도 클릭시 마커 생성 이벤트 추가
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    infowindow.close();
    var latlng = mouseEvent.latLng; 
    
    click_marker.setPosition(latlng);
    click_marker.setMap(map);
});

// 지도에 클릭으로인한 마커를 우클릭시 마커 삭제 이벤트 추가
kakao.maps.event.addListener(click_marker, 'mousedown', function(){
    if (event.button==2){ 
        click_marker.setMap(null);
        infowindow.close();
    }
});

// 클릭이벤트로 생긴 마커 위치에 따라 행정동(지역명) 자동 기입 (보이지 않음)
kakao.maps.event.addListener(click_marker, 'click', function(){
    displayInfowindow(click_marker, "");
    var callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            write_loc_xy(click_marker.getPosition(),result[0].address.region_2depth_name,'loc_x','loc_y');
        }
    };
    geocoder.coord2Address(click_marker.getPosition().getLng(), click_marker.getPosition().getLat(), callback);
});

map.addControl(iconmenu, kakao.maps.ControlPosition.RIGHT);
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 키워드 검색을 요청하는 함수
function searchPlaces() {

    var keyword = document.getElementById('keyword').value;
    var exptext = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('올바르지 않은 검색 키워드 입니다');
        return false;
    }
    else if (exptext.test(keyword)){
        alert('위경도');
        return false;
    }
    else{
        // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
        ps.keywordSearch( keyword, placesSearchCB); 
    }
}

// 장소검색이 완료됐을 때 호출되는 콜백함수
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);

        // 페이지 번호를 표출합니다
        displayPagination(pagination);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}

// 검색 결과 목록과 마커를 표출하는 함수
function displayPlaces(places) {
    infowindow.close();
    var listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = '';
    
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker(markers);
    
    for ( var i=0; i<places.length; i++ ) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i), 
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);


        (function(marker, title) {
            kakao.maps.event.addListener(marker, 'click', function() {
                infowindow.close();
                displayInfowindow(marker, title);
                var callback = function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        write_loc_xy(marker.getPosition(),result[0].address.region_2depth_name,'loc_x','loc_y');
                    }
                };
                geocoder.coord2Address(marker.getPosition().getLng(), marker.getPosition().getLat(), callback);
            });


            itemEl.onclick =  function () {
                infowindow.close();
                displayInfowindow(marker, title);
                var callback = function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        write_loc_xy(marker.getPosition(),result[0].address.region_2depth_name,'loc_x','loc_y');
                    }
                };
                geocoder.coord2Address(marker.getPosition().getLng(), marker.getPosition().getLat(), callback);
            };

        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수
function getListItem(index, places) {

    var el = document.createElement('li'),
    itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                '<div class="info">' +
                '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>';
    } else {
        itemStr += '    <span>' +  places.address_name  + '</span>'; 
    }
    

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수
function addMarker(position, idx, title) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage 
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거
function removeMarker(markers) {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시 함수
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i; 

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
    }

    for (i=1; i<=pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i===pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
// 인포윈도우에 장소명을 표시
function displayInfowindow(marker, title) {
    var content = '<form id="winfo" style="padding:5px; width:100%; height: 100%;" method="GET">' +
                    '<div style="padding:5px;z-index:1;">' + title + '</div>'+
                    '<div>접수 내용을 입력해주세요.</div>'+
                    '<select id="inp_type" style="position:absolute; width:50px;"><option value="사고">사고</option>'+
                    '<option value="공사">공사</option>'+
                    '<option value="정체">정체</option>'+
                    '<option value="원활">원활</option>'+
                    '<option value="기타">기타</option></select>'+
                    '<input id="reception_contents" style="width: 110px;margin-left: 50px;" type="text"></input>'+
                    '<input type="submit" value="저장" onclick="input_submit()"></input>'+
                    '<input style="display:none;" id="geo_name" type="text"></input>'+
                    '<input style="display:none;" id="loc_x" type="text" value=""></input>'+
                    '<input style="display:none;" id="loc_y" type="text" value=""></input>'+
                    '</form>';
    infowindow.setContent(content);
    infowindow.open(map, marker);
}

 // 검색결과 목록의 자식 요소 제거
function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

// 입력폼에 위치 정보(위경도)를 자동으로 기입하는 부분(보이지 않음)
function write_loc_xy(ev,loc,z1,z2){
    locinfo = document.getElementById("geo_name");
    xinfo = document.getElementById(z1);
    yinfo = document.getElementById(z2);  
    locinfo.value = loc;
    xinfo.value = ev.getLat();
    yinfo.value = ev.getLng();
}

// 입력폼의 정보를 서버 DB에 저장 요청
function input_submit(){
    var reception_contents = $('#reception_contents').val();
    var geo_name = $('#geo_name').val();
    var x_data = $('#loc_x').val();
    var y_data = $('#loc_y').val();
    var a_type = $('#inp_type').val();
    
    const getdata = {
               accid_type: a_type,
               accident_contents:reception_contents,
               loc:geo_name,
               lat:parseFloat(x_data),
               lng:parseFloat(y_data)
    }
    $.ajax({
        type: 'POST',
        url: '/req',
        data: JSON.stringify(getdata),
        dataType : 'json',
        contentType: "application/json",
        success: function(data){
            alert(data.result['loc']+" 데이터가 저장되었습니다.");
        },
        error: function(status, error){
            console.log(status);
            
            alert('ajax 통신 실패');
            alert(error);
        }
    })
    infowindow.close();
    event.preventDefault();
}

// 서버에 CSV 파일 요청
function request_file(){
    $.ajax({
        type: 'POST',
        url: '/save_csv',
        success: function(data){
            downloadCSV(data);
        },
        error: function(status, error){
            console.log(status);
            alert('ajax 통신 실패');
            alert(error);
        }
    })
    event.preventDefault();
}
// 서버에게 받은 csv파일 처리
function downloadCSV(down_data){
    a=down_data

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff"+a], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// 데이터 조회 창닫기 이벤트
$(document).on('click','#modal_close',function(){
    $('#modal').hide();
})