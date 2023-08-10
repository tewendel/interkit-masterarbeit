#### What the template does

This template shows a map with markers. The data comes from a database sheet. When you tap on a marker, a popup shows the data in a structured way.

#### Which parts of the system were used

The template was created by using components in the **App** section, setting up a database in the **Data** section and uploading images in the **Media** section.

#### Techniques demonstrated

- We have set up a database **Sheet** called "elements" in the Data area, and added columns for position, title, image.

- We add the **DataLoaderMulti** component inside AppBase to load data from the sheet.

- The **MapSimple** component takes the data and displays it on the map.

- The **DataCard** component has been added to the popup slot of the MapSimple component and determines how the data should be shown in the popup.

#### Next Steps

- Edit the data for an existing cat, change the location, name or image.

- Add a new cat by uploading a new image in the Media section, and creating a new row in the cats Sheet.

- Change how the MapSimple and DataCard components display the data, for example by disabling the customIconColumn setting in MapSimple to show standard markers instead of the cat images.
