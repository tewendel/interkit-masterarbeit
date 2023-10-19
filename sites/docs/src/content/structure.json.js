export const items = [
  {
    title: "Guides",
    path: "/guides",
    items: [
      {
        title: 'Overview',
        path: 'overview',
        open: true,
        items: [
          {
            title: 'Welcome',
            path: '/guides/overview/welcome'
          },
          {
            title: 'What is interkit?',
            path: '/guides/overview/what-is-interkit'
          },
          {
            title: 'Interface Tour',
            path: '/guides/overview/interface_overview'
          },
          {
            title: 'The Process of Creating an App',
            path: '/guides/overview/build_app'
          },
        ]
      },

      {
        title: 'Quick Start',
        path: 'quick-start',
        open: false,
        items: [
          {
            title: 'Creating and Managing Projects',
            path: '/guides/quick-start/projects'
          },
          {
            title: 'Working with Data',
            path: '/guides/quick-start/data'
          },
          {
            title: 'Building an App with Components',
            path: '/guides/quick-start/components'
          },
          {
            title: 'Changing the Appearance of your App',
            path: '/guides/quick-start/styling'
          },
          {
            title: 'Getting started with Chatbots',
            path: '/guides/quick-start/chat'
          },
          {
            title: 'Content Moderation',
            path: '/guides/quick-start/moderation'
          },
        ]
      },
      
      {
        title: 'Tutorials',
        path: 'tutorial',
        open: false,
        items: [
          {
            title: 'Intro',
            path: '/guides/tutorial/intro'
          },
          {
            title: 'Hello World',
            path: '/guides/tutorial/hello-world'
          },
          {
            title: 'Loading Data',
            path: '/guides/tutorial/data'
          },
          {
            title: 'Routing',
            path: '/guides/tutorial/routing'
          },
          {
            title: 'Combinding Data and Routing',
            path: '/guides/tutorial/data-routing'
          },
          {
            title: 'Working with Media',
            path: '/guides/tutorial/media'
          },
          {
            title: 'Button effects',
            path: '/guides/tutorial/effects'
          },
          {
            title: 'Interactive Stories and Chatbots',
            path: '/guides/tutorial/chat'
          },
          
          
        ]
      },
      {
        title: 'HowTo',
        path: 'howto',
        open: false,
        items: [
          {
            title: 'Set up your own interkit server',
            path: '/guides/howto/server_setup'
          },
          {
            title: 'Setting up a custom domain',
            path: '/guides/howto/custom_domain'
          },
          {
            title: 'Internationalization (i18n) and localization (l10n)',
            path: '/guides/howto/i18n'
          },
          {
            title: 'Adding Actions to components',
            path: '/guides/howto/actions'
          },
          {
            title: 'Build for native app and deploy to app stores',
            path: '/guides/howto/native'
          },
          {
            title: 'Setup push notifications',
            path: '/guides/howto/push_setup'
          },
          {
            title: 'Setup server cron jobs',
            path: '/guides/howto/cron_setup'
          },
          {
            title: 'Setup Raspberry Player',
            path: '/guides/howto/raspi_setup'
          },
          {
            title: 'Migrate app to vite',
            path: '/guides/howto/migrate_to_vite'
          },
        ]
      },

      {
        title: 'Contribute',
        open: false,
        items: [
          {
            title: 'Docs',
            path: '/guides/contribute/docs'
          },
          {
            title: 'Components',
            path: '/guides/contribute/components'
          },
          {
            title: 'Component CSS',
            path: '/guides/contribute/component_css'
          },
          {
            title: 'Custom Theme',
            path: '/guides/contribute/theme'
          },
          {
            title: 'Template',
            path: '/guides/contribute/template'
          }
        ]
      }



    ]
  },  
  {  
    title: "Reference",
    path: "/reference",
    items: [
      {
        title: 'System',
        path: 'system',
        open: false,
        items: [
          {
            title: 'Overview',
            path: '/reference/system/reference-overview'
          },
          {
            title: 'System Architecture',
            path: '/reference/system/system-architecture'
          },
          {
            title: 'Collection Schemas',
            path: '/reference/system/collections'
          },
          {
            title: 'Project Server',
            path: '/reference/system/project-server'
          },
          
        ]
      },

      {
        title: 'Components',
        path: 'components',
        open: false,
        items: [
          /* this is sorted alphabetically by title in Submenu.svelte */
          {
            title: 'AppBase',
            path: '/reference/components/AppBase'
          },
          {
            title: 'DesktopFallback',
            path: '/reference/components/AppBase#desktopfallback-component'
          },
          {
            title: 'AppBaseAdvanced',
            path: '/reference/components/AppBase#appbaseadvanced'
          },
          {
            title: 'Button',
            path: '/reference/components/Button'
          },
          {
            title: 'ButtonBar',
            path: '/reference/components/Button#buttonbar'
          },
          {
            title: 'Chat',
            path: '/reference/components/Chat'
          },
          {
            title: 'StoryBoardImage',
            path: '/reference/components/Chat#storyboardimage'
          },
          {
            title: 'ScrollContainer',
            path: '/reference/components/ScrollContainer'
          },
          {
            title: 'Overlay',
            path: '/reference/components/Overlay'
          },
          {
            title: 'AspectRatio',
            path: '/reference/components/AspectRatio'
          },
          {
            title: 'ContextDebugger',
            path: '/reference/components/ContextDebugger'
          },
          {
            title: 'DataLoaderSingle',
            path: '/reference/components/DataLoader#dataloadersingle'
          },
          {
            title: 'DataLoaderMulti',
            path: '/reference/components/DataLoader#dataloadermulti'
          },
          {
            title: 'DataTile',
            path: '/reference/components/DataTile'
          },
          {
            title: 'DataCell',
            path: '/reference/components/DataCell'
          },
          {
            title: 'DataCard',
            path: '/reference/components/DataCard'
          },      
          {
            title: 'DataList',
            path: '/reference/components/DataList'
          },      
          {
            title: 'DataCarousel',
            path: '/reference/components/DataList#datacarousel'
          },      
          {
            title: 'PictureBook',
            path: '/reference/components/DataList#picturebook'
          },      
          {
            title: 'Mosaic',
            path: '/reference/components/DataList#mosaic'
          },      
          {
            title: 'Group',
            path: '/reference/components/Group'
          },
          {
            title: 'GroupConnector',
            path: '/reference/components/Group#groupconnector'
          },
          {
            title: 'IfDataAnnotation',
            path: '/reference/components/If#ifdataannotation'
          },
          {
            title: 'IfUIKey',
            path: '/reference/components/If#ifuikey'
          },
          {
            title: 'IfUserVar',
            path: '/reference/components/If#ifuservar'
          },
          {
            title: 'Label',
            path: '/reference/components/Label'
          },
          {
            title: 'LangSwitch',
            path: '/reference/components/LangSwitch'
          },
          {
            title: 'ListItem',
            path: '/reference/components/ListItem'
          },
          {
            title: 'Icon',
            path: '/reference/components/Icon'
          },
          {
            title: 'Image',
            path: '/reference/components/Image'
          },
          {
            title: 'MapSimple',
            path: '/reference/components/MapSimple'
          },    
          {
            title: 'NavBar',
            path: '/reference/components/NavBar'
          },
          {
            title: 'NavButton',
            path: '/reference/components/NavBar#navbutton'
          },
          {
            title: 'MarkdownContent',
            path: '/reference/components/MarkdownContent'
          },
          {
            title: 'StoryBoardCard',
            path: '/reference/components/StoryBoard'
          },
          {
            title: 'StoryBoardsList',
            path: '/reference/components/StoryBoard#storyboardslist'
          },
          {
            title: 'ChatBoardsList',
            path: '/reference/components/StoryBoard#storyboardslist'
          },
          {
            title: 'QRScanner',
            path: '/reference/components/QRScanner'
          },
          {
            title: 'StaticText',
            path: '/reference/components/StaticText'
          },
          {
            title: 'TextFormat',
            path: '/reference/components/TextFormat'
          },
          
          {
            title: 'Spacing',
            path: '/reference/components/Spacing'
          },
          {
            title: 'TabBar',
            path: '/reference/components/TabBar'
          },
          {
            title: 'Tab',
            path: '/reference/components/TabBar#tab'
          },
          {
            title: 'AccordeonShell',
            path: '/reference/components/AccordeonShell'
          },
          {
            title: 'Absolute',
            path: '/reference/components/Absolute'
          },
          {
            title: 'BottomBarShell',
            path: '/reference/components/Shell#bottombarshell'
          },
          {
            title: 'ColumnShell',
            path: '/reference/components/HorizontalSpacer#columnshell'
          },
          {
            title: 'HorizontalSpacer',
            path: '/reference/components/HorizontalSpacer'
          },
          {
            title: 'LayoutShell',
            path: '/reference/components/Shell#layoutshell'
          },
          {
            title: 'LayoutShellAudio',
            path: '/reference/components/Shell#layoutshellaudio'
          },
          {
            title: 'TopBarShell',
            path: '/reference/components/Shell#topbarshell'
          },
          {
            title: 'Overlay',
            path: '/reference/components/Overlay'
          },
          {
            title: 'OverlayFull',
            path: '/reference/components/Overlay#overlayfull'
          },
          {
            title: 'SectionShell',
            path: '/reference/components/SectionShell'
          },
          {
            title: 'ExternalMapAppButton',
            path: '/reference/components/ExternalMapAppButton'
          },
          {
            title: 'MapSimple',
            path: '/reference/components/MapSimple'
          },
          {
            title: 'MapViewButton',
            path: '/reference/components/MapViewButton'
          },
          {
            title: 'ARViewer',
            path: '/reference/components/ARViewer'
          },
          {
            title: 'AudioPlayer',
            path: '/reference/components/AudioPlayer'
          },
          {
            title: 'InlineAudioButton',
            path: '/reference/components/AudioPlayer#inlineaudiobutton'
          },
          {
            title: 'PopoutAudioButton',
            path: '/reference/components/AudioPlayer#popoutaudiobutton'
          },
          {
            title: 'VideoButton',
            path: '/reference/components/VideoButton'
          },
          {
            title: 'CenterModal',
            path: '/reference/components/Modal#centermodal'
          },
          {
            title: 'SlideInModal',
            path: '/reference/components/Modal#slideinmodal'
          },
          {
            title: 'Snackbar',
            path: '/reference/components/Modal#snackbar'
          },
          {
            title: 'ChatRoute',
            path: '/reference/components/Route#chatroute'
          },
          {
            title: 'DataRouteMulti',
            path: '/reference/components/Route#dataroutemulti'
          },
          {
            title: 'DataRouteSingle',
            path: '/reference/components/Route#dataroutesingle'
          },
          {
            title: 'Route',
            path: '/reference/components/Route#route'
          },
          {
            title: 'RouteConnector',
            path: '/reference/components/Route#routeconnector'
          },
          {
            title: 'Styling',
            path: '/reference/components/Styling'
          },
          {
            title: 'AnonymousLogin',
            path: '/reference/components/AnonymousLogin'
          },
          {
            title: 'UserCard',
            path: '/reference/components/UserCard'
          },
          {
            title: 'UserVarSwitch',
            path: '/reference/components/UserVarSwitch'
          },
          
          
        ]
      },
      
      {
        title: 'Chat',
        path: 'chat',
        open: false,
        items: [
          {
            title: 'Story programming cheatsheet',
            path: '/reference/chat/story_cheatsheet'
          },
        ]
      },
      
    ]
  }
];
