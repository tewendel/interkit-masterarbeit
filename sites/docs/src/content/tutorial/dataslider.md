## DataSlider

#### What the template does

This template loads a list of structured content from a database sheet and displays it as a slider on the screen.

#### Which parts of the system were used

The template was created by using components in the **App** section, setting up a database in the **Data** section and uploading images in the **Media** section.

#### Techniques demonstrated

- We have set up a database **Sheet** called "elements" in the Data area, and added columns for name, image and a comment.

- We have uploaded cat images in the **Media** section and selected the right image for each cat in the sheet.

- We load the data using the **DataLoaderMulti** component.

- The **DataSlider** component takes this data and displays it as a list. We can use **StaticText** to display a message when there is no data.

- The **DataCardLarge** component determines how each entry in the list should be displayed.

#### Next Steps

- Edit the data for an existing cat.

- Add a new cat by uploading a new image in the Media section, and creating a new row in the cats Sheet.

- Hook up different columns in the DataCardSmall component to switch where the name and comment are displayed.

- Add a description column in the database and use **DataCell** to show the description under each cat.