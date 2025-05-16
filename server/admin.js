// import bcrypt from 'bcrypt';

// async function generateAdminPassword() {
//   const saltRounds = 10; // The number of salt rounds (higher is more secure but slower)
//   const plainTextPassword = 'admin'; // Replace with a strong password

//   try {
//     const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
//     console.log('Hashed Password for Admin:', hashedPassword);
//     return hashedPassword;
//   } catch (error) {
//     console.error('Error hashing password:', error);
//     return null;
//   }
// }

// // Call the function to generate the hash
// generateAdminPassword();