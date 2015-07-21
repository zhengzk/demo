var ria = {
    component:{}
};
RELATIVE_PATH = RELATIVE_PATH || '';
/**
 * Created by zhengzk on 2015/7/21.
 */
ria.component.FlowLayout = function(containter,options){

    var own = this;
    own.containter = containter;
    own.initOptions(options);
    own.initPosition();
    return{

    }
}

ria.component.FlowLayout.prototype = {
    initOptions:function(options){
        var own = this;
        own.options = {
            items:options.items || [],
            itemWidth: options.itemWidth || null
        };
    },
    initPosition:function(){
        var own = this;
        var cwidth = $(own.containter).width();
        $(own.containter).ready(function(){
            cwidth = $(own.containter).width();
        });

        $(own.containter).css({
            position:'relative'
        });

        var startPositions = [];//最后一排元素的坐标信息
        startPositions.push({
            left:0,
            top:0
        });

        var items = own.options.items;
        var len = items.length;
        for(var k = 0 ; k < len ; k ++ ){
            var item = items[k];
            var iwidth = $(item).outerWidth();
            var iheight = $(item).outerHeight();

            var ileft = startPositions[0].left,itop = startPositions[0].top;
            var inx = 0;
            var flag = false;
            //var aaaa = function() {
            console.log('------')
            console.log(JSON.stringify(startPositions));
            startPositions.sort(function (a, b) {
                var t = a.top - b.top;
                return t == 0 ? b.left - a.left : t ;
            });
            console.log(JSON.stringify(startPositions));

                for (var i = 0; i < startPositions.length; i++) {
                    var pre = startPositions[i];
                    if (pre.left + iwidth <= cwidth) {
                        ileft = pre.left;
                        itop = pre.top;
                        inx = i;
                        flag = true;
                        break;
                    } else {
                        //startPositions.sort(function (a, b) {
                        //    var t = a.top - b.top;
                        //    return t > 0 ? t : a.left - b.left;
                        //});
                        //aaaa();
                    }
                }
            //}
            //aaaa();
            if(flag){
                startPositions.splice(0,(inx+1));
                startPositions.unshift({
                    left:ileft,
                    top:itop + iheight
                });

                startPositions.unshift({
                    left:ileft + iwidth,
                    top:itop
                });

                $(item).css({
                    position:'absolute',
                    left:ileft + 'px',
                    top:itop + 'px'
                });
            }
        }

        var totalHeight = startPositions[startPositions.length - 1].top;
        $(own.containter).css({
            position:totalHeight + 'px'
        });
        //position: absolute; left: 486px; top: 0px;
    }
}
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