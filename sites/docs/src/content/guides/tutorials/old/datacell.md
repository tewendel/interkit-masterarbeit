## DataCell

This template loads richt text content from individual cells in the database and displays it on the screen.

#### Which parts of the system were used

The template was created by using components in the **App** section and by setting up a database in the **Data** section.

#### Techniques demonstrated

- We have set up a database **Sheet** called "elements" in the Data area, and added two columns ("contentKey" and "text"). 

- The **DataCell** component lets you load the content of an individual cell from the database. You need to specify the row using the contentKey, and tell the component which columns to use as key and content. If the DataCell component doesn't find the right sheets or columns, it will ask you to set them up for you.

#### Next Steps

- Change the content in the database and observe how it updates on the screen.

- Add a new row of content and add a new DataCell component to show it on the screen.

- Add a new column on the sheet and set up one of the DataCell components to load data from that new column.
