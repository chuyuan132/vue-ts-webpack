declare module '*.vue' {
    import { defineComponent } from 'vue';
    // 声明所有以 .vue 结尾的文件都是一个 Vue 组件
    const component: ReturnType<typeof defineComponent>;
    export default component;
}
