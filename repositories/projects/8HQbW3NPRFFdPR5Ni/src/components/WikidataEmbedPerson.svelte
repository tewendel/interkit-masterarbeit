<script>
  import { getContext } from "svelte"

  export let title = "Wikidata-Kontext"
  export let qidColumn = "personID_wikidata"
  export let height = "45vh"

  const element = getContext("element")

  function buildQuery(qid) {
    return `SELECT ?person ?personLabel ?personDescription ?birth ?death ?gnd ?pic WHERE {
  VALUES ?person { wd:${qid} }
  OPTIONAL { ?person wdt:P569 ?birth. }
  OPTIONAL { ?person wdt:P570 ?death. }
  OPTIONAL { ?person wdt:P227 ?gnd. }
  OPTIONAL { ?person wdt:P18 ?pic. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}`
  }

  $: values = $element?.values || {}
  $: qid = values[qidColumn] || ""

  $: iframeSrc = qid
    ? `https://query.wikidata.org/embed.html#${encodeURIComponent(buildQuery(qid))}`
    : ""
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