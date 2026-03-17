<script>
  export let title = "Wikidata-Kontext"
  export let qid = ""
  export let height = "45vh"

  let iframeSrc = ""

  function buildQuery(qid) {
    return `SELECT ?person ?personLabel ?personDescription ?birth ?death ?gnd WHERE {
  VALUES ?person { wd:${qid} }
  OPTIONAL { ?person wdt:P569 ?birth. }
  OPTIONAL { ?person wdt:P570 ?death. }
  OPTIONAL { ?person wdt:P227 ?gnd. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}`
  }

  $: if (qid) {
    const query = buildQuery(qid)
    iframeSrc = `https://query.wikidata.org/embed.html#${encodeURIComponent(query)}`
  } else {
    iframeSrc = ""
  }
</script>

{#if title}
  <h4>{title}</h4>
{/if}

{#if iframeSrc}
  <iframe
    title="Wikidata SPARQL Embed"
    src={iframeSrc}
    style={`width: 100%; height: ${height}; border: none;`}
    referrerpolicy="origin"
    sandbox="allow-scripts allow-same-origin allow-popups">
  </iframe>
{:else}
  <p>Keine Wikidata-QID vorhanden.</p>
{/if}