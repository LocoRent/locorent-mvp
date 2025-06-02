
const supabaseUrl = 'https://flnjalgqtkqycsaymmbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbmphbGdxdGtxeWNzYXltbWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTkwOTAsImV4cCI6MjA2NDQzNTA5MH0.pPDeWCrjDrOGeHVJy5YmMQFYUGl7nvAyx3uxhQYNH_Q';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Registration
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const messageDiv = document.getElementById('register-message');
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    if (password !== passwordConfirm) {
      messageDiv.textContent = '❌ Passwörter stimmen nicht überein.';
      messageDiv.classList.add('error');
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      messageDiv.textContent = '❌ ' + error.message;
      messageDiv.classList.add('error');
    } else {
      messageDiv.textContent = '✅ Registrierung erfolgreich. Bestätige deine E-Mail.';
      messageDiv.classList.add('success');
      setTimeout(() => { window.location.href = 'login.html'; }, 4000);
    }
  });
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      messageDiv.textContent = '❌ ' + error.message;
      messageDiv.classList.add('error');
    } else {
      messageDiv.textContent = '✅ Login erfolgreich. Weiterleitung...';
      messageDiv.classList.add('success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    }
  });
}
