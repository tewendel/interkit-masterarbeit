<script>
  import config from './App.yml'
  import moment from 'moment'

  const test = moment().format()
</script>

  
{test}
<h1>Heya {config.title.value}!</h1>

<style>
  h1 {
    color: red
  }
</style>