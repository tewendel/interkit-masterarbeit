<script>
  import TemplateLoader from "../../../components/TemplateLoader.svelte";
  import InterkitComponent from '/src/components/InterkitComponent.svelte'
</script>

# Working with Media

In this tutorial, you will learn the basics of with various kinds of media in a series of short excersises.

We assume you've worked through the foundation tutorials.

## Images 

There are a many different ways to display images in interkit. Commonly, you would leave this up the components such as [DataCard](/reference/components/DataCard). But sometimes you want to display just an individual image.

- Start with an empty project. 
- Go to the **Media** tab and upload an image file. It shoulld be under a 100kb in size and of type jpg or png.
- Copy the key of the image to the clipboard.
- Head to the **App** tab and drag an <InterkitComponent name="Image" /> component into AppBase.
- Open the Image settings and paste the media file key in.
- Click update and save the workspace to see if the image displays

Advanced: Set a height of 200px in the Image component and obersve that your imaged will be stretched. Now head back to the **Media** tab and change the **fit** properties of the image to see different options (cover, contain...) how the image can be adjusted to fit into predefined space.

Sometimes it is not practical to reference a media file key for each image. If you have added images to database columns, you can also specify an imageColumn and use a DataLoader to load the image via a database row. See the [Data Loading](/guides/tutorials/data) tutorial for more information.

## Videos

Currently, interkit supports playing videos in a full screen player at the press of a button. 

Drag a [VideoButton](/reference/components/VideoButton) component into your workspace.

In the settings of the button, you can choose where the video should be loaded from:
- through a database column referencing a video file that you uploaded
- directly through a mediafile Key of a video file you uploaded
- through a database column that contains the link to a video hosted on Vimeo
- directly from a Vimeo url

For longer videos, we recommend using Vimeo. For shorter videos, or if you want to avoid external services, you can upload them into your media library.

You can specify options for the button, or drag in an <InterkitComponent name="Icon" /> component.

## Audio

interkit supports an inline audio player that works like a button, and a floating player that you can position above a bottom menu using [LayoutShellAudio](/reference/components/Shell#layoutshellaudio). 

See this template for an example of both approaches:

<TemplateLoader slug="13-AudioPlayer/app"/>

As you can see, the [PopoutAudioButton](/reference/components/AudioPlayer#popoutaudiobutton) is necessary to trigger the floating [AudioPlayer](/reference/components/AudioPlayer) component to appear. We recommend playinc the AudioPlayer in a Group and use the GroupConnector to decide on which screens you want it to appear.

## AR

interkit supports the native iOS and Android Augmented Reality (AR) players that can be accessed via the web platform. 

To show an AR object, you'll need to upload to the **media** library: 
- a glb file 
- a usdz file
- a png thumbnail 
- optional: a fallback video for devices that don't support AR

Then create a database sheet with columns for each of there assets and reference the columns in the [ARViewer](/reference/components/ARViewer) component.

See this template for an example:

<TemplateLoader slug="14-ARViewer/app"/>

## QR

There are a variety of ways to use QR Scanners in projects. See the [QRScanner](/reference/components/QRScanner) component documentation to see how interkit's built in QR code scanner works.

Here is an exmaple template that uses the QR Scanner to open a detail view that shows information about an element:

<TemplateLoader slug="15-QRScanner-simple/app"/>

You'll need to create your own QR Codes out of the codes you set in the qrKey column in the example. There are a lot of web services that allow this, for example: https://www.qr-code-generator.com/