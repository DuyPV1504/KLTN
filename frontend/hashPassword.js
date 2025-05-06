const bcrypt = require('bcrypt'); 
const password = '123456';
const saltRounds = 10; 

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Lỗi mã hóa:', err);
  } else {
    console.log('Mã hóa mật khẩu:', hashedPassword);
  }
});
