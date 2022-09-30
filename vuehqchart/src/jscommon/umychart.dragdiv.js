//////////////////////////////////////////////////////////////////////////////
//  拖拽宽度|宽度
//
//
/////////////////////////////////////////////////////////////////////////////


function JSDragDiv(divElement)
{
    this.DivElement=divElement;
    this.MouseDownPoint;            //点击鼠标位置
    this.MouseMovePoint;
    this.Cache={};
    this.MouseMoveCallback;
    this.MouseDownCallback;
    
    var self=this;
    divElement.onmousedown=function(e) 
    { 
        self.OnMouseDown(e); 
        document.onmousemove=function(e) { self.OnMouseMove(e); }
        document.onmouseup=function(e) { self.OnMouseUp(e); }
    }

    this.OnMouseDown=function(e)
    {
        console.log(`[JSDragDiv::OnMouseDown] x=${e.clientX} y=${e.clientY}`);
        this.MouseDownPoint={ X:e.clientX, Y:e.clientY };
        this.MouseMovePoint={ X:e.clientX, Y:e.clientY };
        if (this.MouseDownCallback) this.MouseDownCallback(e, this);
    }

    this.OnMouseMove=function(e)
    {
        console.log(`[JSDragDiv::OnMouseMove] x=${e.clientX} y=${e.clientY}`);
        if (this.MouseMoveCallback) this.MouseMoveCallback(e, this);

        this.MouseMovePoint={ X:e.clientX, Y:e.clientY }
    }

    this.OnMouseUp=function(e)
    {
        console.log(`[JSDragDiv::OnMouseUp] x=${e.clientX} y=${e.clientY}`);
        //清空事件
        document.onmousemove=null;
        document.onmouseup=null;
    }
}