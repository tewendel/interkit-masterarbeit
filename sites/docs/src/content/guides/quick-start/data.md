<script>
  import TemplateLoader from "../../../components/TemplateLoader.svelte";
</script>

# Working with Data

Interkit provides each app with a database.

This database can store the different elements that will be used in the app.

Examples:
- Objects that can be found in places in the city
- Artworks to discover in the exhibition
- Places to visit

![Example elements sheet](/images/elements_sheet.png "Example elements sheet")

### Structure of the data

Data in interkit is organised into `sheets`, representing the different types of elements you want to use in your app, for example Artworks.

Each `sheet` is structured into `columns` and `rows`.

You can think of each `row` as an individual element, with the `columns` representing different attributes. For example each Artwork might need a title, a description and an image.

### Working with columns

You can add columns to a sheet by clicking on the ... menu on the top right in the sheet header.

Click on the column title to edit, move or remove it.

Each column has a certain type, depending on what kind of data it should hold. The available types are:
- **String** for short unformatted text
- **Number** for numbers
- **Richtext** for longer text with headlines, links and paragraphs
- **Media** for Images, Audio or Video files, and AR content
- **Location** for locations on the map
- **SheetRef** for referencing data in other sheets

### Updating data

Use the **Add Row** button at the bottom to add a new row to a sheet.

Click into the individual cells to edit the data stored at each position.

Interkit provides a real-time database, meaning changes are displayed immedeately in your app. 

The **Row Key** is a unique identifier for each row that you can use in some components.

Use the ... menu for each row to remove a row.

### Explore further

See the [Data tutorial](/guides/tutorial/data) for an in depth look at how to work with data in your App.