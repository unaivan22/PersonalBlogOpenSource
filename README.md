# How to use

 1. Go to [Supabase](https://supabase.com) and create an account.
 2. Create a new project with the name 'blogs' (or any name you prefer).
 3. Navigate to the **API Settings**:
 4. Copy and paste `supabaseUrl` and `supabaseKey` into `SupabaseClient.jsx`.
 5. Go to the **SQL Editor** and run the following command: `ALTER TABLE blogs ADD COLUMN user_id uuid REFERENCES auth.users ON DELETE CASCADE;`
 5. Go to the **blogs** table and create columns as shown in the image below:
![enter image description here](https://i.ibb.co.com/6wGkZPL/Screenshot-2024-07-11-at-20-19-26.png)
 6. To change the router page, edit `RouterPage.jsx`.
 7. Finish



# Customization

You can customize anything as this project is built using Vite, Tailwind CSS, and shadcn/ui.

Thank you.