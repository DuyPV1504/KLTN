const bcrypt = require('bcrypt'); // Hoặc 'bcryptjs' nếu bạn dùng bcryptjs
const password = '123456';
const saltRounds = 10;  // Số vòng salt

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Lỗi mã hóa:', err);
  } else {
    console.log('Mã hóa mật khẩu:', hashedPassword);
  }
});
