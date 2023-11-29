# Content Moderation and Monitoring

Content Moderation and Monitoring become important when you allow users to input information or media that are then shown to others. For example, you might create multi-user chat rooms, where users can talk to each other and upload images.

#### The Users list

Select the Project tab in the top bar and then open the users section to see a list of all the users that have engaged with your app. Note that this list is only populated if you activate user management using a Login component, for example [AnonymousLogin](/reference/components/AnonymousLogin). Otherwise, no user data is collected.

Use the search bar at the top to find individual users by different attributes, for example which node they are currently at on a board.

Mark indiviudal or groups of users with the checkboxes to show options. There are several ways to interact with users as a moderator. You can:
- move them to another node, for example to move them into a restricted area
- send them a message, for example to warn them of bad behaviour
- see and edit variables associated with a user
- preview the app from the perspective of a user 
- block a user, to prevent them from interacting further with the chat
- unblock a user 

Please note that users can create a new users by clearing their browser cache and reloading the app. We currently do not have a way to block users by IP address or other means.

#### The Messages list

Users can report users by tapping on chat bubbles and reporting them. These will be marked in the messages list, that you can find unser the main Project tab. 

To see just the recently reported messages, tap on the gear icon on the top right of the message list and select 'only new reports'. You can then investigate further or take action, by
- blocking or unblocking the user
- deleting the report (if the message is harmless)

#### The Media tab

The Media tab provides a special section where the user uploaded media appears. You can filter by the node and board where it was uploaded from, or by userID to find media uploaded by a specific user.

#### Data

If your project allows users to add information to database Sheets, you will also have to monitor these. It is up to you as the project author to set up a way to identify and monitor users in this case.

#### The Story editor

Inside the story editor, you can see users' current status as gray dots on individual nodes. Hover over the dots to reveal the userIDs.
