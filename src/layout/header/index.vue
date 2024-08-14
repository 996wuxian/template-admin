<template>
    <div class="header theme-page">
        <div
            class="header-block"
            @click="changeSide"
            v-if="layout === 'left_menu' || layout === 'left_menu_mixin'"
        >
            <i i-solar-mirror-right-bold v-if="sideWidth > sideFoldWidth"></i>
            <i i-solar-mirror-left-bold v-else></i>
        </div>
        <n-breadcrumb
            class="m-t-4px"
            v-if="breadcrumb && layout !== 'top_menu' && layout !== 'top_menu_mixin'"
        >
            <n-breadcrumb-item v-for="(item, index) in crumb" :key="index">
                <div class="flex items-center">
                    <i
                        :class="item.icon"
                        class="m-r-5px m-b-3px"
                        v-if="breadcrumbIcon"
                    ></i>
                    {{ item.name }}
                </div>
            </n-breadcrumb-item>
        </n-breadcrumb>

        <Aside
            v-if="layout === 'top_menu' || layout === 'top_menu_mixin'"
            mode="horizontal"
            :collapsed="false"
        />

        <div class="header-block m-l-auto" @click="toggleFullscreen">
            <i i-solar-maximize-square-minimalistic-outline v-if="!isFullscreen"></i>
            <i i-solar-minimize-square-minimalistic-linear v-else></i>
        </div>
        <div class="header-block">
            <i
                i-solar-palette-bold-duotone
                class="m-l-auto"
                @click="drawerShow = true"
            ></i>
        </div>
        <div class="header-block">
            <ThemeToggler />
        </div>
        <n-dropdown
            trigger="click"
            :options="options"
            :show-arrow="true"
            :render-icon="renderIcon"
            @select="(key: any) => key === 'loginOut' && loginOut()"
        >
            <div class="header-block">
                <i i-solar-user-bold-duotone class="w-20px h-20px"></i>
                <span class="mx-10px">{{ userInfo.roleName }}</span>
                <i i-solar-alt-arrow-down-bold-duotone></i>
            </div>
        </n-dropdown>
    </div>

    <Drawer :show="drawerShow" title="主题配置" @close="close" />
</template>

<script setup lang="ts">
import { h } from "vue";
import { useHeaderStore } from "./store/index";
import { useRoute } from "vue-router";
import { NIcon } from "naive-ui";
import Drawer from "./components/drawer.vue";
import { useFullscreen } from "@/utils/fullScrenn";
import ThemeToggler from "@/components/custom/theme-toggler.vue";
import useuseTheme from "@/stores/modules/theme";
import Aside from "../aside/index.vue";
import useUserStore from "@/stores/modules/user";

const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();
const useTheme = useuseTheme();
const userStore = useUserStore();
const sideWidth = computed(() => useTheme.$state.sideWidth);
const oldSideWidth = computed(() => useTheme.$state.oldSideWidth);
const sideFoldWidth = computed(() => useTheme.$state.sideFoldWidth);
const layout = computed(() => useTheme.$state.layout);
const route = useRoute();
const crumb = computed(() =>
    removeDuplicatesByName(
        route.matched.map((item: any) => {
            return { name: item.meta.title, path: item.path, icon: item.meta.icon };
        })
    )
);
const whether = computed(() => useTheme.$state.whether);
const breadcrumb = computed(() => useTheme.$state.breadcrumb);
const breadcrumbIcon = computed(() => useTheme.$state.breadcrumbIcon);
const userInfo = computed(() => userStore.$state.userInfo);
const toggleFullscreen = () => {
    if (isFullscreen.value) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
};

const { drawerShow, loginOut } = useHeaderStore();

const changeSide = () => {
    useTheme.setSize({
        type: "sideWidth",
        size:
            sideWidth.value > sideFoldWidth.value
                ? sideFoldWidth.value
                : oldSideWidth.value,
    });
};

const removeDuplicatesByName = (arr: any) => {
    const nameMap = new Map();

    for (const item of arr) {
        if (!nameMap.has(item.name)) {
            nameMap.set(item.name, item);
        }
    }

    return Array.from(nameMap.values());
};

const close = () => {
    drawerShow.value = false;
};

const options = [
    {
        label: "退出登录",
        key: "loginOut",
        icon: "i-solar-logout-3-bold-duotone",
    },
];

function renderIcon(option: any) {
    if (option.icon) {
        return h(NIcon, {
            class: `${option.icon}`,
        });
    } else {
        return null;
    }
}
</script>

<style scoped lang="scss">
.header {
    @apply flex flex-items-center w-100% h-100% px-20px;
    border-bottom: 1px solid #ebebeb;

    &-block {
        @apply flex-center p-10px b-rd-5px m-r-20px;
        transition: all 0.3s;
        cursor: pointer;

        &:last-child {
            @apply m-r-0px;
        }

        &:hover {
            background-color: #ececed !important;
            transition: all 0.3s;
            color: #409eff;

            i {
                color: #409eff;
                transition: all 0.3s;
            }
        }
    }

    i {
        display: inline-block;
        @apply w-18px h-18px;
        transition: all 0.3s;
    }
}

.whether {
    @apply flex m-l-auto m-t-4px items-center;
    @media (min-width: 0) and (max-width: 1320px) {
        display: none;
    }
}
</style>
