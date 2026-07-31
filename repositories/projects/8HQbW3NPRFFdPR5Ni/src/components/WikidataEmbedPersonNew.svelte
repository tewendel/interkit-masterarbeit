<script>
  import { getContext } from "svelte"

  const element = getContext("element")

  let person = null
  let loading = false
  let queryLink = ""

  async function loadPerson(personID) {
    if (!personID) {
      person = null
      queryLink = ""
      return
    }

    loading = true

    const qid = personID.match(/Q\d+/)?.[0]
    const gndID = personID.split("/").filter(Boolean).pop()

    const search = qid
      ? `VALUES ?person { wd:${qid} }`
      : `?person wdt:P227 "${gndID}".`

    const query = `
SELECT ?person ?personLabel ?birth ?death ?birthPlaceLabel ?image WHERE {
  ${search}

  OPTIONAL { ?person wdt:P569 ?birth. }
  OPTIONAL { ?person wdt:P570 ?death. }
  OPTIONAL { ?person wdt:P19 ?birthPlace. }
  OPTIONAL { ?person wdt:P18 ?image. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en,mul". }  
}
LIMIT 1`

    queryLink =
      "https://query.wikidata.org/#" +
      encodeURIComponent(query)

    const url =
      "https://query.wikidata.org/sparql?format=json&query=" +
      encodeURIComponent(query)

    try {
      const response = await fetch(url)
      const data = await response.json()
      const result = data.results.bindings[0]

      person = result
        ? {
            uri: result.person.value,
            name: result.personLabel.value,
            birth: result.birth?.value.slice(0, 4),
            death: result.death?.value.slice(0, 4),
            birthPlace: result.birthPlaceLabel?.value,
            image: result.image?.value
          }
        : null
    } catch {
      person = null
    }

    loading = false
  }

  $: personID = $element?.values?.personID || ""
  $: loadPerson(personID)
</script>

{#if loading}
  <p>Laden / Loading</p>

{:else if person}
  <div class="person">
    {#if person.image}
      <img src={person.image} alt={person.name} />
    {/if}

    <div>
      <strong>
        <a href={person.uri} target="_blank" rel="noreferrer">
          {person.name}
        </a>
      </strong>

      {#if person.birth || person.death}
        <p>* {person.birth || "–"} &nbsp; † {person.death || "–"}</p>
      {/if}

      {#if person.birthPlace}
        <p>{person.birthPlace}</p>
      {/if}

      {#if queryLink}
        <p>
          <a href={queryLink} target="_blank" rel="noreferrer">
            SPARQL-Query
          </a>
        </p>
      {/if}
    </div>
  </div>

{:else}
  <p>Keine Daten gefunden. / No data found.</p>

  {#if queryLink}
    <p>
      <a href={queryLink} target="_blank" rel="noreferrer">
        SPARQL-Query
      </a>
    </p>
  {/if}
{/if}

<style>
  .person {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  img {
    width: 100px;
    height: 130px;
    object-fit: cover;
  }

  p {
    margin: 0.4rem 0;
  }
</style>