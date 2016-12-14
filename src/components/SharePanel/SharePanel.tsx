import * as React from 'react'
import {getStoredState} from '../../utils/statestore'
import {throttle} from 'lodash'
import classNames from 'classnames'
const styles: any = require('./SharingPanel.module.styl')

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

    const shareTitle = 'Learning how to develop apps with Apollo and GraphQL using LearnApollo!'
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
            <a
              href={`http://www.twitter.com/share?url=${shareUrl}&text=${shareTitle}`}
              target='_blank'
              className={styles.button}
              style={{background: '#3cf'}}
            >
              Share on Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&t=${shareTitle}`}
              target='_blank'
              className={classNames(styles.button, {'ml2': displayMode !== 'medium'})}
              style={{background: '#3b5998'}}
            >
              Share on Facebook
            </a>
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
