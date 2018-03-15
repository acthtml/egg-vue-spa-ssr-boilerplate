<template>
  <app-content>
    <p>401 Unauthorized</p>
  </app-content>
</template>
<script>
  export default {
    async asyncData({ctx, entryType}){
      if(entryType == 'server'){
        ctx.status = 401
      }
    }
  }
</script>
