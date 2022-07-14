<script>

  import { InterkitClient, util } from '../'
  import { get } from 'svelte/store';

  export let foo

  let userProjectData = InterkitClient.userProjectDataStore
  let lang
  // $: if ($userProjectData.lang) lang = $userProjectData.lang
  userProjectData.subscribe(data => {
    console.log('uPD', data)
    lang = data.lang
  })

  const setLang = async (event) => {
    console.log('SET LANG', event.target.value)
    // InterkitClient.call...
    lang = '...'
    InterkitClient.call('user.updateUserProjectData', {
      userId: get(InterkitClient.userId),
      // projectId,
      key: "lang",
      value: event.target.value
    })
  }

</script>

<span>({foo})</span>
<select
  on:input={setLang}
  value={lang}>
  <option value="...">...</option>
  <option value="en">en</option>
  <option value="de">de</option>
</select>
