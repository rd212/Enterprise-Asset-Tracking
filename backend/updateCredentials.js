const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Department = require('./models/Department');
const Asset = require('./models/Asset');

dotenv.config();

function generateEmployeeEmail(name, usedEmails) {
  // Convert name to lowercase and remove spaces & special characters
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let baseEmail = `${cleanName}12kar@gmail.com`;
  let email = baseEmail;
  let counter = 2;

  while (usedEmails.has(email)) {
    email = `${cleanName}${counter}12kar@gmail.com`;
    counter++;
  }

  usedEmails.add(email);
  return email;
}

const updateEmployeeCredentials = async () => {
  try {
    await connectDB();

    console.log('--- STARTING EMPLOYEE CREDENTIALS UPDATE ---');

    const users = await User.find().sort({ createdAt: 1 });
    console.log(`Found ${users.length} employee/user records in database.`);

    const usedEmails = new Set();
    const updateResults = [];

    // Pre-hash password '12345' with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345', salt);

    for (const user of users) {
      const newEmail = generateEmployeeEmail(user.name, usedEmails);
      
      // Update email and password in MongoDB without mutating other fields or timestamps
      await User.collection.updateOne(
        { _id: user._id },
        { 
          $set: { 
            email: newEmail, 
            password: hashedPassword 
          } 
        }
      );

      updateResults.push({
        id: user._id.toString(),
        name: user.name,
        email: newEmail,
        passwordHashed: hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$')
      });
    }

    console.log('\nUpdated Employees:');
    updateResults.forEach((emp, index) => {
      console.log(`${index + 1}. Name: ${emp.name} | Email: ${emp.email} | Hashed: ${emp.passwordHashed}`);
    });

    // Verification
    console.log('\n--- VERIFICATION ---');

    // 1. Verify bcrypt hash for password '12345'
    let allPasswordsValid = true;
    for (const res of updateResults) {
      const updatedUser = await User.findById(res.id);
      const isMatch = await updatedUser.matchPassword('12345');
      if (!isMatch) {
        allPasswordsValid = false;
        console.error(`Password match failed for employee ${updatedUser.name}`);
      }
    }
    console.log(`All Employee Passwords Bcrypt Verified: ${allPasswordsValid ? 'YES' : 'NO'}`);

    // 2. Verify Admin Login unchanged
    const admin = await Admin.findOne({ email: 'admin@gmail.com' });
    const adminPasswordValid = admin ? await admin.matchPassword('admin123') : false;
    console.log(`Admin Login Preserved (admin@gmail.com / admin123): ${adminPasswordValid ? 'YES' : 'NO'}`);

    // 3. Verify Assets & Departments intact
    const departmentCount = await Department.countDocuments();
    const assetCount = await Asset.countDocuments();
    const assignedAssets = await Asset.countDocuments({ assignedTo: { $ne: null } });
    console.log(`Departments preserved: ${departmentCount}`);
    console.log(`Assets preserved: ${assetCount} (Assigned: ${assignedAssets})`);

    console.log('\n--- EMPLOYEE CREDENTIALS UPDATE COMPLETED ---');
    process.exit(0);
  } catch (error) {
    console.error(`Update Error: ${error.message}`);
    process.exit(1);
  }
};

updateEmployeeCredentials();
