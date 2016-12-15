export const events = {
  JoinSlack: {
    category: 'user',
    action: 'joined-slack',
  },
  SharePanelTwitter: {
    category: 'user',
    action: 'share/twitter/share-panel',
  },
  SharePanelFacebook: {
    category: 'user',
    action: 'share/facebook/share-panel',
  },
  ShareWrapupTwitter: {
    category: 'user',
    action: 'share/twitter/wrapup',
  },
  ShareWrapupFacebook: {
    category: 'user',
    action: 'share/facebook/wrapup',
  },
  OpenGithub: {
    category: 'user',
    action: 'open-github',
  },
  EndpointReceived: {
    category: 'user',
    action: 'endpoint-received',
  },
  DownloadExample: {
    category: 'user',
    action: 'download-example',
  },
  ContentSkippedEndpoint: {
    category: 'user',
    action: 'skipped-endpoint',
  },
  SmoochOpened: {
    category: 'ui',
    action: 'smooch/opened',
  },
  SmoochMessageSent: {
    category: 'ui',
    action: 'smooch/message-sent',
  },
  ContentCopiedEndpoint: {
    category: 'ui',
    action: 'copied-endpoint/from-content',
  },
  OverlayCopiedEndpoint: {
    category: 'ui',
    action: 'copied-endpoint/from-overlay',
  },
  OverlayShowDatabrowser: {
    category: 'ui',
    action: 'overlay/databrowser/show',
  },
  OverlayShowGraphiQL: {
    category: 'ui',
    action: 'overlay/graphiql/show',
  },
  OverlayGraphiQLRanQuery: {
    category: 'ui',
    action: 'overlay/graphiql/run-query',
  },
  OverlayOpen: {
    category: 'ui',
    action: 'overlay/open',
  },
  OverlayClose: {
    category: 'ui',
    action: 'overlay/close',
  },
  OverlayDeletePokemon: {
    category: 'ui',
    action: 'overlay/databrowser/delete-pokemon',
  },
  OverlayUpdatePokemon: {
    category: 'ui',
    action: 'overlay/databrowser/update-pokemon',
  },
  OverlayCreatePokemon: {
    category: 'ui',
    action: 'overlay/databrowser/create-pokemon',
  },
}