<template>
  <app-content>
    <h1>豆瓣图书列表</h1>
    <p v-if="isLoading">正在加载中</p>
    <template v-else>
      <ul v-if="list.length > 0" class="list">
        <book-item v-for="item in list" :book="item" :key="item.id"></book-item>
      </ul>
      <p v-else>暂无</p>
    </template>
  </app-content>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import bookItem from './book_item.vue';
  export default {
    async asyncData({store}){
      store.register('book');
      store.once('dispatch', 'book', 'getList');
    },
    computed: {
      ...mapState('book', ['list', 'isLoading'])
    },
    components: {
      bookItem
    }
  }
</script>
<style scoped>
  .list{list-style: none; padding: 10px; margin:0;}
</style>
