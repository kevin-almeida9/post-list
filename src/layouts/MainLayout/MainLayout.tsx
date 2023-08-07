import {ReactNode} from 'react'
import postListLogo from '../../assets/logo.png'

type Props = {
  pageTitle?: string
  children: ReactNode
}

function MainLayout({children, pageTitle}: Props) {
  return (
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
  )
}

export default MainLayout