const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import cors

const app = express();
const port = 4000;

app.use(express.json({ limit: '100mb' })); // Increase limit
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS for all requests





// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'test123',
  database: 'surveyapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); // Add `.promise()` here

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to MySQL database');
    connection.release(); // Release connection after testing
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello, Express with MySQL!');
});

// Fetch all users
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching users' });
    }
    res.json(results);
  });
});

// Fetch all employees
app.get('/employees', (req, res) => {
  pool.query('SELECT * FROM employee', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching employees' });
    }
    res.json(results);
  });
});

// Login route without bcrypt
app.post('/login', async (req, res) => {
  try {
      console.log("🚀 Received login request");

      const { userName, password } = req.body;
      console.log("📩 Request body:", req.body);

      if (!userName || !password) {
          console.log("⚠️ Missing username or password");
          return res.status(400).json({ message: "Username and password are required" });
      }

      console.log("🔍 Querying database for user:", userName);

      // Use pool.execute() instead of pool.query()
      const [results] = await pool.execute('SELECT * FROM employee WHERE employeeUserName = ?', [userName]);

      console.log("📊 Query executed, results:", results);

      if (results.length === 0) {
          console.log("⚠️ No user found with username:", userName);
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = results[0];
      console.log("✅ User found:", user);

      if (password !== user.employeePassword) {
          console.log("❌ Password does not match");
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      console.log("🎉 Login successful");

      delete user.employeePassword;
      res.json({ message: 'Login successful', user });

  } catch (error) {
      console.error("❌ Database error:", error);
      res.status(500).json({ message: 'Database error' });
  }
});


//admin login 

app.post('/adminLogin', async (req, res) => {
  try {
      console.log("🚀 Received login request");

      const { userName, password } = req.body;
      console.log("📩 Request body:", req.body);

      if (!userName || !password) {
          console.log("⚠️ Missing username or password");
          return res.status(400).json({ message: "Username and password are required" });
      }

      console.log("🔍 Querying database for user:", userName);

      // Use pool.execute() instead of pool.query()
      const [results] = await pool.execute('SELECT * FROM employee WHERE admintable = ?', [userName]);

      console.log("📊 Query executed, results:", results);

      if (results.length === 0) {
          console.log("⚠️ No user found with username:", userName);
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = results[0];
      console.log("✅ User found:", user);

      if (password !== user.password) {
          console.log("❌ Password does not match");
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      console.log("🎉 Login successful");

      delete user.password;
      res.json({ message: 'Login successful', user });

  } catch (error) {
      console.error("❌ Database error:", error);
      res.status(500).json({ message: 'Database error' });
  }
});


//insert User Details 

app.post('/saveUserDetails', async (req, res) => {
  try {
      const {
          ownerName, fatherHusbandName, buildingAddress, residenceAddress, coveredArea,
          openLandArea, roomDimensions, balconyCorridorDimensions, garageDimensions,
          carpetArea1, carpetArea2, fullName, address, pinCode, mobileNo, email, aadharCard,
          latitude, longitude, capturedImages, propertyType, locationBuildingLand,
          buildingConstructionType, landLocation, createdby
      } = req.body;

      const createat = new Date();

      // Use `query` instead of `execute`
      const [result] = await pool.query(
          `INSERT INTO userdetails (
              ownerName, fatherHusbandName, buildingAddress, residenceAddress, coveredArea,
              openLandArea, roomDimensions, balconyCorridorDimensions, garageDimensions,
              carpetArea1, carpetArea2, fullName, address, pinCode, mobileNo, email, aadharCard,
              latitude, longitude, capturedImages, propertyType, locationBuildingLand,
              buildingConstructionType, landLocation, createdby, createat
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
              ownerName, fatherHusbandName, buildingAddress, residenceAddress, coveredArea,
              openLandArea, roomDimensions, balconyCorridorDimensions, garageDimensions,
              carpetArea1, carpetArea2, fullName, address, pinCode, mobileNo, email, aadharCard,
              latitude, longitude, JSON.stringify(capturedImages), propertyType, locationBuildingLand,
              buildingConstructionType, landLocation, createdby, createat
          ]
      );

      res.status(201).json({ message: 'Property added successfully', propertyId: result.insertId });
  } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//getuserDetails

app.get('/getUserdetails', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM userdetails');
    res.json(results);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});


  

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
