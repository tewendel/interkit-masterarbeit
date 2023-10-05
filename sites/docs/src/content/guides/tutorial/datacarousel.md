## DataCarousel

#### What the template does

This template loads a list of structured content from a database sheet and displays it as a carousel on the screen that you can slide left and right.

#### Which parts of the system were used

The template was created by using components in the **App** section, setting up a database in the **Data** section and uploading images in the **Media** section.

#### Techniques demonstrated

- We have set up a database **Sheet** called "elements" in the Data area, and added columns for name, image and a comment.

- We have uploaded cat images in the **Media** section and selected the right image for each cat in the sheet.

- We load the data using the **DataLoaderMulti** component.

- The **DataCarousel** component takes this data and displays it as a carousel. We can use **StaticText** to display a message when there is no data.

- The **DataCard** component determines how each entry in the carousel should be displayed.

#### Next Steps

- Edit the data for an existing cat.

- Add a new cat by uploading a new image in the Media section, and creating a new row in the cats Sheet.

- Hook up different columns in the DataCard component to switch where the name and comment are displayed (turn on the DummyData mode in the preview settings to see what is available on DataCard)

- Add a description column in the database and use **DataCell** to show the description under each cat.