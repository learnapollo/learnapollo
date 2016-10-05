import * as React from 'react'

interface Props {
  src: any
  color?: string
  width?: number
  height?: number
  className?: string
  rotate?: number
  style?: any
  [key: string]: any
}

export default class Icon extends React.Component<Props, {}> {
  render() {
    const width = this.props.width || 16
    const height = this.props.height || 16

    const rotate = this.props.rotate || 0

    const fillCode = this.props.color ? `fill="${this.props.color}"` : ''
    const styleCode = `style="width: ${width}px; height: ${height}px"`
    const html = this.props.src.replace(/<svg/, `<svg ${fillCode} ${styleCode}`)

    const restProps = Object.assign({}, this.props)
    delete restProps.width
    delete restProps.height
    delete restProps.color
    delete restProps.src
    delete restProps.className

    const style = Object.assign(
      {},
      {
        transform: `rotate(${rotate}deg)`,
        WebkitTransform: `rotate(${rotate}deg)`,
        display: 'flex',
      },
      this.props.style
    )

    return (
      <i
        {...restProps}
        className={this.props.className}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
}
