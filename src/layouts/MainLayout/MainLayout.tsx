import {ReactNode} from 'react'

type Props = {
  pageTitle?: string
  children: ReactNode
}

function MainLayout({children, pageTitle}: Props) {
  return (
    <div className="main-layout">
      <div className="main-layout__nav-bar"></div>
      <div className="main-layout__container">
        {pageTitle && <h1 className="main-layout__page-title" >{pageTitle}</h1>}
        {children}
      </div>
    </div>
  )
}

export default MainLayout