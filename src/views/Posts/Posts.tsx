import {useEffect, useState, useMemo} from 'react'
import api from '../../services/api'
import { AiFillDelete  } from "react-icons/ai"
import PostFormModal from '../../components/PostFormModal/PostFormModal'
import CommentModal from '../../components/CommentModal/CommentModal'
import ReactModal from 'react-modal'

export interface IPost {
  id: number
  userId: number
  title:  string
  body: string
}

function Posts() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [postList, setPostList] = useState<Array<IPost>>([])
  const [visiblePostModal, setVisibelPostModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null)
  const [deletePost, setDeletePost] = useState<IPost | null>(null)

  const sortedPosts = useMemo(
    () =>postList.sort((a, b) => {
      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      return 0
    }) ,[postList])
  
  useEffect(()=>{
    const getPosts = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const response = await api.get<Array<IPost>>('/posts')
        const posts = response.data
  
        if (!posts || !Array.isArray(posts)) throw new Error('Não foi possível encontar suas postagens, tente novamente mais tarde.')
        setPostList(posts)
      } catch (err) {
        setErrorMessage(err.message)
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    getPosts()
  },[])



  return (
    <div>
      <PostFormModal
        onAddeNewPost={(newPost) => {
          setPostList(prev => [...prev,newPost])
        }}
        onClose={() => { setVisibelPostModal(false)}}
        visible={visiblePostModal}
        validate={(newPost) => {
          const alreadyExistTitle = postList.find(post => 
            String(post.title).toLowerCase() === String(newPost.title).toLowerCase()
          )

          if (alreadyExistTitle) return 'Já exite uma postagem com esse título.'
          return null
        }}
      />

      <CommentModal
        post={selectedPost}
        onClose={() => {
          setSelectedPost(null)
        }}
      />
      
      <ReactModal 
        shouldCloseOnOverlayClick
        onRequestClose={ () => {
          setDeletePost(null)
        }}
        isOpen={Boolean(deletePost)}
      >
        <p>Atenção! Ao excluir esta postagem os comentários também serão excluídos</p>
      </ReactModal>


      <div>
        <button onClick={()=> setVisibelPostModal(true)}>
          + Nova Postagem 
        </button>
      </div>
      
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Conteúdo</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(sortedPosts) && sortedPosts.map(post => (
              <tr key={post.id} onClick={()=> {setSelectedPost(post)}}>
               <td>{post.id}</td>
               <td>{post.title}</td>
               <td>{post.body}</td>
               <td>
                  <AiFillDelete onClick={(e: Event) => {
                      e.stopPropagation()
                      setDeletePost(post)
                    }} 
                  />
                </td>
             </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Posts