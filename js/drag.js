// 针对拖放的处理
if (window.FileReader) {
    cnt = document.body;
    // 判断是否图片
    function isImage(type) {
        switch (type) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/bmp':
        case 'image/jpg':
            return true;
        default:
            return false;
        }
    }

    // 处理拖放文件列表
    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $("#help_message").hide();
        var files = evt.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            var t = f.type ? f.type : 'n/a';
            var size = f.size;
            var name = f.name;
            var reader = new FileReader();
            var isImg = isImage(t);

            // 处理得到的文件
            if (isImg) {
                if(size > 1024*1024*2){
                   alert('请选择小于 2M 的图片！');
                   $("body").css("border","none");
                }else{
                    reader.onload = function (){
                        var d = this.result.substr( this.result.indexOf(',')+1);
                        var img = document.createElement("img");
                        img.src= "data:image/jpeg;base64,"+d;
                        upload(img, d, "");
                    }

                    reader.readAsDataURL(f);
                }
            } else {

                if(size > 1024*1024*10){
                   alert('请选择小于 10M 的文件！');
                   $("body").css("border","none");
                }else{
                    reader.onload = function (){
                        var d = this.result.substr( this.result.indexOf(',')+1);
                        var img = document.createElement("img");
                        img.src= "file.jpg";
                        upload(img, d, name);
                    }
                    reader.readAsDataURL(f);
                }
                $("body").css("border","none");
            }
        }
    }

    // 处理插入拖出效果
    function handleDragEnter(evt){ this.setAttribute('style', 'border:#eee 4px dashed;'); }
    function handleDragLeave(evt){ this.setAttribute('style', ''); }

    // 处理文件拖入事件，防止浏览器默认事件带来的重定向
    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    cnt.addEventListener('dragenter', handleDragEnter, false);
    cnt.addEventListener('dragover', handleDragOver, false);
    cnt.addEventListener('drop', handleFileSelect, false);
    cnt.addEventListener('dragleave', handleDragLeave, false);

    } else {
    document.getElementById('section').innerHTML = '你的浏览器不支持啊，同学';
}