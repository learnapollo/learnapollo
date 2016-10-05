import * as React from 'react'
import {findDOMNode} from 'react-dom'

interface Props {
  eventMessage: string
  children?: JSX.Element
  href: string
  className: string
  [key: string]: any
}

export default class TrackLink extends React.Component<Props, {}> {

  componentDidMount () {
    const link = findDOMNode(this.refs['link'])
    analytics.trackLink(link, this.props.eventMessage)
  }

  render() {
    return (
      <a
        href={this.props.href}
        ref='link'
        className={this.props.className}
      >
        {this.props.children}
      </a>
    )
  }
}
