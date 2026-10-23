const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Department = require('./models/Department');
const Asset = require('./models/Asset');
const express = require('express');
const http = require('http');

dotenv.config();

// Create app for local testing
const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/employee', require('./routes/employeeRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

const PORT = 5001; // test port

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

const runTests = async () => {
  await connectDB();
  const server = app.listen(PORT);

  console.log('\n========================================');
  console.log('      SYSTEM VERIFICATION TESTS');
  console.log('========================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, description) {
    totalTests++;
    if (condition) {
      console.log(`✅ TEST ${totalTests} PASSED: ${description}`);
      passedTests++;
    } else {
      console.error(`❌ TEST ${totalTests} FAILED: ${description}`);
    }
  }

  try {
    // 1. Verify all existing employees have unique generated emails ending with 12kar@gmail.com
    const users = await User.find();
    assert(users.length > 0, 'Database contains employee records');

    const emailSet = new Set();
    let allEmailsMatchFormat = true;
    users.forEach(u => {
      if (emailSet.has(u.email)) {
        allEmailsMatchFormat = false;
      }
      emailSet.add(u.email);
      if (!u.email.endsWith('12kar@gmail.com')) {
        allEmailsMatchFormat = false;
      }
    });
    assert(allEmailsMatchFormat && emailSet.size === users.length, 'All existing employees have unique generated emails ending with 12kar@gmail.com');

    // 2. Verify all employee passwords are bcrypt hashed & match '12345'
    let allBcryptHashed = true;
    let allPasswordsMatch = true;
    for (const u of users) {
      if (!u.password || !(u.password.startsWith('$2a$') || u.password.startsWith('$2b$'))) {
        allBcryptHashed = false;
      }
      const match = await bcrypt.compare('12345', u.password);
      if (!match) {
        allPasswordsMatch = false;
      }
    }
    assert(allBcryptHashed, 'All employee passwords are stored using bcrypt hash');
    assert(allPasswordsMatch, 'All employee passwords verify against plain-text "12345"');

    // 3. Admin Login API
    const adminLoginRes = await makeRequest('/api/auth/admin/login', 'POST', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    assert(adminLoginRes.status === 200 && adminLoginRes.data.token && adminLoginRes.data.user.type === 'admin', 'Admin login succeeds with admin@gmail.com / admin123');
    const adminToken = adminLoginRes.data?.token;

    // 4. Employee Login API
    const testEmpEmail = users[0].email;
    const empLoginRes = await makeRequest('/api/auth/user/login', 'POST', {
      email: testEmpEmail,
      password: '12345'
    });
    assert(empLoginRes.status === 200 && empLoginRes.data.token && empLoginRes.data.user.type === 'employee', `Employee login succeeds with ${testEmpEmail} / 12345`);
    const employeeToken = empLoginRes.data?.token;

    // 5. Employee Profile API
    const empProfileRes = await makeRequest('/api/employee/profile', 'GET', null, {
      Authorization: `Bearer ${employeeToken}`
    });
    assert(empProfileRes.status === 200 && empProfileRes.data.data.email === testEmpEmail, 'Employee Profile endpoint (/api/employee/profile) returns employee details');

    // 6. Employee My Assets API
    const empAssetsRes = await makeRequest('/api/employee/assets', 'GET', null, {
      Authorization: `Bearer ${employeeToken}`
    });
    assert(empAssetsRes.status === 200 && Array.isArray(empAssetsRes.data.data), 'Employee My Assets endpoint (/api/employee/assets) returns assigned assets');

    // 7. Admin Dashboard API (/api/users)
    const adminUsersRes = await makeRequest('/api/users', 'GET', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(adminUsersRes.status === 200 && Array.isArray(adminUsersRes.data.data), 'Admin Dashboard API (/api/users) returns all users');

    // 8. Role Restriction: Employee CANNOT access Admin-only API (/api/users)
    const empAccessAdminRes = await makeRequest('/api/users', 'GET', null, {
      Authorization: `Bearer ${employeeToken}`
    });
    assert(empAccessAdminRes.status === 403, 'Employee is blocked from Admin-only API (/api/users) with 403 Forbidden');

    // 9. Role Restriction: Admin CANNOT access Employee-only API (/api/employee/profile)
    const adminAccessEmpRes = await makeRequest('/api/employee/profile', 'GET', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(adminAccessEmpRes.status === 403, 'Admin is blocked from Employee-only API (/api/employee/profile) with 403 Forbidden');

    // 10. Existing asset assignments & department relationships preserved
    const deptCount = await Department.countDocuments();
    const assetCount = await Asset.countDocuments();
    assert(deptCount > 0 && assetCount > 0, 'Departments and Assets collections are intact');

    console.log(`\n========================================`);
    console.log(`   TEST RESULT: ${passedTests}/${totalTests} PASSED`);
    console.log(`========================================\n`);

    server.close();
    await mongoose.disconnect();
    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (err) {
    console.error('Test Error:', err);
    server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
};

runTests();
