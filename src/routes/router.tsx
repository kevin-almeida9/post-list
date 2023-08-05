import {lazy} from 'react'
import { createBrowserRouter } from "react-router-dom"

const Posts = lazy(() => import('../views/Posts/Posts'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Posts/>
  }
])

export default router