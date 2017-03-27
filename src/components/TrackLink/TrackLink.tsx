import * as React from 'react'
import * as ReactGA from 'react-ga'

interface Props {
  event: ReactGA.EventArgs
  children?: JSX.Element
  href: string
  className?: string
  target?: string
  style?: any
  download?: string
}

export default class TrackLink extends React.Component<Props, {}> {

  render() {
    return (
      <a
        href={this.props.href}
        className={this.props.className}
        onClick={this.onClick}
        target={this.props.target}
        style={this.props.style}
        download={this.props.download}
      >
        {this.props.children}
      </a>
    )
  }

  private onClick = (e: React.MouseEvent<any>) => {
    e.preventDefault()
    ReactGA.event(this.props.event)
    setTimeout(() => {
      window.location.href = this.props.href
    },
      250
    )
  }
}
