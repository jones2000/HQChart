<template>
    <div>
        <QueryContent ref='queryContent'></QueryContent>
    </div>
</template>
<script>
    import QueryContent from '../../jscommon/umychart.vue.components/queryContent.vue'
    export default{
        data(){
            return {}
        },
        components:{QueryContent},
        methods:{
            OnSize(){
                var queryContent = this.$refs.queryContent;
                queryContent.OnSize();
            }
        },
        mounted(){
            var _this = this;
            window.onresize = function () {
                _this.OnSize();
            }
        }
    }
</script>

<style>
</style>