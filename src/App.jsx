import React, { useContext, useReducer } from 'react';
import './App.css';
import { message, Upload, Button } from 'antd';
import html2canvas from 'html2canvas';

const borders = [
  require("../src/assets/style-1.png"),
  require("../src/assets/style-2.png"),
  require("../src/assets/style-3.png"),
  require("../src/assets/style-4.png"),
  require("../src/assets/style-5.png")
]

const AppContext = React.createContext({});

function myReducer(state, action) {
  switch (action.type) {
    case ('changeBorder'):
      const index = ((state.index + 1) <= state.borders.length - 1) ? state.index + 1 : 0
      return {
        ...state,
        index: index
      }
    case ('updateAvatar'):
      return {
        ...state,
        avatar: action.result
      }
    case ('build'):
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
    default:
      return state
  }
}

const Avatar = (props) => (
  <div className="avatar" {...{
    style: {
      backgroundImage: 'url("' + props.src + '")'
    }
  }} />
)

const Border = (props) => (
  <div className="pictit" {...{
    style: {
      backgroundImage: 'url("' + props.src + '")'
    }
  }} />
)

const Preview = () => {
  const { state } = useContext(AppContext);
  return (
    <div id="demo">
      <Avatar src={state.avatar} />
      <Border src={state.borders[state.index]} />
    </div>
  )
}

const Tools = () => {
  const { state, dispatch } = useContext(AppContext);
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
      reader.onloadend = () => dispatch({
        type: 'updateAvatar',
        result: reader.result
      })
    }
  }
  return (
    <div className="tool">
      <Upload {...UploadProps}>
        <Button type="primary">
          选取文件
        </Button>
      </Upload>

      {
        state.avatar ? (
          <div className="buttons">
            <Button onClick={() => dispatch({ type: 'changeBorder' })} type="dashed">切换边框</Button>
            <Button onClick={() => dispatch({ type: 'build' })} type="dashed">生成图片</Button>
          </div>
        ) : null
      }

      <div id="download"></div>
      <a id="btnDownload" className="hide"></a>

    </div>
  )
}

function App() {
  const [state, dispatch] = useReducer(myReducer, {
    index: 0,
    avatar: '',
    borders: borders
  })

  return (
    <div id="app">
      <div className="main">
        <AppContext.Provider value={{ state, dispatch }}>
          <Preview />
          <Tools />
        </AppContext.Provider>
      </div>
    </div>
  )
}

export default App;