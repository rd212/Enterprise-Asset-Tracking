const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const User = require('./models/User');
const Department = require('./models/Department');
const Asset = require('./models/Asset');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // 1. Seed Admin
    const adminExists = await Admin.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      await Admin.create({
        name: 'Administrator',
        email: 'admin@gmail.com',
        password: 'admin123'
      });
      console.log('Admin user seeded (admin@gmail.com / admin123)');
    } else {
      console.log('Admin user already exists.');
    }

    // 2. Seed IT Department
    let dept = await Department.findOne({ name: 'IT' });
    if (!dept) {
      dept = await Department.create({
        name: 'IT',
        description: 'Information Technology Department'
      });
      console.log('IT Department seeded.');
    }

    // 3. Seed Test Employee
    let emp = await User.findOne({ email: 'rahulpatel12kar@gmail.com' });
    if (!emp) {
      emp = await User.create({
        name: 'Rahul Patel',
        email: 'rahulpatel12kar@gmail.com',
        password: '12345',
        phone: '9876543210',
        department: dept._id,
        position: 'Software Developer'
      });
      console.log('Test Employee seeded (rahulpatel12kar@gmail.com / 12345)');
    } else {
      // Ensure test employee password is set
      emp.password = '12345';
      await emp.save();
      console.log('Test Employee password updated.');
    }

    // 4. Seed Test Assigned Asset
    let asset = await Asset.findOne({ assetCode: 'AST-EMP-001' });
    if (!asset) {
      await Asset.create({
        assetName: 'Dell XPS Laptop',
        assetCode: 'AST-EMP-001',
        category: 'Laptop',
        brand: 'Dell',
        purchaseDate: new Date('2026-08-01'),
        price: 85000,
        status: 'Assigned',
        assignedTo: emp._id,
        description: 'Dedicated developer laptop'
      });
      console.log('Test Asset assigned to employee seeded.');
    }

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
