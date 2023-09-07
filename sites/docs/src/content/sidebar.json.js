export const items = [
  {
    title: 'Basics',
    path: 'basics',
    open: true,
    items: [
      {
        title: 'Introduction',
        path: '/'
      },
      {
        title: 'Interface Overview',
        path: '/basics/interface_overview'
      },
      {
        title: 'How to start',
        path: '/basics/build_app'
      },
      {
        title: 'Working with Data and Components',
        path: '/basics/elements'
      }
    ]
  },
  {
    title: 'Tutorial',
    path: 'tutorial',
    open: false,
    items: [
      {
        title: 'Intro',
        path: '/tutorial/intro'
      },
      {
        title: '1: Hello World',
        path: '/tutorial/hello-world'
      },
      {
        title: '2: DataCell',
        path: '/tutorial/datacell'
      },
      {
        title: '3: DataList',
        path: '/tutorial/datalist'
      },
      {
        title: '4: DataCarousel',
        path: '/tutorial/datacarousel'
      },
      {
        title: '5: Map basics',
        path: '/tutorial/map-basics'
      },
      {
        title: '6: Chat basics',
        path: '/tutorial/chat-basics'
      },
      {
        title: '7: Bottom Menu',
        path: '/tutorial/bottom-menu'
      },
      {
        title: '8: Top Menu',
        path: '/tutorial/top-menu'
      },
      {
        title: '9: Tabs Simple',
        path: '/tutorial/tabs-simple'
      },
      /* medium */
      {
        title: '10: DataList with Detail View',
        path: '/tutorial/datalist-detail-view'
      },
      {
        title: '11: Chat multi',
        path: '/tutorial/chat-multi'
      },
      {
        title: '12: DataList + Map + Detail View',
        path: '/tutorial/datalist-map-detail'
      },
      {
        title: '13: Audio Player',
        path: '/tutorial/audio-player'
      },
      {
        title: '14: AR Viewer',
        path: '/tutorial/ar-viewer'
      },
      {
        title: '15: QR Scanner simple',
        path: '/tutorial/qr-scanner-simple'
      },
      {
        title: '16: Button effects',
        path: '/tutorial/button-effects'
      },
      {
        title: '17: Todo list',
        path: '/tutorial/todo-list'
      },
      {
        title: '18: Bookmarks',
        path: '/tutorial/bookmarks'
      },
      {
        title: '19: Categories',
        path: '/tutorial/categories'
      },
      {
        title: '20: Tabs multiple',
        path: '/tutorial/tabs-multi'
      },
      {
        title: '21: Scavenger Hunt',
        path: '/tutorial/scavenger-hunt'
      },
    ]
  },
  {
    title: 'Guides',
    path: 'guides',
    open: false,
    items: [
      {
        title: 'Adding Actions to components',
        path: '/guides/actions'
      },
      {
        title: 'Story programming cheatsheet',
        path: '/guides/story_cheatsheet'
      },
      {
        title: 'Internationalization (i18n) and localization (l10n)',
        path: '/guides/i18n'
      },
      {
        title: 'Style your app',
        path: '/guides/styling'
      },
      {
        title: 'How to setup your own interkit server',
        path: '/guides/server_setup'
      },
      {
        title: 'Build for native app and deploy to app stores',
        path: '/guides/native'
      },
      {
        title: 'Setup push notifications',
        path: '/guides/push_setup'
      },
      {
        title: 'Setup server cron jobs',
        path: '/guides/cron_setup'
      },
      {
        title: 'Setup Raspberry Player',
        path: '/guides/raspi_setup'
      },
      {
        title: 'Migrate app to vite',
        path: '/guides/migrate_to_vite'
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
        path: '/components/AppBase'
      },
      {
        title: 'DesktopFallback',
        path: '/components/AppBase#desktopfallback-component'
      },
      {
        title: 'AppBaseAdvanced',
        path: '/components/AppBase#appbaseadvanced'
      },
      {
        title: 'Button',
        path: '/components/Button'
      },
      {
        title: 'ButtonBar',
        path: '/components/Button#buttonbar'
      },
      {
        title: 'Chat',
        path: '/components/Chat'
      },
      {
        title: 'StoryBoardImage',
        path: '/components/Chat#storyboardimage'
      },
      {
        title: 'ScrollContainer',
        path: '/components/ScrollContainer'
      },
      {
        title: 'Overlay',
        path: '/components/Overlay'
      },
      {
        title: 'AspectRatio',
        path: '/components/AspectRatio'
      },
      {
        title: 'ContextDebugger',
        path: '/components/ContextDebugger'
      },
      {
        title: 'DataLoaderSingle',
        path: '/components/DataLoader#dataloadersingle'
      },
      {
        title: 'DataLoaderMulti',
        path: '/components/DataLoader#dataloadermulti'
      },
      {
        title: 'DataTile',
        path: '/components/DataTile'
      },
      {
        title: 'DataCell',
        path: '/components/DataCell'
      },
      {
        title: 'DataCard',
        path: '/components/DataCard'
      },      
      {
        title: 'DataList',
        path: '/components/DataList'
      },      
      {
        title: 'DataCarousel',
        path: '/components/DataList#datacarousel'
      },      
      {
        title: 'PictureBook',
        path: '/components/DataList#picturebook'
      },      
      {
        title: 'Mosaic',
        path: '/components/DataList#mosaic'
      },      
      {
        title: 'Group',
        path: '/components/Group'
      },
      {
        title: 'GroupConnector',
        path: '/components/Group#groupconnector'
      },
      {
        title: 'IfDataAnnotation',
        path: '/components/If#ifdataannotation'
      },
      {
        title: 'IfUIKey',
        path: '/components/If#ifuikey'
      },
      {
        title: 'IfUserVar',
        path: '/components/If#ifuservar'
      },
      {
        title: 'Label',
        path: '/components/Label'
      },
      {
        title: 'LangSwitch',
        path: '/components/LangSwitch'
      },
      {
        title: 'ListItem',
        path: '/components/ListItem'
      },
      {
        title: 'Icon',
        path: '/components/Icon'
      },
      {
        title: 'Image',
        path: '/components/Image'
      },
      {
        title: 'MapSimple',
        path: '/components/MapSimple'
      },    
      {
        title: 'NavBar',
        path: '/components/NavBar'
      },
      {
        title: 'NavButton',
        path: '/components/NavBar#navbutton'
      },
      {
        title: 'MarkdownContent',
        path: '/components/MarkdownContent'
      },
      {
        title: 'StoryBoardCard',
        path: '/components/StoryBoard'
      },
      {
        title: 'StoryBoardsList',
        path: '/components/StoryBoard#storyboardslist'
      },
      {
        title: 'ChatBoardsList',
        path: '/components/StoryBoard#storyboardslist'
      },
      {
        title: 'QRScanner',
        path: '/components/QRScanner'
      },
      {
        title: 'StaticText',
        path: '/components/StaticText'
      },
      {
        title: 'TextFormat',
        path: '/components/TextFormat'
      },
      
      {
        title: 'Spacing',
        path: '/components/Spacing'
      },
      {
        title: 'TabBar',
        path: '/components/TabBar'
      },
      {
        title: 'Tab',
        path: '/components/TabBar#tab'
      },
      {
        title: 'AccordeonShell',
        path: '/components/AccordeonShell'
      },
      {
        title: 'Absolute',
        path: '/components/Absolute'
      },
      {
        title: 'BottomBarShell',
        path: '/components/Shell#bottombarshell'
      },
      {
        title: 'ColumnShell',
        path: '/components/HorizontalSpacer#columnshell'
      },
      {
        title: 'HorizontalSpacer',
        path: '/components/HorizontalSpacer'
      },
      {
        title: 'LayoutShell',
        path: '/components/Shell#layoutshell'
      },
      {
        title: 'LayoutShellAudio',
        path: '/components/Shell#layoutshellaudio'
      },
      {
        title: 'TopBarShell',
        path: '/components/Shell#topbarshell'
      },
      {
        title: 'Overlay',
        path: '/components/Overlay'
      },
      {
        title: 'OverlayFull',
        path: '/components/Overlay#overlayfull'
      },
      {
        title: 'SectionShell',
        path: '/components/SectionShell'
      },
      {
        title: 'ExternalMapAppButton',
        path: '/components/ExternalMapAppButton'
      },
      {
        title: 'MapSimple',
        path: '/components/MapSimple'
      },
      {
        title: 'MapViewButton',
        path: '/components/MapViewButton'
      },
      {
        title: 'ARViewer',
        path: '/components/ARViewer'
      },
      {
        title: 'AudioPlayer',
        path: '/components/AudioPlayer'
      },
      {
        title: 'InlineAudioButton',
        path: '/components/AudioPlayer#inlineaudiobutton'
      },
      {
        title: 'PopoutAudioButton',
        path: '/components/AudioPlayer#popoutaudiobutton'
      },
      {
        title: 'VideoButton',
        path: '/components/VideoButton'
      },
      {
        title: 'CenterModal',
        path: '/components/Modal#centermodal'
      },
      {
        title: 'SlideInModal',
        path: '/components/Modal#slideinmodal'
      },
      {
        title: 'Snackbar',
        path: '/components/Modal#snackbar'
      },
      {
        title: 'ChatRoute',
        path: '/components/Route#chatroute'
      },
      {
        title: 'DataRouteMulti',
        path: '/components/Route#dataroutemulti'
      },
      {
        title: 'DataRouteSingle',
        path: '/components/Route#dataroutesingle'
      },
      {
        title: 'Route',
        path: '/components/Route#route'
      },
      {
        title: 'RouteConnector',
        path: '/components/Route#routeconnector'
      },
      {
        title: 'Styling',
        path: '/components/Styling'
      },
      {
        title: 'AnonymousLogin',
        path: '/components/AnonymousLogin'
      },
      {
        title: 'UserCard',
        path: '/components/UserCard'
      },
      {
        title: 'UserVarSwitch',
        path: '/components/UserVarSwitch'
      },
      
      
    ]
  },
  {
    title: 'Theory',
    path: 'theory',
    open: false,
    items: [
      {
        title: 'Collection Schemas',
        path: '/theory/collections'
      },
      {
        title: '"Project Server"',
        path: '/theory/project-server'
      },
      {
        title: 'Server Architecture',
        path: '/theory/server-architecture'
      }
    ]
  },
  {
    title: 'Contribute',
    open: false,
    items: [
      {
        title: 'Docs',
        path: '/contribute/docs'
      },
      {
        title: 'Components',
        path: '/contribute/components'
      },
      {
        title: 'Component CSS',
        path: '/contribute/component_css'
      },
      {
        title: 'Custom Theme',
        path: '/contribute/theme'
      }
    ]
  }
];
