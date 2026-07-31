<script>
  import { getContext } from "svelte"

  export let title = "Wikidata-Kontext"
  export let uriColumn = "subjectKeyword"
  export let height = "65vh"

  const element = getContext("element")

  function buildValues(uriString) {
    if (!uriString) return ""

    const uris = uriString
      .split(";")
      .map(uri => uri.trim())
      .filter(uri => uri)

    return uris.map(uri => `<${uri}>`).join(" ")
  }

  function buildQuery(uriString) {
    const values = buildValues(uriString)

    return `#defaultView:ImageGrid
SELECT ?item ?itemLabel ?itemDescription (SAMPLE(?imageValue) AS ?image) WHERE {
  VALUES ?theme {
    ${values} 
  }
  { ?item wdt:P180 ?theme. }
  ?item wdt:P18 ?imageValue.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en,mul". }
}
GROUP BY ?item ?itemLabel ?itemDescription
ORDER BY ?item`
  }

  $: values = $element?.values || {}
  $: uriString = values[uriColumn] || ""
  $: iframeSrc = uriString
    ? `https://query.wikidata.org/embed.html#${encodeURIComponent(buildQuery(uriString))}`
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