import React from 'react';
import './App.css';
import { message, Upload, Button } from 'antd';
import html2canvas from 'html2canvas';

import style1 from './assets/style-1.png';
import style2 from './assets/style-2.png';
import style3 from './assets/style-3.png';
import style4 from './assets/style-4.png';
import style5 from './assets/style-5.png';

const Avatar = function (props) {
  return (
    <div className="avatar" {...{
      style: {
        backgroundImage: 'url("' + props.src + '")'
      }
    }} />
  )
}

const Border = function (props) {
  return (
    <div className="pictit" {...{
      style: {
        backgroundImage: 'url("' + props.src + '")'
      }
    }} />
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      index: 0,
      avatar: '',
      imageUrl: '',
      background: [
        style1,
        style2,
        style3,
        style4,
        style5
      ]
    }
  }
  componentDidMount() {
  }
  changeBorder(index) {
    index++

    if (index > this.state.background.length - 1) {
      index = 0
    }

    this.setState({
      index: index
    })
  }
  build() {
    html2canvas(document.getElementById("demo")).then(canvas => {
      document.getElementById('download').appendChild(canvas)

      canvas.toBlob(function (blob) {
        let reader = new window.FileReader()

        reader.onloadend = function () {
          const data = reader.result

          var btnDownload = document.getElementById("btnDownload")
          btnDownload.download = 'avatar.png'
          btnDownload.href = data
          btnDownload.click()
        }

        reader.readAsDataURL(blob)
      })

      message.success('生成成功')
    })
  }
  render() {
    // 获取所有边框配置
    const backgrounds = this.state.background
    // 当前所选边框索引
    const index = this.state.index
    // 选取头像的base64信息
    const avatar = this.state.avatar
    // 上传组件配置
    const UploadProps = {
      customRequest: () => {
        // 覆盖默认的上传行为 不需要上传到远端
      },
      showUploadList: false,
      transformFile: (file) => {
        // blob2base64
        let reader = new window.FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => this.setState({ avatar: reader.result })
      }
    }
    return (
      <div id="app">
        <div className="main">
          <div id="demo">

            <Avatar src={avatar} />

            <Border src={backgrounds[index]} />
          </div>

          <div className="tool">
            <Upload {...UploadProps}>
              <Button type="primary">
                选取文件
                </Button>
            </Upload>

            {
              avatar ? (
                <div className="buttons">
                  <Button onClick={() => this.changeBorder(index)} type="dashed">切换边框</Button>
                  <Button onClick={() => this.build()} type="dashed">生成图片</Button>
                </div>
              ) : null
            }

          </div>

          <div id="download"></div>
          <a id="btnDownload" className="hide"></a>
        </div>
      </div>
    )
  }
}

export default App;
