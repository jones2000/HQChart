<!-- 
    动态加载组件
-->

<script>

function JSLoaderPath() {}

    

JSLoaderPath.GetFileName=function(className)
{
    var pathMap=new Map(
    [
        ['StockChart', 'stockchart.vue'],
        ['StockOrder', 'stockorder.vue'],
    ]);

    if (pathMap.has(className)) return pathMap.get(className);

    return null;
}


export default 
{
    name:'JSLoader',

    props: 
    [
        'ClassName',        //控件名称
        'CreateComplete',   //创建完成事件回调
        'DefaultSymbol',    //默认代码
        'DefaultOption',    //配置信息
    ], 

    created() 
    {   
        //动态注册组件
        switch(this.ClassName)
        {
            case 'StockChart':
                this.$options.components[this.ClassName] = require('./stockchart.vue');
                break;
            case 'StockOrder':
                this.$options.components[this.ClassName] = require('./stockorder.vue');
                break;
        }
       
        //var file=JSLoaderPath.GetFileName(this.ClassName);
        //this.$options.components[this.ClassName] = require('./'+file);
    },

    render: function (createElement) 
    {
        console.log("[JSLoader::render] ", this.ClassName, this.DefaultSymbol, this.DefaultOption );
        this.Control=createElement(this.ClassName, { props:{DefaultSymbol:this.DefaultSymbol, DefaultOption:this.DefaultOption} } );
        return this.Control;
    },

    mounted:function()
    {
        console.log(`[JSLoader::mounted]`);
        var self=this;
        this.$nextTick(function () 
        {
            // Code that will run only after the
            // entire view has been rendered
            console.log(`[JSLoader::mounted::nextTick]`);
            if (self.CreateComplete) self.CreateComplete(self); //创建完成 回调通知上层
            self.GetControl().OnSize();      
        });     
    },

    methods: 
    {
        GetControl:function()   //获取真正的控件实例
        {
            return this.Control.componentInstance;
        },

        ChangeSymbol:function(symbol)
        {
            switch(this.ClassName)
            {
                case 'StockChart':
                    this.GetControl().ChangeSymbol(symbol);
                    return;
            }
        }
    }
}
</script>