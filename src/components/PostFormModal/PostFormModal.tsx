import {useState} from 'react'
import ReactModal from 'react-modal'
import { useFormik } from 'formik'
import api from '../../services/api'
import { IPost } from '../../views/Posts/Posts'
import {AiFillExclamationCircle, AiOutlineClose} from 'react-icons/ai'


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

  const handleClose = () => {
    form.resetForm()
    onClose()
  }

  return (
    <ReactModal 
      shouldCloseOnOverlayClick
      onRequestClose={handleClose}
      isOpen={visible}
      className="post-form-modal"
      ariaHideApp={false}
    >
      
      <div className='post-form-modal__header'>
        <h1 className='post-form-modal__header-title'>Nova postagem</h1>
        <AiOutlineClose className='post-form-modal__header-close-icon' onClick={handleClose}/>
      </div>

      <form className='post-form-modal__wrapper' onSubmit={form.handleSubmit}>
       
        <div className='post-form-modal__form-item'>
          <label 
            htmlFor="title"
            className='post-form-modal__form-item-label'
          > 
            Title
            <span className='post-form-modal__form-item-required'>*</span>
          </label>
          <input 
            type="text"
            name="title"
            id="title"
            onChange={form.handleChange}
            value={form.values.title}  
            className='post-form-modal__form-item-input'
            placeholder='Dígite o título da sua postagem'
          />      
          {form.errors.title && (
            <p className='post-form-modal__form-item-error'>
              <AiFillExclamationCircle/>{' '}
              {form.errors.title}
            </p>
          )}
        </div>

        <div className='post-form-modal__form-item'>

          <label 
            htmlFor="body"
            className='post-form-modal__form-item-label'
          >
            Body
            <span className='post-form-modal__form-item-required'>*</span>
          </label>
          <textarea
            name="body" 
            id="body" 
            rows={8}
            onChange={form.handleChange}
            value={form.values.body}  
            className='post-form-modal__form-item-input'
            placeholder='Dígite o conteúdo da sua postagem'
          />
          {form.errors.body && (
            <p className='post-form-modal__form-item-error'>
              <AiFillExclamationCircle/>{' '}
              {form.errors.body}
            </p>
          )}
        </div>
      </form>

      <div className='post-form-modal__footer'>
        <button 
          className='button__primary'
          onClick={() => form.submitForm()}
        >
          Criar postagem
        </button>
      </div>
    </ReactModal>
  )
}

export default PostFormModal