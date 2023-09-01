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
    <span class="LangSwitch__Label">
      {label}
    </span>
  {/if}
  <select
    class="LangSwitch__Select"
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

  .LangSwitch__Label {
    margin-right: calc(var(--outset-x) * 0.5rem);
    align-self: center;
    position: relative;
  }

  /* https://github.com/filamentgroup/select-css/blob/master/src/select-css.css */
  .LangSwitch__Select {
    display: block;
    font: var(--font-button);
    letter-spacing: var(--letter-spacing-button);
    font-weight: normal;
    color: inherit;
    border-radius: var(--border-radius-button);
    line-height: 1rem;
    box-sizing: border-box;
    box-shadow: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: var(--color-background);
    border: var(--border-width) solid var(--color-border);
    box-shadow: var(--box-shadow);
    padding:
      calc(var(--inset-y) * 0.5rem)
      calc(var(--inset-x) * 3rem)
      calc(var(--inset-y) * 0.5rem)
      calc(var(--inset-x) * 1rem);
    position: relative;
    background-position: top right;
    background-repeat: no-repeat;
    /* note: practically impossible to have the colors here be css vars... */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg'\
      width='38' height='34' viewBox='-19 -18 38 34'%3e\
      %3cpath d='M-4 -4 L0 0 L4 -4' stroke='currentColor' stroke-width='1.1' fill='transparent'/%3e\
      %3cpath d='M-18.5 -40 L-18.5 40' stroke='currentColor' opacity='1'/%3e\
      %3c/svg%3e");
    background-size: auto 100%;
  }

  .LangSwitch__Select:focus {
    box-shadow: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.2);
  }

</style>
