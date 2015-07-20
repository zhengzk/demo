/**
 *
 * @param _cfg
 * @returns {{moveTo: Function}}
 * @constructor
 */
var Move = function(root,cb_move){
    this.cfg  = {
        root: root,
        cb_move: cb_move
    };
    var own = this;
    var initFlag = false;
    if(null != own.cfg.root){
        own.init();
        initFlag = true;
    }

    return{
        moveTo:function(l,t,flag){
            l = parseInt(l);
            if(initFlag && !isNaN(l) && !isNaN(t)){
                return own.move(l,t,flag);
            }
            return null;
        }
    }
}

Move.prototype = {
    init:function(){
        var own = this;
        var root = own.cfg.root;
        var offset = $(root.parentNode).offset();

        own.minX = 0;
        own.maxX = $(root.parentNode).width() - $(root).width();
        own.minY = 0;
        own.maxY = $(root.parentNode).height() - $(root).height();

        var left = offset.left + ($(root).width() / 2);
        var top = offset.top + ($(root).width() / 2);

        own.initMoveEle(root,function(e){
            own.move((e.clientX  - left),(e.clientY  - top));
        });
    },
    move:function(left,top,flag){
        flag = flag || false;
        var own = this;
        var root = own.cfg.root;
        left = left < own.minX ? own.minX :( left > own.maxX ? own.maxX : left );
        top = top < own.minY ? own.minY :( top > own.maxY ? own.maxY : top );
        //root.style.left = l + 'px';
        root.style.transform = 'translateX('+ left +'px) translateY('+ top +'px)';;
        var cb_move = own.cfg.cb_move;
        if ('function' == typeof cb_move && !flag) {
            cb_move(left,top);
        }
        return {
            left:left,
            top:top
        };
    },
    initMoveEle:function(ele,cb_move){
        var own = this;
        var win = document;
        if('undefined' != typeof window.onmousedown){
            win = window;
        }
        //var isObserve = false;//move事件是否绑定
        $(ele).bind('mousedown', function (e) {
            //if(!isObserve) {
            $(win).bind('mousemove', cb_move);
            own.setSelect(true);
            //isObserve = true;
            //}
        });

        $(win).bind('mouseup', function (e) {
            //if(isObserve) {
            $(win).unbind('mousemove', cb_move);
            own.setSelect(false);
            //isObserve = false;
            //}
        });
    },
    getClientLeft:function(ele){
        if(null == ele){
            return ;
        }
        var left = ele.offsetLeft;
        var parentNode = ele.offsetParent;
        while(true){
            if(null == parentNode){
                break;
            }
            left = left + parentNode.offsetLeft - parentNode.scrollLeft;
            if(parentNode == document.body){
                break;
            }
            parentNode = parentNode.offsetParent;
        }
        return left;
    },
    setSelect:function(flag){
        if(flag){
            document.onselectstart = function(){
                return false;
            }
        }else{
            document.onselectstart = null;
        }
    }
}
