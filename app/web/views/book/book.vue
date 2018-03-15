<template>
  <app-content>
    <template v-if="book">
      <h1>{{book.title}}</h1>
      <img :src="book.image" alt="">
      <h3>{{book.author.join(',')}}</h3>
      <div class="summary">
        {{book.summary}}
      </div>
    </template>
    <p v-else>暂无此书</p>
  </app-content>
</template>
<script>
  import {mapState} from 'vuex';
  export default {
    async asyncData({store}){
      store.register('book');
      store.once('dispatch', 'book', 'getList');
    },
    computed: {
      ...mapState('book', ['list']),
      book(){
        this.id = this.$route.params.id;
        let data = null;

        for(let i = 0; i < this.list.length; i++){
          if(this.list[i].id == this.id){
            data = this.list[i];
            break;
          }
        }
        return data;
      }
    }
  }
</script>
