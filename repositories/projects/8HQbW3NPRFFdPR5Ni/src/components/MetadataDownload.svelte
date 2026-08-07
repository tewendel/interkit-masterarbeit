<script>
  import { InterkitClient } from "interkit"

  export let sheetKey = "elements"
  export let label = "Metadaten als CSV herunterladen"
  export let filename = "fuer-die-voegel_metadaten.csv"

  let error = ""

  const sourceFields = [
    "recordID",
    "objectTitle$de",
    "objectTitle$en",
    "objectType",
    "inventoryNumber",
    "objectDescription$de",
    "objectDescription$en",

    "materialsTechniquesDisplay$de",
    "materialsTechniquesDisplay$en",
    "materials",
    "techniques",

    "measurementsDisplay$de",
    "measurementsDisplay$en",
    "measurements_height_cm",
    "measurements_width_cm",
    "measurements_depth_cm",
    "measurements_duration_min",

    "eventType",
    "person",
    "personID",
    "dateDisplay$de",
    "dateDisplay$en",
    "earliestDate",
    "latestDate",

    "subjectKeyword",
    "subjectKeywordDisplay$de",
    "subjectKeywordDisplay$en",

    "institution$de",
    "institution$en",
    "institutionID",

    "creditline$de",
    "creditline$en"
  ]

  const extraFields = [
    "recordLanguage",
    "recordType",
    "recordTypeURI",
    "recordSource1",
    "recordSource1URI",
    "recordSource2",
    "recordSource2URI",
    "metadataRights",
    "metadataRightsURI",
    "recordMetadataDate"
  ]

  const fields = [...sourceFields, ...extraFields]

  const decimalFields = [
    "measurements_height_cm",
    "measurements_width_cm",
    "measurements_depth_cm",
    "measurements_duration_min"
  ]

  function format(field, value) {
    if (value == null) return ""

    let text = String(value)

    if (decimalFields.includes(field)) {
      text = text.replace(".", ",")
    }

    return text
  }

  function csv(value) {
    return `"${String(value ?? "")
      .replace(/\r?\n/g, " ")
      .replace(/"/g, '""')}"`
  }

  async function downloadMetadata() {
    error = ""

    try {
      const rows = await InterkitClient.getRows(sheetKey)

      const date = new Date().toISOString().slice(0, 10)

      const records = rows
        .map(row => row.values)
        .filter(row => row?.recordID)
        .map(row => ({
          ...row,

          recordLanguage: "de",

          recordType: "Einzelobjekt",
          recordTypeURI:
            "http://terminology.lido-schema.org/lido00141",

          recordSource1:
            "Johannes Gutenberg-Universität Mainz",
          recordSource1URI:
            "http://d-nb.info/gnd/2024320-0",

          recordSource2:
            "Hochschule Mainz",
          recordSource2URI:
            "http://d-nb.info/gnd/1063654211",

          metadataRights: "CC0 1.0 Universal",
          metadataRightsURI:
            "https://creativecommons.org/publicdomain/zero/1.0/",

          recordMetadataDate: date
        }))

      const header = fields.map(csv).join(";")

      const data = records.map(record =>
        fields
          .map(field => csv(format(field, record[field])))
          .join(";")
      )

      const content =
        "\uFEFF" + [header, ...data].join("\r\n")

      const blob = new Blob(
        [content],
        { type: "text/csv;charset=utf-8;" }
      )

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = filename
      link.click()

      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      error = "Die Metadaten konnten nicht exportiert werden."
    }
  }
</script>

<button on:click={downloadMetadata}>
  {label}
</button>

{#if error}
  <p>{error}</p>
{/if}

<style>
  .metadata-download {
    width: 100%;
  }

  button {
    width: 100%;
    padding: 0.9rem 1.1rem;
    font: inherit;
    font-weight: bold;
    cursor: pointer;
    border: 1px solid;
  }

  button:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  .error {
    margin-top: 0.75rem;
    font-size: 0.9rem;
  }
</style>