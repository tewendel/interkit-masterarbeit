## DataList

#### What the template does

This template loads a list of structured content from a database sheet and displays it as a scrollable list on the screen.

#### Which parts of the system were used

The template was created by using components in the **App** section, setting up a database in the **Data** section and uploading images in the **Media** section.

#### Techniques demonstrated

- We have set up a database **Sheet** called "cats" in the Data area, and added columns for name, image and a comment.

- We have uploaded cat images in the **Media** section and selected the right image for each cat in the sheet.

- We add a **ScrollContainer** inside AppBase to allow scrolling.

- We load the data using the **DataLoaderMulti** component.

- The **DataList** component takes this data and displays it as a list. We can use **StaticText** to display a message when there is no data.

- The **DataCard** component determines how each entry in the list should be displayed.

#### Next Steps

- Edit the data for an existing cat.

- Add a new cat by uploading a new image in the Media section, and creating a new row in the cats Sheet.

- Play with the different size options in the DataCard component

- Try out the DummyData mode (options below the preview) to see the capabilities of the DataCard component.

- Hook up different columns in the DataCard component to switch where the name and comment are displayed.

