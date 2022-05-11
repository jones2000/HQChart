//日志
import { JSConsole } from "./umychart.console.wechat.js"
import { JSCommonUniApp } from './umychart.uniapp.canvas.helper.js'

function JSCanvasElement() 
{
    this.Height;
    this.Width;
    this.ID;
    this.WebGLCanvas;
    this.IsUniApp=false;
    this.CanvasNode=null;
    this.ComponentObject=null;  //在自定义组件下，当前组件实例的this，表示在这个自定义组件下查找拥有 canvas-id 的 canvas ，如果省略则不在任何自定义组件内查找

    //获取画布
    this.GetContext = function () 
	  {
        var canvas;
        if (this.CanvasNode && this.CanvasNode.node) 
        {
            const width = this.CanvasNode.width;
            const height = this.CanvasNode.height;

            var node = this.CanvasNode.node;
            node._height = height;
            node._width = width;
            JSConsole.Chart.Log("[JSCanvasElement::GetContext] create by getContext('2d')");
            canvas = node.getContext('2d');
            const dpr = wx.getSystemInfoSync().pixelRatio;
            node.width = width * dpr;
            node.height = height * dpr;
            canvas.restore();
            canvas.save();
            canvas.scale(dpr, dpr);
            canvas.draw = (bDraw, callback) => { if (callback) callback(); };
            canvas.DomNode = node;
        }
        else 
        {
            if (this.ComponentObject)   //小程序自定义组件
                canvas=wx.createCanvasContext(this.ID,this.ComponentObject);
            else
                canvas=wx.createCanvasContext(this.ID);
        }

        if (this.IsUniApp)
        {
            JSConsole.Chart.Log('[JSCanvasElement::GetContext] measureText() => JSUniAppCanvasHelper.MeasureText()');
            canvas.measureText = function (text) //uniapp 计算宽度需要自己计算
            {
                var width = JSCommonUniApp.JSUniAppCanvasHelper.MeasureText(text, canvas);
                return { width: width };
            }
			
            canvas.fillText_backup=canvas.fillText;	//uniapp fillText 填了最大长度就会失真, 所以去掉
            canvas.fillText=function(text,x,y,maxWidth)
            {
                canvas.fillText_backup(text,x,y);
            }
        }

        return canvas;
    }

    this.GetWebGLCanvas=function(id)
    {
        var self=this;
        const query = wx.createSelectorQuery();
        query.select(id).node().exec((res) => {
            JSConsole.Chart.Log('[JSCanvasElement::GetWebGLCanvas] res ', res)
            self.WebGLCanvas = res[0].node;
        })
    }
}


//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonElement:
    {
        JSCanvasElement: JSCanvasElement,
    },

    //单个类导出
    JSCommonElement_JSCanvasElement: JSCanvasElement,
};