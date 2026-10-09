import './globals.css';
import { Routes, Route} from 'react-router-dom';
import LoginForm from './_auth/forms/LoginForm';
import RegisterForm from './_auth/forms/RegisterForm';
import AuthLayout from './_auth/AuthLayout';
import { CreatePost, Home } from './_root/pages';
import RootLayout from './_root/RootLayout';
import { Toaster } from './components/ui/toaster';
import Explore from './_root/pages/explore';
import ProjectGroups from './_root/pages/ProjectGroups';

const App = () => {

  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<LoginForm />}/>
          <Route path='/register' element={<RegisterForm />} />
        </Route>

        {/* private routes */}  
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/explore" element={<Explore />}/>
          <Route path="/all-users" element={<ProjectGroups />}/>
        </Route>
      </Routes>
    <Toaster />
    </main>
  )
}

export default App