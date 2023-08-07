import {useEffect,useState} from 'react'
import { IPost } from '../../views/Posts/Posts'
import ReactModal from 'react-modal'
import axios from 'axios'
import api from '../../services/api'
import { useFormik } from 'formik'
import { AiOutlineClose,AiFillExclamationCircle} from 'react-icons/ai'
import { useAlert } from 'react-alert'

type Props = {
  post: IPost | null
  onClose: () => void
}

interface IComment  {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

interface ICommentForm  {
  title: string, 
  body:string, 
  postId?: number
}


function CommentModal({post, onClose}: Props) {
  const [comments, setComments] = useState<Array<IComment>>([])
  const [isLoading, setIsLoading] = useState(false)
  const alert = useAlert()


  
  const validateFields = (values: ICommentForm) => {
    const errors: {[key in keyof ICommentForm]?: string}= {}

    if (!values.title) {
      errors.title = 'O campo title é obrigatório'
    }

    if (!values.body) {
      errors.body = 'O campo body é obrigatório'
    }


    return errors
  }

  useEffect(()=> {
    const source = axios.CancelToken.source()

    const getPostComments = async (post:IPost | null) => {
      try {
        setIsLoading(true)

        if (!post || !post.id) throw new Error("Não foi possível encontrar o ID da postagem, tente novamente mais tarde.")
        
        const response = await api.get<Array<IComment>>(`/comments?postId=${post.id}`,{ cancelToken: source.token})
        const comments = response.data

        if (!comments || !Array.isArray(comments)) throw new Error('Não foi possível obter os comentários dessa postagem.')
        setComments(comments)
        setIsLoading(false)

      } catch (err) {
        if (!axios.isCancel(err)){
          setIsLoading(false)
          alert.error(err.message)
        }
        console.log(err.message)
      }
    }

    getPostComments(post)

    return () => {
      source.cancel()
    }

  }, [post])

  const handleCreatePost = async  (values:ICommentForm) => {
    try {
      
      if (!post || !post.id) throw new Error("Não foi possível encontrar o ID da postagem, tente novamente mais tarde.")

      values.postId = post.id

      const response = await api.post<IComment>('/comments', values)
      const newComment = response.data
      newComment.email = 'myUser@mail.com'
      newComment.name = values.title
      form.resetForm()
      comments.push(newComment)
      alert.success('Comentário adicionado com sucesso.')
    } catch (err) {
      alert.error(err.message)
      console.log(err)      
    }

  }

  const form = useFormik({
    initialValues: {title: '', body: ''},
    validate: validateFields,
    onSubmit: handleCreatePost
  })

  return (
    <ReactModal 
      shouldCloseOnOverlayClick
      onRequestClose={onClose}
      isOpen={Boolean(post)}
      className='comment-modal'
    >
      <div className='comment-modal__header'>
        <h1 className='comment-modal__header-title'>Visualizar comentários</h1>
        <AiOutlineClose className='comment-modal__header-close-icon' onClick={onClose}/>
      </div>

      <div className='comment-modal__comments'>
        <h2 className='comment-modal__post-title'>
         {post?.id} {' - '}  {post?.title}
        </h2> 

        {
          Array.isArray(comments) && comments.map(comment => (
            <div key={comment.id} className='comment-modal__item-container'>
             <div className='comment-modal__item-header'>
              <p className='comment-modal__item-header-title'>{comment.name}</p>
              <p className='comment-modal__item-header-email'>{comment.email}</p>
             </div>
              <p className='comment-modal__item-text'>{comment.body}</p>
            </div>
          ))
        }
      </div>

      <form className='comment-modal__form' onSubmit={form.handleSubmit}>
       
       <div className='comment-modal__form-item'>
         <label 
           htmlFor="title"
           className='comment-modal__form-item-label'
         > 
           Title
           <span className='comment-modal__form-item-required'>*</span>
         </label>
         <input 
           type="text"
           name="title"
           id="title"
           onChange={form.handleChange}
           value={form.values.title}  
           className='comment-modal__form-item-input'
           placeholder='Dígite o título da sua postagem'
         />      
         {form.errors.title && (
           <p className='comment-modal__form-item-error'>
             <AiFillExclamationCircle/>{' '}
             {form.errors.title}
           </p>
         )}
       </div>

       <div className='comment-modal__form-item'>

         <label 
           htmlFor="body"
           className='comment-modal__form-item-label'
         >
           Body
           <span className='comment-modal__form-item-required'>*</span>
         </label>
         <textarea
           name="body" 
           id="body" 
           rows={4}
           onChange={form.handleChange}
           value={form.values.body}  
           className='comment-modal__form-item-input'
           placeholder='Dígite o conteúdo da sua postagem'
         />
         {form.errors.body && (
           <p className='comment-modal__form-item-error'>
             <AiFillExclamationCircle/>{' '}
             {form.errors.body}
           </p>
         )}
       </div>
     </form>

     <div className='comment-modal__footer'>
       <button 
         className='button__primary'
         onClick={() => form.submitForm()}
       >
          Adicionar comentário
       </button>
     </div>
    </ReactModal>
  )
}

export default CommentModal