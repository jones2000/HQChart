$(function(){
    $('.tabNav p').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).data('index');
        switch(index){
            case 0:
                $('#kline').show();
                $('#divDataWrap').hide();
                break;
            case 1:
                $('#divDataWrap').show();
                $('#kline').hide();
                break; 
        }
    });

    OnSizeTable();
    window.onresize = function(){
        OnSizeTable();
    }

    UpdateUI();
})

function UpdateUI(){
    console.log('json数据：',jsonData);
    var dateAry = jsonData.Date;
    var outVar = jsonData.OutVar;
    var timeAry = [];
    var timeData = jsonData.Time;
    if(timeData != null){
        for(let i = 0; i < timeData.length; ++i){
            var timeStr = timeData[i];
            var time=parseInt(timeStr);
            var minute=time%100;
            var hour=parseInt(time/100);
            var text=(hour<10? ('0'+hour.toString()):hour.toString()) + ':' + (minute<10?('0'+minute.toString()):minute.toString());
            timeAry.push(text);
        }
    }
    var ma1Ary = [];
    var ma2Ary = [];
    var ma3Ary = [];
    var theadDataAry = [];
    var tbodyDataAry = [];

    theadDataAry.push('Date');
    for(let j = 0; j < outVar.length; j++){
        var outItem = outVar[j];
        var type = outItem.Name;
        switch(type){
            case 'MA1':
                theadDataAry.push('MA1');
                ma1Ary = outItem.Data;
                break;
            case 'MA2':
                theadDataAry.push('MA2');
                ma2Ary = outItem.Data;
                break;
            case 'MA3':
                theadDataAry.push('MA3');
                ma3Ary = outItem.Data;
                break;
        }
    }
    if(timeAry.length > 0) theadDataAry.push('Time');

    
    for(let i = 0; i < dateAry.length; ++i){
        var tbodyItem = [];
        tbodyItem.push(dateAry[i]);
        if(ma1Ary.length > 0){
            var ma1 = ma1Ary[i] != null ? Number(ma1Ary[i]).toFixed(2) : '--';
            tbodyItem.push(ma1);
        }
        if(ma2Ary.length > 0){
            var ma2 = ma2Ary[i] != null ? Number(ma2Ary[i]).toFixed(2) : '--';
            tbodyItem.push(ma2);
        }
        if(ma3Ary.length > 0){
            var ma3 = ma3Ary[i] != null ? Number(ma3Ary[i]).toFixed(2) : '--';
            tbodyItem.push(ma3);
        }
        if(timeAry.length > 0){
            tbodyItem.push(timeAry[i]);
        }

        tbodyDataAry.push(tbodyItem);

    }
    // console.log('表格数据：',theadDataAry,tbodyDataAry);

    var theadStr = '';
    for(let i = 0; i < theadDataAry.length; ++i){
        theadStr += '<td>'+theadDataAry[i]+'</td>'
    }
    theadStr = `<tr>${theadStr}</tr>`;
    $("#divDataWrap thead").html(theadStr);

    var tbodyStr = '';
    // var pageCount = count <= tbodyDataAry.length ? count : tbodyDataAry.length;
    for(let j = 0; j < tbodyDataAry.length; ++j){
        var trItem = tbodyDataAry[j];
        var trStr = '';
        for(let n = 0; n < trItem.length; ++n){
            trStr += '<td>'+trItem[n]+'</td>'
        }
        // console.log('表格一行：',trStr);
        var trStr = `<tr>${trStr}</tr>`;
        tbodyStr += trStr;
    }
    $("#divDataWrap tbody").html(tbodyStr);

    // console.log('表格字符串：',tbodyStr);
}

function OnSizeTable(){
    var height = $(window).height();
    var width = $(window).width();

    var borderWidth = 1;
    var paddingHeight = 10;
    var tdHeight = 22 + borderWidth;
    var tbodyHeight = height - $('#demoTabNav').outerHeight(true) - paddingHeight * 2 - $('.headerWrap').outerHeight(true) -25;
    // var count = parseInt(tbodyHeight / tdHeight);
    $('.bodyWrap').css({'height':tbodyHeight+'px'});

    // return count;
}
