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