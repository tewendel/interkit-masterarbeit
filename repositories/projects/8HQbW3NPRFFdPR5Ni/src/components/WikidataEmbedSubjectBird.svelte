<script>
  import { getContext } from "svelte"

  const element = getContext("element")

  let birds = []
  let loading = false
  let queryLink = ""

  async function loadBirds(subjectKeyword) {
    if (!subjectKeyword) {
      birds = []
      queryLink = ""
      return
    }

    loading = true

    const identifiers = subjectKeyword
      .split(";")
      .map(value => value.trim())
      .filter(value => value)

    const search = identifiers
      .map(identifier => {
        const qid = identifier.match(/Q\d+/)?.[0]

        if (qid) {
          return `{ VALUES ?item { wd:${qid} } }`
        }

        const gndID = identifier.split("/").filter(Boolean).pop()
        return `{ ?item wdt:P227 "${gndID}". }`
      })
      .join(" UNION ")

    const query = `
SELECT ?item ?scientificName (SAMPLE(?imageValue) AS ?image) (SAMPLE(?audioValue) AS ?audio) WHERE {
  ${search}

  OPTIONAL { ?item wdt:P225 ?scientificName. }
  OPTIONAL { ?item wdt:P18 ?imageValue. }
  OPTIONAL { ?item wdt:P51 ?audioValue. }

}
GROUP BY ?item ?scientificName
ORDER BY ?scientificName`

    queryLink =
      "https://query.wikidata.org/#" +
      encodeURIComponent(query)

    const url =
      "https://query.wikidata.org/sparql?format=json&query=" +
      encodeURIComponent(query)

    try {
      const response = await fetch(url)
      const data = await response.json()

      birds = data.results.bindings.map(result => ({
        uri: result.item.value,
        scientificName: result.scientificName?.value,
        image: result.image?.value,
        audio: result.audio?.value,
      }))
    } catch {
      birds = []
    }

    loading = false
  }

  $: subjectKeyword = $element?.values?.subjectKeyword || ""
  $: loadBirds(subjectKeyword)
</script>

{#if loading}
  <p>Wird geladen / Loading</p>

{:else if birds.length}
  <div class="birds">
    {#each birds as bird}

      <div class="bird">
        {#if bird.image}
          <img
            src={bird.image}
            alt={bird.scientificName || "Vogel / Bird"}
            loading="lazy"
          />
        {/if}

        <div class="bird-content">
  <strong>
    <a href={bird.uri} target="_blank" rel="noreferrer">
      {bird.scientificName || "In Wikidata"}
    </a>
  </strong>

  {#if bird.audio}
    <audio controls preload="none" src={bird.audio}>
      Audiowiedergabe nicht möglich. / Audio can't be played.
    </audio>
  {/if}
</div>


      </div>
    {/each}  

    <p>
      <a href={queryLink} target="_blank" rel="noreferrer">
        SPARQL-Query
      </a>
    </p>
  </div>

{:else}
  <p>Keine Daten gefunden. / No data found.</p>
{/if}

<style>
  .birds {
    display: grid;
    gap: 0.5rem;
  }

  .bird {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .bird-content {
  flex: 1;
  min-width: 250px;
}


  img {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }

  audio {
  display: block;
  width: 100%;
  max-width: 350px;
  margin-top: 0.3rem;
}

  p {
    margin: 0.3rem 0;
  }
</style>