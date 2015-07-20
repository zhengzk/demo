/**
 * 图片滚动组件
 */
function imageScroll(_childs,_next,_prev,_layer){
    var own = this;
    own.cfg = {
        next:_next,
        prev:_prev,
        childs:_childs,
        layer:_layer
    };

    own.flag = false;
    own.direction = 'right';
    own.interval = null;
    own.cur_inx = 0;

    own.init();
    own.start();

    return{
        start:function(){
            own.start();
        },
        stop:function(){
            own.stop();
        },
        reflushData:function(data){
            own.reflushData(data);
        },
        trigger:function(inx){
            own.trigger(inx);
        }
    };
}

imageScroll.prototype = {
    init:function(){
        var own = this;
        var _layer = own.cfg.layer;
        var _next = own.cfg.next;
        var _prev = own.cfg.prev;

        own.initChilds();

        $(_layer).hover(function(){
            own.flag = true;
        },function(){
            own.flag = false;
        });

        $(_next).click(function(){
            var _childs = own.cfg.childs;
            var _len = _childs.length;

            var _curr = _childs[own.cur_inx];
            if($(_curr).is(":animated")) {
                return ;
            }
            own.stop();
            $(_curr).fadeOut();
            own.cur_inx = (own.cur_inx + 1)%_len;
            var _img = _childs[own.cur_inx%_len];
            $(_img).fadeIn();
            own.direction = 'right';
            own.start();
        });

        $(_prev).click(function(){
            var _childs = own.cfg.childs;
            var _len = _childs.length;

            var _curr = _childs[own.cur_inx];
            if($(_curr).is(":animated")) {
                return ;
            }
            own.stop();
            $(_curr).fadeOut();
            own.cur_inx = (own.cur_inx + _len - 1)%_len;
            var _img = _childs[own.cur_inx%_len];
            $(_img).fadeIn();
            own.direction = 'left';
            own.start();
        });
    },
    initChilds:function(){
        var own = this;
        var _childs = own.cfg.childs;
        for(var k in _childs){
            if(k==0){
                $(_childs[k]).show();
            }else{
                $(_childs[k]).hide();
            }
        }
    },
    stop:function(){
        var own = this;
        clearInterval(own.interval);
    },
    start:function(){
        var own = this;
        var _next = own.cfg.next;
        var _prev = own.cfg.prev;
        own.interval = setInterval(function(){
            if(!own.flag){
                if(own.direction == 'left'){
                    $(_prev).trigger('click');
                }else{
                    $(_next).trigger('click');
                }
            }
        },5000);
    },
    trigger:function(inx){
        var own = this;
        own.stop();
        var _childs = own.cfg.childs;
        var _len = _childs.length;
        var _curr = _childs[own.cur_inx];
        if($(_curr).is(":animated")) {
            $(_curr).stop(true, true);
        }
        $(_curr).fadeOut();
        own.cur_inx = (inx)%_len;
        var _img = _childs[own.cur_inx];
        $(_img).fadeIn();
        own.start();
    },
    reflushData:function(data){
        var own = this;
        var _childs = own.cfg.childs;
        var _curr = _childs[own.cur_inx];
        if($(_curr).is(":animated")) {
            $(_curr).stop(true, true);
        }
        $(_curr).fadeOut();
        own.stop();
        own.cfg.childs = data;
        own.cur_inx = 0;
        own.initChilds();
        own.start();
    }
};