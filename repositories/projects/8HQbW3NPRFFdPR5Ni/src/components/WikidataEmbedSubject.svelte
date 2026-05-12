<script>
  import { getContext } from "svelte"

  export let title = "Wikidata-Kontext"
  export let qidColumn = "subjectKeyword_wikidata"
  export let height = "45vh"

  const element = getContext("element")

   function buildValues(qidString) {
    if (!qidString) return ""

    const qids = qidString
      .split(";")
      .map(q => q.trim())
      .filter(q => q)

    return qids.map(q => `wd:${q}`).join(" ")
  }

  function buildQuery(qidString) {
    const values = buildValues(qidString)

    return `#defaultView:ImageGrid
SELECT DISTINCT ?item ?itemLabel ?itemDescription ?creator ?creatorLabel ?date ?image WHERE {
  VALUES ?theme {
    ${values} 
  }
  { ?item wdt:P180 ?theme. }
  UNION
  { ?item wdt:P921 ?theme. }
  UNION
  { ?item wdt:P31 ?theme. }
  UNION
  { ?item wdt:P279 ?theme. }
  ?item wdt:P18 ?image.
  OPTIONAL { ?item wdt:P170 ?creator. }
  OPTIONAL { ?item wdt:P571 ?date. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],de,en,mul". }
}
LIMIT 24`
  }

  $: values = $element?.values || {}
  $: qidString = values[qidColumn] || ""
  $: iframeSrc = qidString
    ? `https://query.wikidata.org/embed.html#${encodeURIComponent(buildQuery(qidString))}`
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