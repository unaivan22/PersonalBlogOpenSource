import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'ENTER_PROJECT_URL_HERE'
const supabaseKey = 'ENTER_KEY_HERE'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase