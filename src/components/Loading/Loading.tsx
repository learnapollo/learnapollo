import * as React from 'react'
const classes: any = require('./Loading.module.css')

interface Props {
  color?: string
  width?: number
  height?: number
  className?: string
}

export default class Loading extends React.Component<Props, {}> {

  render() {
    const width = this.props.width || 30
    const height = this.props.height || 30
    const backgroundColor = this.props.color || '#000'
    return (
      <div
        style={{ width, height, backgroundColor }}
        className={`${classes.root} ${this.props.className}`}
      />
    )
  }
}
