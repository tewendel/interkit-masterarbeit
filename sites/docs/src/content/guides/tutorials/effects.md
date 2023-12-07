<script>
  import TemplateLoader from "../../../components/TemplateLoader.svelte";
  import InterkitComponent from '/src/components/InterkitComponent.svelte'
</script>

# Button Effects

In this tutorial, you'll get an overview of the different effects that button presses can have in interkit.

We assume you've worked through the foundation tutorials, especially the [routing](/guides/tutorials/routing) tutorial. There, you've learned how to set up a button that activates a standard **route**. And in the [data routing](/guides/tutorials/data-routing) tutorial, you learned how to use the **DataRouteSingle** effect to open the route for each row from the database.

## Data Annotations

A concept that builds on these ideas is the **setDataAnnotation** effect. Data Annotations are a way to add user specific information to rows in the database (which are the same for all users). For example, in your project you want to allow users to check off tasks or to add bookmarks to items.

Here is an example of a todo list app. 

<TemplateLoader slug="17-Todo-list/app"/>

If you look at the Buttons in the checkButton group, you'll see that they set the "checked" Data Annotation to true or false, respectively. We use the [IfDataAnnotation](/reference/components/If#ifdataannotation) component to determine which Button to show, and if we should show a checkmark or not.

![conditionals](/images/tutorial-button-effects-1.png)

In the same vein, here is an example of bookmarking functionality.

<TemplateLoader slug="18-Bookmarks/app"/>

In this template, we add the additional functionality of showing a list of bookmarked cats, using the **includeOnlyAnnotated** option in DataRouteMulti. In this way, we can show a list of just the elements that have been annotated.

## Advanced effects

There are several additional effects that buttons can have, as demonstrated in this template project.

<TemplateLoader slug="16-Buttons"/>

The advanced effects demonstrated here allow buttons to
- open a url with **linkTargetBlank**
- toggle a UIKey with **setUIKey**
- set a user variabel with **setUserVar**
- trigger an action with **actionTrigger**  

UIKeys are non-persistent, client side variables that you can use to modify the interface. For example, you can use UIKeys to manage multiple sets of tab interfaces as shown in this example.

<TemplateLoader slug="20-Tabs-multi"/>

User Variables are variables that are stored in the user database. This is useful for storing things like a user's name, or anything else that you want to process in [interactive stories or chat projects](/guides/tututorials/chat).

The actionTrigger effect triggers a custom client-side action, that can be freely programmed with javascript. See the [actions](/guides/howto/actions) howto guide for more information.

Here's an example that uses a custom action to load the next element in a scavenger hunt project:

<TemplateLoader slug="21-Scavenger-hunt"/>