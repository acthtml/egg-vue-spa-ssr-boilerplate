<template>
  <div id="app">
    <app-wrapper>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </app-wrapper>
  </div>
</template>
<script>
export default {}
</script>


