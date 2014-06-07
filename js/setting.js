$("#save_qiniu_setting").bind("click",function(){
    $("#save_qiniu_setting").addClass("disabled");
    $("#save_qiniu_setting").html("校验中");
    
    var bucket = $("#bucket").val();
    var ak = $("#ak").val();
    var sk = $("#sk").val();

    $.cookie('bucket', bucket, { expires: 365 }); 
    $.cookie('ak', ak, { expires: 365 }); 
    $.cookie('sk', sk, { expires: 365 }); 

    $.ajax({
        type: 'POST',
        url:"upload.php?a=test",
    }).done(function(data){
        if(data.status == "success"){
            $('#myModal').modal('hide');
            $('#current_bucket').html(bucket);
            $("#verify_qiniu_message").slideUp();
        }else{
            $("#verify_qiniu_message").slideDown();
            
        }
        $("#save_qiniu_setting").removeClass("disabled");
        $("#save_qiniu_setting").html("保存");
    })
});

$("#setting_button").bind("click",function(){
    $('#myModal').modal();

    $("#bucket").val($.cookie('bucket'));
    $("#ak").val($.cookie('ak'));
    $("#sk").val($.cookie('sk'));
});

if($.cookie('bucket') != null && $.cookie('bucket')!= ""){
    $("#current_bucket").html($.cookie('bucket'));    
}