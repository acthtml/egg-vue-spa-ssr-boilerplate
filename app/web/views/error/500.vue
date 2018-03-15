<template>
  <app-content>
    <p>500 Server Error</p>
  </app-content>
</template>
<script>
  export default {
    async asyncData({ctx, entryType}){
      if(entryType == 'server'){
        ctx.status = 500
      }
    }
  }
</script>
