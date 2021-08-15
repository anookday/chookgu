import { useRouter } from 'next/router'
import Button from './Button'
import api from '../utils/api'

// TODO: make an actual dropdown menu
const AccountDropdown = () => {
  const router = useRouter()

  const logout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    try {
      await api.post('/auth/logout')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Already logged out.')
      } else {
        console.log('Unknown error occurred.')
      }
    } finally {
      router.push('/')
    }
  }

  return (
    <div className="dropdown">
      <Button text="Log Out" onClick={logout} />
    </div>
  )
}

export default AccountDropdown
