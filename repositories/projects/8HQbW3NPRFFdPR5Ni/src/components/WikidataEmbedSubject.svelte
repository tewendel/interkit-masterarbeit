<script>
  import { getContext } from "svelte"

  export let title = "Wikidata-Kontext"
  export let qidColumn = "subjectKeyword_wikidata"
  export let height = "45vh"

  const element = getContext("element")

  function buildQuery(qid) {
    return `SELECT ?subject ?subjectLabel ?subjectDescription
       ?parentTaxon ?parentTaxonLabel
       ?habitat ?habitatLabel
       ?status ?statusLabel
       ?audio
WHERE {
  VALUES ?subject { wd:${qid} }

  OPTIONAL {
    SELECT ?subject ?parentTaxon WHERE {
      VALUES ?subject { wd:${qid} }
      ?subject wdt:P171 ?parentTaxon .
    }
    LIMIT 1
  }

  OPTIONAL {
    SELECT ?subject ?habitat WHERE {
      VALUES ?subject { wd:${qid} }
      ?subject wdt:P2974 ?habitat .
    }
    LIMIT 1
  }

  OPTIONAL {
    SELECT ?subject ?status WHERE {
      VALUES ?subject { wd:${qid} }
      ?subject wdt:P141 ?status .
    }
    LIMIT 1
  }

  OPTIONAL {
    SELECT ?subject ?audio WHERE {
      VALUES ?subject { wd:${qid} }
      ?subject wdt:P51 ?audio .
    }
    LIMIT 1
  }

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