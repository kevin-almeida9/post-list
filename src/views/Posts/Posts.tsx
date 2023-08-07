import {useEffect, useState, useMemo} from 'react'
import api from '../../services/api'
import { AiFillDelete, AiOutlineClose } from "react-icons/ai"
import PostFormModal from '../../components/PostFormModal/PostFormModal'
import CommentModal from '../../components/CommentModal/CommentModal'
import ReactModal from 'react-modal'
import MainLayout from '../../layouts/MainLayout/MainLayout'

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

  const handelDeletePost = (post: IPost | null) => {
    try {
      if (!post || !post.id) throw new Error('Não foi possível encontrar o ID da postagem, tente novamente mais tarde.')

      api.delete(`/posts/${post.id}`)
      setPostList(prev => prev.filter(item => item.id !== post.id))
      setDeletePost(null)

    } catch (err) {
      console.log(err)
    }

  }

  return (
    <MainLayout>
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
        className='post__delete-modal'
      >
        <div className='post__delete-modal-header'>
          <h1 className='post__delete-modal-header-title'>Deletar postagem</h1>
          <AiOutlineClose className='post__delete-modal-header-close-icon' onClick={() => setDeletePost(null)}/>
        </div>

        <div className='post__delete-modal-content'>
          <p className='post__delete-modal-content-warning'>Atenção! Ao excluir esta postagem os comentários também serão excluídos</p>
          <p className='post__delete-modal-content-item'>{deletePost?.id} - {deletePost?.title}</p>
        </div>
      
        <div className='post__delete-modal-footer'>
          <button className="button__ghost" onClick={() => setDeletePost(null)}>Cancelar</button>
          <button className="button__primary" onClick={() => handelDeletePost(deletePost)}>Excluir</button>
        </div>
        
      </ReactModal>


      <div className='post'>
        <div className='post__actions-wrapper'>
          <button className="button__primary" onClick={()=> setVisibelPostModal(true)}>
            + Nova Postagem 
          </button>
        </div>
      
        <table className='post__table'>
          <thead className='post__table-header'>
            <tr>
              <th className='post__table-header-item'>ID</th>
              <th className='post__table-header-item'>Title</th>
              <th className='post__table-header-item'>Body</th>
              <th className='post__table-header-item'>Opções</th>
            </tr>
          </thead>

          <tbody className='post__table-content '>
            {Array.isArray(sortedPosts) && sortedPosts.map(post => (
              <tr 
                key={post.id} 
                onClick={()=> {setSelectedPost(post)}}
                className='post__table-content-row'
              >
               <td className='post__table-content-cell'>{post.id}</td>
               <td className='post__table-content-cell'>{post.title}</td>
               <td className='post__table-content-cell'>{post.body}</td>
               <td className='post__table-content-cell post__table-content-cell--action'>
                  <AiFillDelete 
                    className="post__delete-icon"
                    onClick={(e: Event) => {
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
    </MainLayout>
  )
}

export default Posts