<script>

  import { InterkitClient, util } from '../'
  import { setUserLang, langs, lang, translations } from '../i18n.js'
  import { get } from 'svelte/store';

  export let label
  export let reloadAfterSwitch

  let userProjectData = InterkitClient.userProjectDataStore
  let showLang
  // $: if ($userProjectData.lang) lang = $userProjectData.lang
  userProjectData.subscribe(data => {
    console.log('i18n LangSwitch component, userProjectData sub, set lang?', data)
    if (data && data.lang) {
      showLang = data.lang
    }
  })

  const setLang = async (event) => {
    console.log('i18n LangSwitch component setLang', event.target.value)
    showLang = '...'
    try {
      await setUserLang(event.target.value)
      if (reloadAfterSwitch === 'yes') document.location.reload()
    } catch (err) {
      window.alert(err)
    }
  }

</script>

<label class="LangSwitch">
  {#if label}
    <span class="LangSwitch_label">
      {label}
    </span>
  {/if}
  <select
    class="LangSwitch_select"
    on:input={setLang}
    value={showLang}>
    {#if !showLang}
      <option value="...">...</option>
    {/if}
    {#if $langs}
      {#each $langs as l}
        <option value={l}>{ $translations?.[l]?.['$_LangSwitchLanguageOptionLabel'] || l }</option>
      {/each}
    {/if}
  </select>
</label>

<style>

  .LangSwitch {
    display: flex;
  }

  .LangSwitch_label {
    margin-right: 0.5em;
    align-self: center;
  }

  /* https://github.com/filamentgroup/select-css/blob/master/src/select-css.css */
  .LangSwitch_select {
    display: block;
    font: var(--font-button);
    font-weight: normal;
    color: inherit;
    border-radius: var(--border-radius-button);
    line-height: 16px;
    box-sizing: border-box;
    box-shadow: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding-top: var(--distance-s);
    padding-bottom: var(--distance-s);
    padding-right: var(--distance-xl);
    padding-left: var(--distance-m);
    position: relative;
    background-position: top right;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg'\
      width='38' height='34' viewBox='-19 -18 38 34'%3e\
      %3cpath d='M-4 -4 L0 0 L4 -4' stroke='black' stroke-width='1.1' fill='transparent'/%3e\
      %3cpath d='M-18.5 -40 L-18.5 40' stroke='black' opacity='0.2'/%3e\
      %3c/svg%3e");
  }

  .LangSwitch_select:focus {
    box-shadow: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.2);
  }

</style>
