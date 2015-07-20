var ria = {};
RELATIVE_PATH = RELATIVE_PATH || '';
var IMG_DEBUG_DATA = [
    {
        href:RELATIVE_PATH + 'test/images/01.jpg',
        tag:'',
        title:'test',
        date:'2015年6月',
        desc:''
    },
    {
        href:RELATIVE_PATH + 'test/images/02.jpg',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/03.jpg',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/04.jpg',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/05.jpg',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/01.png',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/02.png',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/03.png',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/04.png',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/05.png',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/06.png',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/07.png',
        tag:''
    },
    {
        href:RELATIVE_PATH + 'test/images/08.png',
        tag:''
    }
];

var TAG_DEBUG_DATA = [{

}];

ria.Model = function(data,separator){
    var own = this;
    own.data = data || [];
    own.separator = separator || ',';
    own.initTags();
    return{
        getImgData:function(req,succ,fail,error){
            req = req || {tag:''};
            own.getImgData(req,succ,fail,error);
        },
        getTags:function(){
            return own.tags;
        }
    };
}

ria.Model.prototype = {
    initTags:function(){//获取所有tag标签
        var own = this;
        var tags = [];
        var data = this.data;
        var len = data.length;
        for(var i = 0; i < len ; i++){
            var d = data[i];
            var tagArray = (d.tag || '').split(own.separator);
            for(var k = 0 ; k < tagArray.length ; k ++){
                if(tagArray[i] == ""){
                    continue;
                }

                var flag = false;
                for(var inx = 0 ; inx < tags.length; inx ++ ){
                    if(tagArray[i] == tags[inx]){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    tags.push(tagArray[i]);
                }
            }
        }
        own.tags = tags;
    },
    isAvailableTag:function(tag){
        var own = this;
        if(tag == ""){
            return false;
        }
        var flag = false;
        for(var inx = 0 ; inx < own.tags.length; inx ++ ){
            if(tag == own.tags[inx]){
                flag = true;
                break;
            }
        }
        return flag;
    },
    getImgData:function(req,succ,fail,error){
        var own = this;
        if(req.tag == ""){
            if('function' == typeof succ){
                succ(own.data);
            }
        }else if(!own.isAvailableTag(req.tag)){
            if('function' == typeof fail){
                fail('','请求参数错误');
            }
        }else {
            var ret = [];
            var data = this.data;
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var d = data[i];
                var tagArray = (d.tag || '').split(own.separator);
                for (var k = 0; k < tagArray.length; k++) {
                    if (tagArray[i] == "") {
                        continue;
                    }
                    if (req.tag == tagArray[i]) {
                        ret.push(d);
                        break;
                    }
                }
            }
            if('function' == typeof succ){
                succ(ret);
            }
        }
    }
};

model = new ria.Model(IMG_DEBUG_DATA,',');