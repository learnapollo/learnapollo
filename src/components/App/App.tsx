import * as React from 'react'
import * as classNames from 'classnames'
import {Link, withRouter} from 'react-router'
import {throttle} from 'lodash'
import Icon from '../Icon/Icon'
import ServerLayover from '../ServerLayover/ServerLayover'
import {chapters, neighboorSubchapter, subchapters, getLastSubchapterAlias, Chapter} from '../../utils/content'
import {collectHeadings, buildHeadingsTree} from '../../utils/markdown'
import {slug} from '../../utils/string'
import {StoredState, getStoredState, update} from '../../utils/statestore'
import {initSmooch} from '../../utils/smooch'

require('./style.css')

const styles: any = require('./App.module.styl')

interface Props {
  children: React.ReactElement<any>
  router: any
  params: any
  location: any
}

interface State {
  showLayover: boolean
  storedState: StoredState
  expandNavButtons: boolean
  showNav: boolean
}

class App extends React.Component<Props, State> {

  static childContextTypes = {
    storedState: React.PropTypes.object.isRequired,
    updateStoredState: React.PropTypes.func.isRequired,
  }

  constructor(props: Props) {
    super(props)

    if (props.location.query.code) {
      this.fetchEndpoint(props.location.query.code)
    }

    this.state = {
      showLayover: false,
      storedState: getStoredState(),
      expandNavButtons: false,
      showNav: false,
    }

    if (getStoredState().initialLoadTimestamp === null) {
      update(['initialLoadTimestamp'], Date.now())
    }

    this.onScroll = throttle(this.onScroll.bind(this), 100)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false)

    this.onScroll()
    initSmooch().then(this.updateSmoochButton)
    this.updateSidebarTrack()
  }

  componentDidUpdate() {
    this.onScroll()
    this.updateSmoochButton()
    this.updateSidebarTrack()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false)

    this.updateSmoochButton()
    this.updateSidebarTrack()
  }

  getChildContext() {
    return {
      storedState: this.state.storedState,
      updateStoredState: this.updateStoredState,
    }
  }

  render() {
    const currentSubchapterAlias = this.props.params.subchapter
    const currentSubchapter = subchapters.find((s) => s.alias === currentSubchapterAlias)

    const headingsTree = currentSubchapter ? buildHeadingsTree(collectHeadings(currentSubchapter!.ast())) : []

    const nextSubchapter = neighboorSubchapter(currentSubchapterAlias, true)
    const previousSubchapter = neighboorSubchapter(currentSubchapterAlias, false)

    const lastSubchapterAlias = getLastSubchapterAlias(Object.keys(this.state.storedState.hasRead))
    const selectedTrackAlias: string = getStoredState().selectedTrackAlias

    const shouldDisplaySubchapters = (chapter: Chapter, selectedTrackAlias: string): boolean => {
      return !chapter.isTrack || selectedTrackAlias === chapter.alias
    }
    return (
      <div className='flex row-reverse'>
        <div className={styles.hamburger} onClick={this.toggleNav}>
          <div className={styles.hamburgerWrapper}/>
        </div>
        <div
          className={`
            flex flex-column vertical-line font-small fixed left-0 h-100 overflow-x-visible
            ${styles.sidebar}
          `}
          style={{
            width: 270,
            display: this.state.showNav ? 'flex' : 'none',
          }}
        >

          <div className='relative pb6 overflow-y-scroll' ref='sidenav'>
            <div className={styles.close} onClick={this.toggleNav}>
              <Icon
                src={require('../../assets/icons/close.svg')}
                width={25}
                height={25}
                color='rgba(0,0,0,0.5)'
              />
            </div>
            <Link to='/' onClick={this.toggleNav}>
              <h2 className='fw3 pa4 pb0 black flex items-center'>
                <span className='dib mr3 mrl-1'>
                  <Icon
                    src={require('../../assets/icons/logo.svg')}
                    width={22}
                    height={22}
                  />
                </span>
                Learn Apollo
              </h2>
            </Link>
            {chapters.map((chapter, index) => (
              <div
                className='flex flex-column'
                key={chapter.alias}
              >
                <Link
                  className='fw6 ph4 pb3 black'
                  to={`/${chapter.alias}/${chapter.subchapters[0].alias}`}
                  onClick={() => this.setTrack(chapter.alias)}
                  style={{
                    paddingBottom: '0.5rem',
                    paddingTop: '1rem',
                  }}
                >
                  <span className='mr3 o-20 bold'>{index + 1}</span> {chapter.title}
                </Link>
                {shouldDisplaySubchapters(chapter, selectedTrackAlias) && chapter.subchapters.map((subchapter) => (
                  <div
                    className='pb1'
                    key={subchapter.alias}
                  >
                    <div
                      className={`
                      relative
                      ${this.props.params.subchapter === subchapter.alias ? 'ph4 bg-black-05' : 'ph4'}
                      ${this.props.params.subchapter === subchapter.alias ? styles.currentProgressBar : ''}
                      `}
                      onClick={this.toggleNav}
                      style={{
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                      }}
                    >
                      {subchapter.alias === lastSubchapterAlias &&
                      <div className={styles.progressBar}/>
                      }
                      {this.state.storedState.hasRead[subchapter.alias] &&
                      <span className='mr3 fw5 green dib'>
                          <Icon
                            src={require('../../assets/icons/check_chapter.svg')}
                            width={8}
                            height={8}
                            color={'#64BF00'}
                          />
                        </span>
                      }
                      <div
                        ref={`link-${slug(subchapter.alias)}`}
                        className='dib'
                      >
                        {!this.state.storedState.hasRead[subchapter.alias] &&
                        <span
                          className='mr3 fw5 green dib'
                          style={{
                              width: 8,
                              height: 8,
                            }}
                        />
                        }
                        <Link
                          to={`/${chapter.alias}/${subchapter.alias}`}
                          className='black fw3'
                          onClick={this.toggleNav}
                        >
                          {subchapter.title}
                        </Link>
                      </div>
                    </div>
                    {chapter.alias === this.props.params.chapter &&
                    subchapter.alias === this.props.params.subchapter &&
                    headingsTree.map((h) => (
                      <a
                        onClick={this.toggleNav}
                        key={h.title!}
                        className={`flex flex-row flex-start black ${styles.subchapter}`}
                        href={`#${slug(h.title!)}`}
                      >
                        <div className='ml4 mr2 fw5 bold o-20 black rotate-180 dib indent-char-dimensions'>¬</div>
                        <div>{h.title}</div>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {this.state.storedState.user && this.state.storedState.user.projectId &&
          <div
            className={`
              fixed bottom-0 left-0 flex fw3 items-center justify-center flex-row bg-accent pointer
              ${styles.serverButton}
            `}
            style={{ width: 269, height: 90 }}
            onClick={this.openLayover}
          >
            <Icon
              src={require('../../assets/icons/graph-logo.svg')}
              width={22}
              height={24}
              className='pt1'
              color='#fff'
            />
            <div className='flex-column flex'>
              <span className='white f3 pl2'>GraphQL Server</span>
              <span className='white pl2'>Hosted by Graphcool</span>
            </div>
          </div>
          }
        </div>
        <div className={`absolute right-0 ph4 o-50 black gray-2 f6 tr ${styles.lastUpdated}`}>
          Last updated<br />
          {__LAST_UPDATE__}
        </div>
        <div className={`${styles.content} ${this.state.showLayover ? styles.layoverPadding : ''}`}>
          {this.props.children}
          {previousSubchapter &&
          <div
            className={
              classNames( styles.jump,
                          'z-0',
                          styles.jumpLeft,
                          {
                            [styles.jumpActive]: this.state.expandNavButtons,
                            [styles.layoverPadding]: this.state.showLayover,
                          }
              )
            }
          >
            <Link to={`/${previousSubchapter.chapter.alias}/${previousSubchapter.alias}`}>
              <Icon
                src={require('../../assets/icons/previous.svg')}
                width={11}
                height={20}
                className={`${styles.icon}`}
                color='#000'
              />
              <span className={`${styles.jumpDetail}`}>
                <span>Previous:</span> {previousSubchapter.title}
              </span>
            </Link>
          </div>
          }
          {nextSubchapter &&
          (
            currentSubchapterAlias !== 'get-started' ||
            this.state.storedState.user ||
            this.state.storedState.skippedAuth
          ) &&
          <div
            className={`${styles.jump} ${styles.jumpRight} ${this.state.expandNavButtons
            ? styles.jumpActive : ''} ${this.state.showLayover
            ? styles.layoverPadding : ''} z-0`}
          >
            <Link to={`/${nextSubchapter.chapter.alias}/${nextSubchapter.alias}`}>
              <span className={`${styles.jumpDetail}`}>
                <span>Next:</span> {nextSubchapter.title}
              </span>
              <Icon
                src={require('../../assets/icons/next.svg')}
                width={11}
                height={20}
                className={`${styles.icon}`}
                color='#000'
              />
            </Link>
          </div>
          }
        </div>
        {this.state.showLayover && this.state.storedState.user &&
        <ServerLayover
          projectId={this.state.storedState.user.projectId}
          close={this.closeLayover}
        />
        }
      </div>
    )
  }

  private openLayover = () => {
    analytics.track(`overlay: open`)
    this.setState({showLayover: true} as State)
  }

  private closeLayover = () => {
    analytics.track(`overlay: close`)
    this.setState({showLayover: false} as State)
  }

  private async fetchEndpoint(code: string) {
    const response = await fetch(__LAMBDA_AUTH__, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({code}),
    })

    if (!response.ok) {
      throw Error(response.statusText)
    }
    const body = await response.json()

    if (body.errorMessage) {
      throw Error(response.statusText)
    }

    const {projectId, email, name} = body

    analytics.alias(email)
    setTimeout(
      () => {
        analytics.identify(email, {
          name: name || email,
          email: email,
        })
      },
      2000
    )

    this.updateStoredState(['user'], {projectId, email, name})
    this.updateStoredState(['skippedAuth'], false)
    this.props.router.replace(`${window.location.pathname}${window.location.hash}`)

    initSmooch()
  }

  private updateStoredState = (keyPath: string[], value: any) => {
    this.setState({
      storedState: update(keyPath, value),
    } as State)
  }

  private onScroll() {
    const expandNavButtons = (
      document.body.scrollHeight - 100 < document.body.scrollTop + window.innerHeight ||
      document.body.scrollHeight <= window.innerHeight
    )
    if (this.state.expandNavButtons !== expandNavButtons) {
      this.setState({expandNavButtons} as State)
    }
  }

  private toggleNav = () => {
    this.setState({showNav: !this.state.showNav} as State)
  }

  private setTrack = (alias: String) => {
    const tracks = chapters.filter((c) => c.isTrack)
    const currentIndex = tracks.findIndex((c) => c.alias === alias)

    if (currentIndex !== -1) {
      update(['selectedTrackAlias'], tracks[currentIndex].alias)
    }
  }

  private updateSmoochButton = () => {
    const showsNextButton = !!neighboorSubchapter(this.props.params.subchapter, true) || this.state.expandNavButtons
    const smoochButton = document.querySelector('#sk-holder #sk-messenger-button')
    if (smoochButton) {
      smoochButton.classList.toggle('inactive', !showsNextButton)
    }
  }

  private updateSidebarTrack() {
    const currentChapterAlias = location.pathname.split('/')[1]
    const index = chapters.findIndex((c) => c.alias === currentChapterAlias)
    if (index !== -1 && chapters[index].isTrack) {
      this.setTrack(currentChapterAlias)
    } else if (!('selectedTrackAlias' in getStoredState())) {
      this.setTrack('tutorial-react')
    }
  }
}

export default withRouter(App)
