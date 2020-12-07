
var select_markers = [];
var visibletraffic = false;

$(function() {
  $.datepicker.setDefaults($.datepicker.regional['ko']); 

  $('#Date1').datepicker({
    dateFormat: "yy-mm-dd",
    onClose: function( selectedDate ){
        $("#Date2").datepicker( "option", "minDate", selectedDate );
    }                
  });

  $('#Date2').datepicker({
      dateFormat: "yy-mm-dd",
      maxDate:0,
      onClose: function( selectedDate ) {
        $("#Date1").datepicker( "option", "maxDate", selectedDate );
      }                
  });
});

$(document).on('click','#item4',function(){
  if (visibletraffic == true ){
    visibletraffic = false;
    map.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
    
    }else{
    visibletraffic = true;
    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
  }
})

$(document).on('click','#item5',function(){
  $('#modal').css('display','flex');
})

$(document).ready(function(){
    //sido option 추가
    $.each(hangjungdong, function(idx, code){
    //append를 이용하여 option 하위에 붙여넣음
      if(code.sigungu == "-" && code.eupmyeondong=="-"){
        $('#sido').append(fn_option(code.sido, code.sido));
      }
});

$('#sido').change(function(){
$('#sigugun').show();
$('#sigugun').empty();
$('#sigugun').append(fn_option('','전체')); //
$.each(hangjungdong, function(idx, code){
if($('#sido > option:selected').val() == code.sido && code.eupmyeondong=="-" && code.sigungu!="-")
    $('#sigugun').append(fn_option(code.sigungu, code.sigungu));
});
});
/*
$('#sigugun').change(function(){
$('#dong').empty();
$.each(hangjungdong, function(idx, code){
  if($('#sido > option:selected').val() == code.sido && 
  $('#sigugun > option:selected').val() == code.sigungu && 
  code.eupmyeondong!="-")
      $('#dong').append(fn_option(code.eupmyeondong, code.eupmyeondong));
  });
  //option의 맨앞에 추가
  $('#dong').prepend(fn_option('','읍/면/동 선택'));
  //option중 선택을 기본으로 선택
  $('#dong option:eq("")').attr('selected', 'selected');

});*/
function fn_option(code, name){
    return '<option value="' + code +'">' + name +'</option>';
}
});

function region_submit(){
  var accid_type = $('#type').val();
  var geo_sido = $('#sido').val();
  if($('#sigugun').val().length>2){geo_sigugun = $('#sigugun').val().substring(0,$('#sigugun').val().length-1);}
  else{geo_sigugun = $('#sigugun').val();}
  var rect_time = $('#jugan').is(':checked')? "and reception_time between '06:00' and '21:59'":"and reception_time between '22:00' and '05:59'";
  if ($('#Date1').val()=="" && $('#Date2').val()==""){rect_date = ';';}
  else{rect_date = "and reception_date between '"+$('#Date1').val()+"' and '"+$('#Date2').val()+"';"};
  //var geo_dong = $('#dong').val();

  const rpostdata = {
             accid_type:accid_type,
             sido:geo_sido,
             sigugun:geo_sigugun,
             reception_time:rect_time,
             reception_date:rect_date/*,
             dong:geo_dong*/
  }
  $.ajax({
      type: 'POST',
      url: '/region_inquiry',
      data: JSON.stringify(rpostdata),
      dataType : 'json',
      contentType: "application/json",
      success: function(data){
        if(data.length>0){
          alert(geo_sido+geo_sigugun+" 데이터 조회 완료");
          draw_marker(data);
          lookuptable(data);
        }else{
          alert("조회 결과가 없습니다");
        }
      },
      error: function(status, error){
          console.log(status);
          alert('통신 실패'+error);
      }
  })
  event.preventDefault();
}

function draw_marker(select_result_data){
  bounds = new kakao.maps.LatLngBounds();

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker(select_markers);

  for ( var i=0; i<select_result_data.length; i++ ) {
    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(parseFloat(select_result_data[i]['lat']), parseFloat(select_result_data[i]['lng'])),
    marker = res_addMarker(placePosition, i); // 검색 결과 항목 Element를 생성합니다
    
    rc_type = select_result_data[i]['accid_type'];
    rc_date = select_result_data[i]['reception_date'];
    rc_time = select_result_data[i]['reception_time'];
    rc_loc = select_result_data[i]['accident_contents'];
    rc_lane = select_result_data[i]['lane'];
    
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);


    (function(marker,rc_type,rc_date,rc_time,rc_loc,rc_lane) {
        kakao.maps.event.addListener(marker, 'click', function() {
            infowindow.close();
            res_displayInfowindow(marker,rc_type,rc_date,rc_time,rc_loc,rc_lane);
        });
    })(marker,rc_type,rc_date,rc_time,rc_loc,rc_lane);
  }

  map.setBounds(bounds);
}

function res_displayInfowindow(marker,value_type,value_date,value_time,value_loc,value_lane) {
  var content = '<div style="width:230px;"><div> 유형 : '+value_type+'</div>'+
  '<div> 접수 날짜 : '+value_date+'</div>'+
  '<div> 접수 시간 : '+value_time+'</div>'+
  '<div> 제보 내용 : '+value_loc+'</div>'+
  '<div> 차로 : '+value_lane+'</div></div>';
  infowindow.setContent(content);
  infowindow.open(map, marker);
}

function res_addMarker(position) {
  var imageSize = new kakao.maps.Size(24, 35);
  var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
  marker = new kakao.maps.Marker({
    position: position,
    image : markerImage
  });
    
  marker.setMap(map); // 지도 위에 마커를 표출합니다
  select_markers.push(marker);  // 배열에 생성된 마커를 추가합니다
    
  return marker;
}

function removing_selmarker(){
  if(confirm("조회 지역 마커를 모두 지우시겠습니까?")){
    removeMarker(select_markers);
    infowindow.close();
    alert("조회 지역 마커를 지웠습니다.")
  }
}

function removing_resmarker(){
  if(confirm("검색 마커를 모두 지우시겠습니까?")){
    removeMarker(markers);
    removeAllChildNods(document.getElementById('placesList'));
    var x=document.getElementById('pagination');
    while (x.hasChildNodes() ){ 
      x.removeChild(x.firstChild); 
    }
    infowindow.close();
    alert("검색 마커를 지웠습니다.")
  }
}

function removing_allmarker(){
  if(confirm("모든 마커를 지우시겠습니까?")){
    removeMarker(select_markers);
    removeMarker(markers);
    removeAllChildNods(document.getElementById('placesList'));
    var x=document.getElementById('pagination');
    while (x.hasChildNodes() ){ 
      x.removeChild(x.firstChild); 
    }
    infowindow.close();
    alert("모든 마커를 지웠습니다.")
  } 
}

function lookuptable(jsontb){
  $('.styled-table > tbody').empty();
  $.each(jsontb, function(idx, code){
      innerHtml = "";
      innerHtml += "<tr>";
      $.each(code, function(idx, col){innerHtml += "<td>"+col+"</td>"});
      innerHtml += "</tr>";
      $(".styled-table > tbody:last").append(innerHtml);
  });
}