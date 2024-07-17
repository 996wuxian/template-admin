<template>
    <n-drawer
        v-model:show="drawerShow"
        :width="width"
        :placement="placement"
        close-on-esc
        mask-closable
        :trap-focus="false"
        @mask-click="closeDrawer"
        @esc="closeDrawer"
        @update:show="closeDrawer"
    >
        <n-drawer-content>
            <template #header>
                {{ title }}
            </template>
            <div class="flex flex-col">
                <n-divider> 主题模式 </n-divider>
                <div class="block">
                    <ThemeToggler />
                </div>
                <n-divider> 布局模式 </n-divider>
                <div class="flex flex-wrap justify-between h-200px px-20px">
                    <div
                        v-for="item in layoutOption"
                        :key="item.id"
                        @click="changeLayout(item)"
                    >
                        <Layout
                            :nav="item?.nav"
                            :side="item?.side"
                            :header="item?.header"
                            :aside="item?.aside"
                            :content="item?.content"
                            :is-active="item.isActive"
                            :tip="item.tip"
                        />
                    </div>
                </div>
                <n-divider> 页面功能 </n-divider>
                <div class="step-block">
                    侧边栏宽度
                    <n-input-number
                        v-model:value="sideWidth"
                        style="width: 120px"
                        placeholder=""
                        @update:value="sideWidthChange"
                        :min="90"
                        :max="500"
                    />
                </div>
                <div class="step-block">
                    头部高度
                    <n-input-number
                        v-model:value="sideWidth"
                        style="width: 120px"
                        placeholder=""
                        @update:value="sideWidthChange"
                        :min="90"
                        :max="500"
                    />
                </div>
                <div class="step-block">
                    显示天气
                    <n-switch v-model:value="whether" @update:value="whetherChange" />
                </div>
                <div class="step-block">
                    显示面包屑
                    <n-switch
                        v-model:value="breadcrumb"
                        @update:value="breadcrumbChange"
                    />
                </div>
                <div class="step-block">
                    显示面包屑图标
                    <n-switch
                        v-model:value="breadcrumbIcon"
                        @update:value="breadcrumbIconChange"
                    />
                </div>
                <div class="step-block">
                    显示标签栏
                    <n-switch
                        v-model:value="breadcrumbIcon"
                        @update:value="breadcrumbIconChange"
                    />
                </div>
                <div class="step-block">
                    标签栏风格
                    <n-select
                        v-model:value="value"
                        :options="options"
                        style="width: 120px"
                        placeholder=""
                    />
                </div>
            </div>
        </n-drawer-content>
    </n-drawer>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";
import Layout from "./layout.vue";
import { $msg } from "@/config/interaction.config";
import useThemeStore from "@/stores/modules/theme";
const useTheme = useThemeStore();
const whether = ref(useTheme.$state.whether);
const breadcrumb = ref(useTheme.$state.breadcrumb);
const breadcrumbIcon = ref(useTheme.$state.breadcrumbIcon);
const sideWidth = ref(useTheme.$state.sideWidth);

const drawerShow = ref(false);

const props = defineProps({
    drawerShow: {
        type: Boolean,
        default: false,
    },
    width: {
        type: Number,
        default: 360,
    },
    placement: {
        type: String,
        default: "right",
    },
    title: {
        type: String,
        default: "标题",
    },
});

drawerShow.value = props.drawerShow;

const emit = defineEmits(["close"]);

const closeDrawer = () => {
    emit("close");
};

const layoutOption = ref([
    {
        id: 0,
        side: true,
        header: true,
        content: true,
        isActive: false,
        tip: "左侧菜单模式",
        name: "left_menu",
    },
    {
        id: 1,
        nav: true,
        side: true,
        header: true,
        content: true,
        isActive: false,
        tip: "左侧菜单混合模式",
        name: "left_menu_mixin",
    },
    {
        id: 2,
        header: true,
        content: true,
        isActive: false,
        tip: "顶部菜单模式",
        name: "top_menu",
    },
    {
        id: 3,
        header: true,
        aside: true,
        content: true,
        isActive: false,
        tip: "顶部菜单混合模式",
        name: "top_menu_mixin",
    },
]);

const options = [
    {
        label: "按钮风格",
        value: "song0",
    },
    {
        label: "圆角风格",
        value: "song0",
    },
];

onMounted(() => {
    const choose = useTheme.$state.layout;

    layoutOption.value.forEach((v) => {
        if (v.name === choose) {
            v.isActive = true;
        }
    });
});

const changeLayout = (item: any) => {
    layoutOption.value.forEach((v) => {
        v.isActive = false;
    });
    item.isActive = true;
    useTheme.setLayout({ layout: item.name });

    if (item.name === "left_menu_mixin") {
        useTheme.setSideWidth({ sideWidth: 90 });
    } else {
        useTheme.setSideWidth({ sideWidth: 200 });
    }
};

const loadMessage = (msg: string) => {
    $msg({
        type: "success",
        msg,
    });
};

const sideWidthChange = (value: number) => {
    useTheme.setSideWidth({ sideWidth: value });
};

const whetherChange = (value: boolean) => {
    useTheme.setStatus({ type: "whether", bool: !useTheme.$state.whether });
    let msg = value ? "已显示天气" : "已隐藏天气";
    loadMessage(msg);
};

const breadcrumbChange = (value: boolean) => {
    useTheme.setStatus({ type: "breadcrumb", bool: !useTheme.$state.breadcrumb });
    let msg = value ? "已显示面包屑" : "已隐藏面包屑";
    loadMessage(msg);
};

const breadcrumbIconChange = (value: boolean) => {
    useTheme.setStatus({ type: "breadcrumbIcon", bool: !useTheme.$state.breadcrumbIcon });
    let msg = value ? "已显示面包屑图标" : "已隐藏面包屑图标";
    loadMessage(msg);
};
</script>

<style lang="scss" scoped>
.block {
    @apply flex-center p-10px b-rd-5px w-100%;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
        background-color: #ececed !important;
        transition: all 0.3s;
    }
}

.step-block {
    @apply flex items-center justify-between mb-10px;
}
</style>
