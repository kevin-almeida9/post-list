import {useEffect,useState} from 'react'
import { IPost } from '../../views/Posts/Posts'
import ReactModal from 'react-modal'
import axios from 'axios'
import api from '../../services/api'
import { useFormik } from 'formik'

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
  const [errorMessage, setErrorMessage] = useState('')


  
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
        setErrorMessage('')

        if (!post || !post.id) throw new Error("Não foi possível encontrar o ID da postagem, tente novamente mais tarde.")
        
        const response = await api.get<Array<IComment>>(`/comments?postId=${post.id}`,{ cancelToken: source.token})
        const comments = response.data

        if (!comments || !Array.isArray(comments)) throw new Error('Não foi possível obter os comentários dessa postagem.')
        setComments(comments)
        setIsLoading(false)

      } catch (err) {
        if (!axios.isCancel(err)){
          setIsLoading(false)
          setErrorMessage(err.message)
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
    } catch (err) {
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
    >
      <div className='comment-modal__header'>
        <h1>Visualizar comentários</h1>
        <h2 className='comment-modal__header-title'>
          <span className='comment-modal__header-title-emphasis'>{post?.id}</span>
          {post?.title}
        </h2> 
      </div>

      <div className='comment-modal__wrapper'>
        {
          Array.isArray(comments) && comments.map(comment => (
            <div key={comment.id} className='comment-modal__item-container'>
              <p className='comment-modal__item-email'>{comment.email}</p>
              <p className='comment-modal__item-title'>{comment.name}</p>
              <p className='comment-modal__item-text'>{comment.body}</p>
            </div>
          ))
        }
      </div>

      <div className='comment-modal__form'>
      <form onSubmit={form.handleSubmit}>
        <label htmlFor="title"> Title</label>
          <input 
            type="text"
            name="title"
            id="title"
            onChange={form.handleChange}
            value={form.values.title}  
          />
      
        {form.errors.title && <span>{form.errors.title}</span>}

        <label htmlFor="body">Body</label>
        <textarea
          name="body" 
          id="body" 
          rows={10}
          onChange={form.handleChange}
          value={form.values.body}  
        />
        {form.errors.body && <span>{form.errors.body}</span>}
    

        <input type="submit" value="Criar postagem"/>
      </form>

      </div>
    </ReactModal>
  )
}

export default CommentModal