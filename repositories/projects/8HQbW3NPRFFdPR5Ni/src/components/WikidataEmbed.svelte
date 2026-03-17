<script>
  import { onMount } from 'svelte'
  import { InterkitClient } from 'interkit'

  export let qidColumn = 'personID_wikidata'
  export let sheetKey = 'exhibition'
  export let rowKey = ''
  export let title = 'Wikidata-Kontext'
  export let width = '100%'
  export let height = '50vh'

  let rowStore
  let row
  let qid = ''
  let iframeSrc = ''
  let error = ''

  function normalizeQid(value) {
    if (!value) return ''

    const trimmed = String(value).trim()

    // akzeptiert Q538534
    if (/^Q\d+$/i.test(trimmed)) {
      return trimmed.toUpperCase()
    }

    // akzeptiert volle Wikidata-URI wie https://www.wikidata.org/wiki/Q538534
    const match = trimmed.match(/Q\d+/i)
    if (match) {
      return match[0].toUpperCase()
    }

    return ''
  }

  function buildQuery(qid) {
    return `SELECT ?person ?personLabel ?personDescription ?birth ?death ?gnd WHERE {
  VALUES ?person { wd:${qid} }
  OPTIONAL { ?person wdt:P569 ?birth. }
  OPTIONAL { ?person wdt:P570 ?death. }
  OPTIONAL { ?person wdt:P227 ?gnd. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}`
  }

  function buildEmbedUrl(query) {
    return `https://query.wikidata.org/embed.html#${encodeURIComponent(query)}`
  }

  async function loadRow() {
    try {
      error = ''

      if (!rowKey) {
        error = 'Kein rowKey übergeben.'
        return
      }

      rowStore = await InterkitClient.getRowStore(sheetKey, rowKey)
    } catch (e) {
      error = 'Datensatz konnte nicht geladen werden.'
      console.error(e)
    }
  }

  onMount(async () => {
    await loadRow()
  })

  $: if (rowStore) {
    row = $rowStore
  }

  $: if (row && row.values) {
    qid = normalizeQid(row.values[qidColumn])
  }

  $: if (qid) {
    const query = buildQuery(qid)
    iframeSrc = buildEmbedUrl(query)
  } else {
    iframeSrc = ''
  }
</script>

{#if title}
  <h3>{title}</h3>
{/if}

{#if error}
  <p>{error}</p>
{:else if !qid}
  <p>Keine gültige Wikidata-QID gefunden.</p>
{:else}
  <iframe
    title="Wikidata SPARQL Embed"
    src={iframeSrc}
    style={`width: ${width}; height: ${height}; border: none;`}
    referrerpolicy="origin"
    sandbox="allow-scripts allow-same-origin allow-popups">
  </iframe>
{/if}