import {useState} from 'react'
import ReactModal from 'react-modal'
import { useFormik } from 'formik'
import api from '../../services/api'
import { IPost } from '../../views/Posts/Posts'

type Props = {
  visible: boolean
  onClose: () => void
  onAddeNewPost: (newPost:IPost) => void
  validate:  (newPost:IPostForm) => string | null
}

interface IPostForm {
  title: string, 
  body:string
}

function PostFormModal({visible, onClose, onAddeNewPost, validate}:Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleCreatePost = async  (values:IPostForm) => {
    try {
      setErrorMessage('')
      setIsLoading(true)
      
      const invalidMessage = validate(values)
      if (invalidMessage) throw new Error(invalidMessage)
       

      const response = await api.post<IPost>('/posts', values)
      const newPost = response.data
      
      if(!newPost) throw new Error('Não foi possível criar uma nova Postagem, tente novamente mais tarde')
      onAddeNewPost(newPost)
      setIsLoading(false)
      form.resetForm()
      onClose()
      console.log(response)
    } catch (err) {
      setErrorMessage(err.message)
      console.log(err)      
      setIsLoading(false)
    }

  }

  const validateFields = (values: IPostForm) => {
    const errors: {[key in keyof IPostForm]?: string}= {}

    if (!values.title) {
      errors.title = 'O campo title é obrigatório'
    }

    if (!values.body) {
      errors.body = 'O campo body é obrigatório'
    }


    return errors
  }

  const form = useFormik({
    initialValues: {title: '', body: ''},
    validate: validateFields,
    onSubmit: handleCreatePost
  })

  return (
    <ReactModal 
      shouldCloseOnOverlayClick
      onRequestClose={ () => {
        form.resetForm()
        onClose()
      }}
      isOpen={visible}
    >
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
    </ReactModal>
  )
}

export default PostFormModal