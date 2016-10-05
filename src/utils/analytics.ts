export default function () {
  // Create a queue, but don't obliterate an existing one!
  let analytics = window.analytics = window.analytics || []

  // If the real analytics.js is already on the page return.
  if (analytics.initialize) {
    return
  }

  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error('Segment snippet included twice.')
    }
    return
  }

  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true

  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'reset',
    'group',
    // 'track',
    'ready',
    'alias',
    'page',
    'once',
    'off',
    'on',
  ]

  analytics.track = function (event, properties, options, fn) {
    const isFn = (value) => typeof value === 'function'
    // Argument reshuffling.
    if (isFn(options)) {
      fn = options, options = null // tslint:disable-line
    }
    if (isFn(properties)) {
      fn = properties, options = null, properties = null // tslint:disable-line
    }

    if (fn) {
      fn()
    }

    return this
  }

  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function (method) {
    return function () {
      let args = Array.prototype.slice.call(arguments)
      args.unshift(method)
      analytics.push(args)
      return analytics
    }
  }

  // For each of our methods, generate a queueing stub.
  for (let i = 0; i < analytics.methods.length; i++) {
    const key = analytics.methods[i]
    analytics[key] = analytics.factory(key)
  }

  // Define a method to load Analytics.js from our CDN,
  // and that will be sure to only ever load it once.
  analytics.load = function (key) {
    // Create an async script element based on your key.
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://cdn.segment.com/analytics.js/v1/' +
      key + '/analytics.min.js'

    // Insert our script next to the first script element.
    const first = document.getElementsByTagName('script')[0]
    first.parentNode.insertBefore(script, first)
  }

  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = '3.1.0'

  // Load Analytics.js with your key, which will automatically
  // load the tools you've enabled for your account. Boosh!
  if (__ENABLE_SEGMENT__) {
    analytics.load(__SEGMENT_TOKEN__)
  }
}
