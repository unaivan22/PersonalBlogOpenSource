import { useState, useEffect } from 'react'
import supabase from './SupabaseClient'
import { useNavigate } from 'react-router-dom'; 
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function Signin() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
        navigate("/lists");
    }
    }, [session, navigate]);

  if (!session) {
    return <div className='grid h-screen place-items-center '>
      
      <div className='text-center max-w-sm w-full'>
        <div className='flex flex-col gap-y-1'>
          <div className='flex flex-col justify-center items-center gap-x-2 mt-2'>
            {/* <img src='/notes.svg' className='w-16' /> */}
            <h1 className="mt-2 font-bold text-3xl herotext pixel-typeface">Blogs</h1>
          </div>
          <p className='text-sm graygradient pixel-typeface'>Whatever your written</p>
        </div>
        <div className="auth w-full text-left">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[""]}
            // view="sign_in"
          />
        </div>
      </div>
      {/* <Footer /> */}
    </div>;
  } else {
    return <div>Logged in!</div>;
  }
}