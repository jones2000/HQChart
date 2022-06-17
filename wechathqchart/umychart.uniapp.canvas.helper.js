/*
copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com
    
    uniapp canvas 兼容方法
*/

function JSUniAppCanvasHelper() { }

JSUniAppCanvasHelper.GetCanvasFont=function(canvas)
{
    return canvas.font;
}

JSUniAppCanvasHelper.MeasureText=function(text, canvas) 
{
    var font= JSUniAppCanvasHelper.GetCanvasFont(canvas);
	var fontSize = 12;
    var pos=font.search('px');
    if (pos>0) 
    {
        var strSize = font.substring(0,pos);
        fontSize = parseInt(strSize);
    }
	text = String(text);
	var text = text.split('');
	var width = 0;
	for (let i = 0; i < text.length; i++) 
	{
		let item = text[i];
		if (/[a-zA-Z]/.test(item)) 
		{
			width += 7;
		} 
		else if (/[0-9]/.test(item)) 
		{
			width += 5.5;
		} 
		else if (/\./.test(item)) 
		{
			width += 2.7;
		} 
		else if (/-/.test(item)) 
		{
			width += 3.25;
		} 
		else if (/[\u4e00-\u9fa5]/.test(item)) 
		{
			width += 10;
		} 
		else if (/\(|\)/.test(item)) 
		{
			width += 3.73;
		} 
		else if (/\s/.test(item))   //空格
		{
			width += 3.25;
		} 
		else if (/%/.test(item)) 
		{
			width += 8;
		}
		else if (/:/.test(item))
		{
			width += 3.25;
		} 
		else 
		{
			width += 10;
		}
	}
	return width * fontSize / 10;
}

//导出统一使用JSCommon命名空间名
var JSCommonUniApp=
{
    JSUniAppCanvasHelper: JSUniAppCanvasHelper,
};

export
{
    JSCommonUniApp
}
/*
module.exports =
{
    JSCommonUniApp:
    {
        JSUniAppCanvasHelper: JSUniAppCanvasHelper,
    }
};
*/
	
