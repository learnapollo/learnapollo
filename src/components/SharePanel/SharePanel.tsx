import * as React from 'react'
import {getStoredState} from '../../utils/statestore'
import {throttle} from 'lodash'
const styles: any = require('./SharingPanel.module.styl')

interface Props {
}

interface State {
  display: boolean
}

type Size = 'large' | 'medium' | 'small'
const millUntilDisplay = 3 * 60 * 1000

export default class SharePanel extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      display: false,
    }

    this.onResize = throttle(this.onResize.bind(this), 100)
  }

  componentDidMount() {
    const lastTimestamp = getStoredState().initialLoadTimestamp
    const currentTimestamp = Date.now()

    if ((currentTimestamp - lastTimestamp) < millUntilDisplay) {
      setTimeout(() => {
        this.setState({display: true} as State)
      }, (millUntilDisplay - (currentTimestamp - lastTimestamp)))
    } else {
      this.setState({display: true} as State)
    }

    window.addEventListener('resize', this.onResize, false)
  }

  onResize(e) {
    this.forceUpdate()
  }

  render() {

    const displayMode: Size = ((w: number): Size => {
      if (w <= 1600) {
        return 'small' as Size
      } else if (w <= 2000) {
        return 'medium' as Size
      } else {
        return 'large' as Size
      }
    })(window.innerWidth)

    const shareTitle = 'I just learned how to develop apps with Apollo and GraphQL'
    const shareUrl = encodeURIComponent(window.location.origin)

    return (
      <div className='flex justify-center'>
        {this.state.display &&
        <div className={'right-0 mt5 ph3 bg-black-05-opaque ' + (displayMode !== 'small' ? 'fixed' : '')}
             style={{top: '18vh', maxWidth: (displayMode === 'medium' ? '16rem' : '40rem')}}>

          <h3 className='accent' style={{fontWeight: 400}}>Liked Learn Apollo So far?</h3>
          <p style={{color: 'black', opacity: 0.4}}>
            Please consider sharing it so that other people can enjoy it too.
          </p>

          <div
            className={'flex justify-center '+ (displayMode === 'medium' ? 'flex-column' : '')}
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
              className={`ml2 ${styles.button}`}
              style={{background: '#3b5998'}}
            >
              Share on Facebook
            </a>
          </div>
        </div>
        }
      </div>
    )
  }
}
