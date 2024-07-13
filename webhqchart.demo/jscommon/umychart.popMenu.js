/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   内置菜单 使用table模式
*/

function JSPopMenu()
{
    this.Data={ Menu:[], Position:0 };   //{ Name:, SVG, ID, bChecked:, SubMenu:[] }    Position 0=右键菜单  1=Tab弹菜单 2=下拉菜单

    this.RootDOM=null;
    this.TBodyDOM=null;
    this.ArySubRootDOM=[];

    this.ClickCallback=null;        //点击回调
    this.CheckedClassName="UMyChart_MenuItem_Span_Checked  iconfont icon-checked";   //选中图标
    this.RightArrowClassName="UMyChart_MenuItem_Span_Arrow  iconfont icon-menu_arraw_right";  //右侧箭头
    this.SelectedClassName="UMyChart_MenuItem_Tr_Selected";

    this.AryTDClassName=
    [
        "UMyChart_MenuItem_Td_Status",      //图标
        "UMyChart_MenuItem_Td_Content",     //文字
        "UMyChart_MenuItem_Td_Shortcut",    //快捷方式
        "UMyChart_MenuItem_Td_Arrow"        //箭头
    ];

    this.Inital=function()
    {
        window.addEventListener('mousedown', (e)=>{ this.OnWindowMouseDown(e)});
    }

    //创建菜单
    this.CreatePopMenu=function(data)
    {
        this.Clear();

        if (!IFrameSplitOperator.IsNonEmptyArray(data.Menu)) return;

        var root=document.createElement("div");
        root.className="UMyChart_PopMenu";

        var table=document.createElement("table");
        table.className="UMyChart_PopMenu_Table";
        root.appendChild(table);

        var tbody=document.createElement("tbody");
        tbody.className="UMyChart_PopMenu_Tbody";
        table.appendChild(tbody);
        
        
        var rootData={ Root:root, TBody:tbody, Table:table };
        root.JSMenuData=rootData;
        for(var i=0;i<data.Menu.length;++i)
        {
            var item=data.Menu[i];
            if (item.Name==JSPopMenu.SEPARATOR_LINE_NAME)
            {
                var trSeparator=this.CreateSeparatorTr();
                if (trSeparator) tbody.appendChild(trSeparator);
                continue;
            }

            var trDom=this.CreateMenu(rootData, item);
            tbody.appendChild(trDom);
        }

        document.body.appendChild(root);
        this.RootDOM=root;
        this.TBodyDOM=tbody;

        if (IFrameSplitOperator.IsNumber(data.Position)) this.Data.Position=data.Position;
        if (data.ClickCallback) this.ClickCallback=data.ClickCallback;
       
    }

    //清除菜单
    this.Clear=function()
    {
        this.Data.Menu=[];
        this.Data.Position=JSPopMenu.POSITION_ID.RIGHT_MENU_ID;
        this.ClickCallback=null;

        if (!this.RootDOM) return;

        document.body.removeChild(this.RootDOM);
        this.RootDOM=null;
        this.TBodyDOM=null;

        for(var i=0;i<this.ArySubRootDOM.length;++i)
        {
            document.body.removeChild(this.ArySubRootDOM[i]);
        }
        this.ArySubRootDOM=[]
    }

    this.CreateMenu=function(parentItem, item)
    {
        var trDom=document.createElement("tr");
        trDom.className='UMyChart_MenuItem_Tr';

        if (item.Disable===true) trDom.classList.add('UMyChart_DrawTool_Disable_Tr');
        
        var prtTdDom=null;
        for(var i=0;i<this.AryTDClassName.length;++i)
        {
            var tdDom=document.createElement("td");
            tdDom.className=this.AryTDClassName[i];

            if (i==0)   //图标
            {
                if (item.Checked)
                {
                    var spanDom=document.createElement("span");
                    spanDom.className=this.CheckedClassName;
                    spanDom.style["font-size"]="10px";
                    tdDom.appendChild(spanDom);
                }
            }
            else if (i==1)  //内容
            {
                tdDom.innerText=item.Name;
            }
            else if (i==2)  //快捷方式
            {

            }
            else if (i==3)  //箭头
            {
                if (IFrameSplitOperator.IsNonEmptyArray(item.SubMenu))
                {
                    var spanDom=document.createElement("span");
                    spanDom.className=this.RightArrowClassName;
                    spanDom.style["font-size"]="10px";
                    tdDom.appendChild(spanDom);
                }
            }

            trDom.appendChild(tdDom);
        }

        if (IFrameSplitOperator.IsNonEmptyArray(item.SubMenu)) //子菜单
        {
            var subRoot=document.createElement("div");
            subRoot.className="UMyChart_PopSubMenu";

            var subTable=document.createElement("table");
            subTable.className="UMyChart_PopMenu_Table";
            subRoot.appendChild(subTable);

            var subTbody=document.createElement("tbody");
            subTbody.className="UMyChart_PopMenu_TBody";
            subTable.appendChild(subTbody);
       
            var subRootData={ Root:subRoot, TBody:subTbody, Table:subTable };
            subRoot.JSMenuData=subRootData;
            var preTrDom=null;
            for(var i=0;i<item.SubMenu.length;++i)
            {
                var subItem=item.SubMenu[i];
                if (subItem.Name==JSPopMenu.SEPARATOR_LINE_NAME)
                {
                    var trSeparator=this.CreateSeparatorTr();
                    if (trSeparator) subTbody.appendChild(trSeparator);
                    continue;
                }
                
                var subTrDom=this.CreateMenu(subRootData, subItem);
                preTrDom=subTrDom;
                subTbody.appendChild(subTrDom);
            }
           
            trDom.onmouseover=(e)=>{ this.OnMouseOver(e, parentItem, trDom, subRoot); }
            document.body.appendChild(subRoot);
            this.ArySubRootDOM.push(subRoot);
        }
        else
        {
            if (item.Disable===true)
            {
                
            }
            else
            {
                trDom.onmousedown=(e)=> { this.OnClickMenu(e, item, false); };   //菜单点击
                trDom.onmouseover=(e)=>{ this.OnMouseOver(e, parentItem); }
            }
        }

        return trDom;
    }

    this.CreateSeparatorTr=function()
    {
        var trSeparator=document.createElement("tr");
        trSeparator.className='UMyChart_MenuItem_Tr_Separator';

        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_MenuItem_Td_Status_Separator";
        trSeparator.appendChild(tdDom);

        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_MenuItem_Td_Separator";
        trSeparator.appendChild(tdDom);

        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_MenuItem_Td_Separator";
        trSeparator.appendChild(tdDom);

        var tdDom=document.createElement("td");
        tdDom.className="UMyChart_MenuItem_Td_Separator";
        trSeparator.appendChild(tdDom);

        return trSeparator;
    }

    //弹tab菜单
    this.PopupMenuByTab=function(rtTab)
    {
        if (!this.RootDOM) return;  
        if (!rtTab) return;

        var xLeft=rtTab.Left;
        var yTop=rtTab.Top-this.RootDOM.offsetHeight;

        this.RootDOM.style.visibility='visible';
        this.RootDOM.style.top = yTop + "px";
        this.RootDOM.style.left = xLeft + "px";
    }

    //弹右键菜单
    this.PopupMenuByRight=function(x,y)
    {
        if (!this.RootDOM) return;  
        if (!IFrameSplitOperator.IsNumber(x) || !IFrameSplitOperator.IsNumber(y)) return;

        //菜单在当前屏幕无法显示需要调整
        var menuHeight=this.RootDOM.offsetHeight;
        var yMenuBottom=y+menuHeight;
        var yBottom=window.innerHeight-15;
        if (yMenuBottom>yBottom) y=yBottom-menuHeight;

        var menuWidth=this.RootDOM.offsetWidth;
        var yMenuRight=x+menuWidth;
        var yRight=window.innerWidth-15;
        if (yMenuRight>yRight) x=yRight-menuWidth;

        this.RootDOM.style.visibility='visible';
        this.RootDOM.style.top = y + "px";
        this.RootDOM.style.left = x + "px";
    }

    //下拉菜单
    this.PopupMenuByDrapdown=function(rtButton)
    {
        if (!this.RootDOM) return;  
        if (!rtButton) return;

        var xLeft=rtButton.Left;
        var yTop=rtButton.Bottom;
        var menuHeight=this.RootDOM.offsetHeight;
        var yMenuBottom=yTop+menuHeight;
        var yBottom=window.innerHeight-15;
        if (yMenuBottom>yBottom) yTop=rtButton.Top-menuHeight;

        if (this.Data.Position==JSPopMenu.POSITION_ID.DROPDOWN_RIGHT_MENU_ID)
        {
            var menuWidth=this.RootDOM.offsetWidth;
            xLeft=rtButton.Right-menuWidth;
        }

        this.RootDOM.style.visibility='visible';
        this.RootDOM.style.top = yTop + "px";
        this.RootDOM.style.left = xLeft + "px";
    }

    this.OnClickMenu=function(e, item, bSubMenu)
    {
        console.log("[JSPopMenu::OnClickMenu] e=, item=, bSubMenu", e, item, bSubMenu);
        if (!this.ClickCallback) return;

        this.ClickCallback(item);
    }

    this.OnMouseOver=function(e, parentItem, trDom, subMenu)
    {
        if (parentItem && parentItem.PopMenu && parentItem.PopMenu!=subMenu) 
        {
            parentItem.PopMenu.style.visibility="hidden";
            if (parentItem.PopRow) parentItem.PopRow.classList.remove(this.SelectedClassName);

            var popMenuData=parentItem.PopMenu.JSMenuData;
            for(var i=0;i<50;++i)   //隐藏子菜单 最多50层
            {
                if (!popMenuData) break;
                if (!popMenuData.PopMenu) break;

                popMenuData.PopMenu.style.visibility="hidden";

                popMenuData=popMenuData.PopMenu;
            }

            parentItem.PopMenu=null;
            parentItem.PopRow=null;
        }
            
        if (subMenu)
        {
            if (subMenu.style.visibility=="visible")
            {

            }
            else
            {
                var rtParent=trDom.getBoundingClientRect();
                var x=rtParent.right, y=rtParent.top;

                //菜单在当前屏幕无法显示需要调整
                var yBottom=window.innerHeight-15;
                var yRight=window.innerWidth-15;
                var menuHeight=subMenu.offsetHeight;
                var menuWidth=subMenu.offsetWidth;
                var yMenuBottom=y+menuHeight;
                var yMenuRight=x+menuWidth;

                if (yMenuBottom>yBottom) y=yBottom-menuHeight;
                if (yMenuRight>yRight) x=rtParent.left-menuWidth;

                subMenu.style.left=`${x}px`;
                subMenu.style.top=`${y}px`;



                trDom.classList.add(this.SelectedClassName);

                /*
                if (this.Data.Position==JSPopMenu.POSITION_ID.TAB_MENU_ID)
                {
                    var yButton=parentItem.Root.getBoundingClientRect().bottom;
                    var ySubButton=subMenu.getBoundingClientRect().bottom;
                    if (yButton<ySubButton) 
                    {
                        var yOffset=yButton-ySubButton;
                        subMenu.style.top=`${yOffset}px`;
                    }
                }
                */
    
                subMenu.style.visibility="visible";
            }
            
            parentItem.PopMenu=subMenu;
            parentItem.PopRow=trDom;
        }
    }

   

    this.OnWindowMouseDown=function(e)
    {
        if (!this.RootDOM) return;

        console.log("[JSPopMenu::OnWindowMouseDown] e=", e);

        this.Clear();
    }
}


JSPopMenu.POSITION_ID={ };
JSPopMenu.POSITION_ID.RIGHT_MENU_ID=0;
JSPopMenu.POSITION_ID.TAB_MENU_ID=1;
JSPopMenu.POSITION_ID.DROPDOWN_MENU_ID=2;       //左对齐下拉
JSPopMenu.POSITION_ID.DROPDOWN_RIGHT_MENU_ID=3; //右对齐下拉
JSPopMenu.SEPARATOR_LINE_NAME="MENU_SEPARATOR"; //分割线
