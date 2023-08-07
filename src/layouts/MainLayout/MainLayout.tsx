import {ReactNode} from 'react'
import postListLogo from '../../assets/logo.png'
import { positions, Provider, transitions } from "react-alert"
import AlertTemplate from "react-alert-template-basic"

type Props = {
  pageTitle?: string
  children: ReactNode
}

function MainLayout({children, pageTitle}: Props) {
  const options = {
    timeout: 5000,
    position: positions.TOP_CENTER,
  };

  return (
    <Provider template={AlertTemplate} {...options}>
      <div className="main-layout">
        <div className="main-layout__nav-bar">
          <img className="main-layout__nav-bar-logo" src={postListLogo} alt="Logo" />
          <span className="main-layout__nav-bar-title">Post List</span>
        </div>
        <div className="main-layout__container">
          {pageTitle && <h1 className="main-layout__page-title" >{pageTitle}</h1>}
          {children}
        </div>
      </div>
    </Provider>
  )
}

export default MainLayout