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

    return `SELECT ?subject ?subjectLabel ?subjectDescription ?parentTaxon ?parentTaxonLabel ?status ?statusLabel ?pic ?audio WHERE {
  VALUES ?subject {
    ${values} 
  }
  OPTIONAL { ?subject wdt:P171 ?parentTaxon. }
  OPTIONAL { ?subject wdt:P141 ?status. }
  OPTIONAL {
    {
      SELECT ?subject (SAMPLE(?pic0) AS ?pic) WHERE {
        VALUES ?subject { 
          ${values} 
        }
        ?subject wdt:P18 ?pic0 .
      }
      GROUP BY ?subject
    }
  }
  OPTIONAL {
    {
      SELECT ?subject (SAMPLE(?audio0) AS ?audio) WHERE {
        VALUES ?subject { 
          ${values} 
        }
        ?subject wdt:P51 ?audio0 .
      }
      GROUP BY ?subject
    }
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],de,en". }
}`
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