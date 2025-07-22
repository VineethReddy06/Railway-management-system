function register() {
    const userId = document.getElementById('regUserId').value;
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value;
  
    fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: userId, password: password, email: email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Registered successfully!');
        showPage('loginPage');
      } else {
        alert('Registration failed!');
      }
    });
  }
  