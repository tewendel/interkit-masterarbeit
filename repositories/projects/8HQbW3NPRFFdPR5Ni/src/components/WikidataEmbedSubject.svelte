<script>
  import { getContext } from "svelte"

  export let title = "Wikidata-Kontext"
  export let qidColumn = "subjectKeyword_wikidata"
  export let height = "65vh"

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
SELECT DISTINCT ?item ?itemLabel ?itemDescription (SAMPLE(?imageValue) AS ?image) WHERE {
  VALUES ?theme {
    ${values} 
  }
  { ?item wdt:P180 ?theme. }
  UNION
  { ?item wdt:P921 ?theme. }
  ?item wdt:P18 ?imageValue.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en,mul". }
}
GROUP BY ?item ?itemLabel ?itemDescription
ORDER BY ?item`
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
    title={title || "Wikidata-Ergebnisse"}
    src={iframeSrc}
    loading="lazy"
    style={`
      display: block;
      width: 100%;
      height: ${height};
      min-height: 520px;
      border: none;
    `}
    referrerpolicy="no-referrer"
    sandbox="allow-scripts allow-same-origin allow-popups">
  </iframe>
{:else}
  <p>Keine gültige Wikidata-URI vorhanden.</p>
{/if}