<template>
  <app-content>
    <p>404 Not Found</p>
  </app-content>
</template>
<script>
  export default {
    async asyncData({ctx, entryType}){
      if(entryType == 'server'){
        ctx.status = 404
      }
    }
  }
</script>
