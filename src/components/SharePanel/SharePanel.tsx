import * as React from 'react'
import { getStoredState } from '../../utils/statestore'
import { throttle } from 'lodash'
import * as classNames from 'classnames'
const styles: any = require('./SharingPanel.module.styl')
import { events } from '../../utils/events'
import TrackLink from '../TrackLink/TrackLink'

interface Props {
}

type Size = 'large' | 'medium' | 'small'
const millUntilDisplay = 3 * 60 * 1000

export default class SharePanel extends React.Component<Props, {}> {
  constructor(props) {
    super(props)

    this.onResize = throttle(this.onResize.bind(this), 100)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)

    if (!this.isDisplayed()) {
      setTimeout(this.forceUpdate.bind(this), millUntilDisplay)
    }
  }

  onResize(e) {
    this.forceUpdate()
  }

  render() {
    if (!this.isDisplayed()) {
      return null
    }

    const displayMode: Size = ((w: number): Size => {
      if (w <= 1600) {
        return 'small'
      } else if (w <= 2000) {
        return 'medium'
      } else {
        return 'large'
      }
    })(window.innerWidth)

    const shareTitle = 'Learning how to develop apps with Apollo and GraphQL using Learn Apollo!'
    const shareUrl = encodeURIComponent(window.location.origin)

    return (
      <div className='flex justify-center'>
        <div
          className={classNames('right-0', 'mt5', 'ph3', 'bg-black-05-opaque', {'fixed': displayMode !== 'small' })}
          style={{top: '18vh', maxWidth: (displayMode === 'medium' ? '16rem' : '40rem')}}
        >
          <h3 className='accent' style={{fontWeight: 400}}>Liked Learn Apollo so far?</h3>
          <p style={{color: 'black', opacity: 0.4}}>
            Please consider sharing it so that other people can enjoy it too.
          </p>

          <div
            className={classNames(
               'flex',
               'justify-center',
               'items-center',
               {
                 'flex-column': displayMode === 'medium',
               })}
            style={{
            paddingBottom: '2rem',
          }}
          >
            <div style={{ marginTop: '1rem' }}>
              <a
                className='github-button'
                href='https://github.com/learnapollo/learnapollo'
                data-style='mega'
                data-count-href='/learnapollo/learnapollo/stargazers'
                data-count-api='/repos/learnapollo/learnapollo#stargazers_count'
                data-count-aria-label='# stargazers on GitHub'
                aria-label='Star learnapollo/learnapollo on GitHub'
              >
                Star
              </a>
            </div>
            <TrackLink
              event={events.SharePanelTwitter}
              href={`http://www.twitter.com/share?url=${shareUrl}&text=${shareTitle}`}
              target='_blank'
              className={classNames(styles.button, {'ml2': displayMode !== 'medium'})}
              style={{background: '#3cf'}}
            >
              Share on Twitter
            </TrackLink>
            <TrackLink
              event={events.SharePanelFacebook}
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&t=${shareTitle}`}
              target='_blank'
              className={classNames(styles.button, {'ml2': displayMode !== 'medium'})}
              style={{background: '#3b5998'}}
            >
              Share on Facebook
            </TrackLink>
          </div>
        </div>
      </div>
    )
  }

  private isDisplayed = () => {
    const lastTimestamp = getStoredState().initialLoadTimestamp
    const currentTimestamp = Date.now()
    return (currentTimestamp - lastTimestamp) >= millUntilDisplay
  }
}
