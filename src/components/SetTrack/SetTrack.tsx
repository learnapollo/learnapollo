import * as React from 'react'
import Icon from '../Icon/Icon'
import {chapters, Chapter} from '../../utils/content'
import * as classNames from 'classnames'
const styles = require('./SetTrack.module.styl')
import { withRouter } from 'react-router'

interface Props {
  router: any
}

class SetTrack extends React.Component<Props, {}> {
  render() {
    const trackToJSX = (t) => {
      return (
        <div key={t.alias} className='pv4 flex flex-row'>
          <Icon width={60} height={60} src={require('../../assets/icons/logo-react.svg')}/>
          <div className='ph4'>
            <h2 className='mt0 accent' style={{border: 'none'}}>{t.title}</h2>
            <p>This track covers coding a pokedex app in {t.tile} several exercises.</p>
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
    const selectedChapter = chapters.find(((c) => c.alias === selectedTrack.alias))
    this.props.router.replace(`/${selectedChapter.alias}/${selectedChapter.subchapters[0].alias}`)
  }
}

export default withRouter(SetTrack)
