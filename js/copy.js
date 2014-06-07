function onprogress(event) {
    　if (event.lengthComputable) {
　　　　　　var complete = (event.loaded / event.total * 100 | 0);
　　　　　　var progress = $('.progress:last .progress-bar');
　　　　　　if(complete == 100){
              progress.html("正在转存到七牛云存储...") ;
            }else{
              progress.html(complete + "%") ;
            }
　　　　　　progress.css("width",complete + "%");
　　　　}
};
var xhr_provider = function() {
    var xhr = jQuery.ajaxSettings.xhr();
    if(onprogress && xhr.upload) {
        xhr.upload.addEventListener('progress', onprogress, false);
    }
    return xhr;
};

function upload(img, d, name) {
    $("body").css("border","none");
    var random_id = "id_" + Math.floor(Math.random()*100000);
    if($(".pic").length>0){
        $(".pic:first").before("<div class='pic' id='" + random_id + "'></div>");
    }else{
        $(".pics").append("<div class='pic' id='" + random_id + "'></div>");
    }


    $("#" + random_id).append(img);

    var img_width = $(img).width();

    var process_html = '<div class="progress">' +
                    '<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:0%;">' +
                    '0%</div></div>';

    $("#" + random_id).append(process_html);
    $.ajax({
        type: 'POST',
        url:"upload.php?name=" + encodeURIComponent(name),
        data: d,
        xhr: xhr_provider
    }).done(function(data){
        if(data.status == "success"){

            var pic_url_html = '<form class="form-inline" role="form">'+
                              '<div class="form-group">'+
                                '<label class="sr-only" for="exampleInputEmail2">地址</label>'+
                                '<input type="text" class="form-control" value="' + data.url +
                                '" style="width:284px">'+
                              '</div>'+
                              ' <button type="button" id="copy_button_' + random_id + '" class="btn btn-default copy-button" data-clipboard-text="' + data.url + '">复制</button>'+
                              ' <button type="button" id="copy_markdown_button_' + random_id + '" class="btn btn-default copy-button" data-clipboard-text="![](' + data.url + ')">markdown</button>'+
                              ' <a type="button" class="btn btn-default" href="' + data.url + '" target="_blank">打开</a>'+
                            '</form>';
            $('.progress:last').remove();
            $("#" + random_id).append(pic_url_html);

            var client = new ZeroClipboard($("#copy_button_" + random_id));
            client.on( 'complete', function(client, args) {
                $("#copy_message").addClass("alert-success");
                $("#copy_message").html("复制成功");
                $("#copy_message").slideToggle();
                setTimeout(function(){
                    $("#copy_message").slideUp(500);
                },1500);
            } );

            var copy_markdown_button = new ZeroClipboard($("#copy_markdown_button_" + random_id));
            copy_markdown_button.on( 'complete', function(copy_markdown_button, args) {
                $("#copy_message").addClass("alert-success");
                $("#copy_message").html("复制成功");
                $("#copy_message").slideToggle();
                setTimeout(function(){
                    $("#copy_message").slideUp(500);
                },1500);
            } );

        }
    });
}

document.body.onpaste = function(e) {
    var items = e.clipboardData.items;
    for (var i = 0; i < items.length; ++i) {
        var item = e.clipboardData.items[i];
        if (items[i].kind == 'file' && items[i].type == 'image/png') {
            $("#help_message").hide();
            var fileReader = new FileReader();
            fileReader.onloadend = function (){
                var d = this.result.substr( this.result.indexOf(',')+1);
                var img = document.createElement("img");
                img.src= "data:image/jpeg;base64,"+d;
                upload(img, d, "");
            }
            fileReader.readAsDataURL(item.getAsFile());
            break;
        }else{
            $("#help_message").html("请粘贴图片");
        }
    }
};