const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createDemoUser() {
  const email = 'demo@example.com';
  const password = 'demo123456';

  console.log('Creating demo user...');
  console.log('Email:', email);
  console.log('Password:', password);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: 'Demo',
        last_name: 'User',
        role: 'seller'
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }

  console.log('\n✓ Demo user created successfully!');
  console.log('\nLogin credentials:');
  console.log('Email: demo@example.com');
  console.log('Password: demo123456');
  console.log('\nUser ID:', data.user?.id);
}

createDemoUser();
