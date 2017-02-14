import * as React from 'react'
import { Icon } from 'graphcool-styles'
import {chapters, Chapter} from '../../utils/content'
import * as classNames from 'classnames'
const styles = require('./SetTrack.module.styl')
import { withRouter } from 'react-router'

interface Props {
  router: any
}

const trackIcons = {
  'introduction': require('../../assets/icons/logo-react.svg'),
  'tutorial-react': require('../../assets/icons/logo-react.svg'),
  'tutorial-react-native-vanilla': require('../../assets/icons/logo-react.svg'),
  'tutorial-react-native-exponent': require('../../assets/icons/logo-exponent.svg'),
  'tutorial-ios': require('../../assets/icons/logo-ios.svg'),
  'tutorial-angular': require('../../assets/icons/logo-angular.svg'),
  'tutorial-vue': require('../../assets/icons/logo-vue.svg'),
  'excursions': require('../../assets/icons/logo-react.svg'),
  'go-further': require('../../assets/icons/logo-react.svg'),
}

class SetTrack extends React.Component<Props, {}> {
  render() {
    const trackToJSX = (t) => {
      return (
        <div key={t.alias} className='pv4 flex flex-row'>
          <Icon width={60} height={60} src={trackIcons[t.alias]}/>
          <div className='ph4'>
            <h2 className='mt0 accent' style={{border: 'none'}}>{t.title}</h2>
            <p>{t.description}</p>
            <div className={classNames(styles.button, 'pa3', 'pointer')} onClick={() => this.clickHandler(t)}>
              <span>Get started with {t.title} track</span>
            </div>
          </div>
        </div>
      )
    }

    const trackList = chapters
        .filter((c) => c.isTrack)
        .map((track) => trackToJSX(track))

    return (
      <div className='pv4 pa1'>
        {
          trackList
        }
      </div>
    )
  }

  private clickHandler(selectedTrack: Chapter) {
    const selectedChapter = chapters.find(((c) => c.alias === selectedTrack.alias))!
    this.props.router.replace(`/${selectedChapter.alias}/${selectedChapter.subchapters[0].alias}`)
  }
}

export default withRouter(SetTrack)
