import express from 'express';
import { pool } from './database.mjs';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
const allowedOrigins = ['https://your-netlify-site.netlify.app'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.post('/users', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { date, Purchaseid, Vendorid, Vendorname, Amount } = req.body;

    if (!date || !Purchaseid || !Vendorid || !Vendorname || !Amount) {
      throw new Error('Missing required fields');
    }

    console.log('Executing query...');
    const results = await pool.execute(
      'INSERT INTO itemtable (Date, Purchaseid, Vendorid, VendorName, Amount) VALUES(?,?,?,?,?)',
      [date, Purchaseid, Vendorid, Vendorname, Amount]
    );
    console.log('Query executed successfully!');
    res.send(results);
    
  } catch (err) {
    console.error('Error in /users route:', err);
    console.error('Request body:', req.body);
    res.status(500).send({ message: 'Error retrieving items' });
  }
});

app.get('/purchases', async (req, res) => {
  try {
    console.log('Fetching data...');
    const [rows] = await pool.execute('SELECT Date, Purchaseid, Vendorid, VendorName, Amount FROM itemtable');
    console.log('Data fetched successfully!');
    res.json(rows);
  } catch (err) {
    console.error('Error in /purchases route:', err);
    res.status(500).send({ message: 'Error retrieving items' });
  }
});

// DELETE route to delete a purchase by Purchaseid
app.delete('/purchases/:Purchaseid', async (req, res) => {
  try {
    const { Purchaseid } = req.params;
    console.log('Deleting purchase with ID: ${Purchaseid}');
    const results = await pool.execute('DELETE FROM itemtable WHERE Purchaseid = ?', [Purchaseid]);
    if (results[0].affectedRows === 0) {
      return res.status(404).send({ message: 'Purchase not found' });
    }
    console.log('Purchase deleted successfully!');
    res.send({ message: 'Purchase deleted successfully' });
  } catch (err) {
    console.error('Error in /purchases/:Purchaseid route:', err);
    res.status(500).send({ message: 'Error deleting purchase' });
  }
});


//ADD ELEMENTS IN THE INVENTORY TABLE
app.post('/invents', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { name, unit, purchasesprice, priceperunit, description } = req.body;

    if (!name) throw new Error('Missing required field: name');
    if (!unit) throw new Error('Missing required field: unit');
    if (!purchasesprice) throw new Error('Missing required field: purchasesprice');
    if (!priceperunit) throw new Error('Missing required field: priceperunit');
    if (!description) throw new Error('Missing required field: description');

    console.log('Executing query...');
    const results = await pool.execute(
      'INSERT INTO inventorytable (name, Unit, purchasesprice, priceperunit, description) VALUES(?,?,?,?,?)',
      [name, unit, purchasesprice, priceperunit, description]
    );
    
    console.log('Query executed successfully!');
    res.json(results);

  } catch (err) {
    console.error('Error in /invents route:', err);
    res.status(500).send({ message: `Error retrieving items: ${err.message}` });
  }
});


app.get('/inventory', async (req, res) => {
  try {
    console.log('Fetching inventory data...');
    const [results] = await pool.execute('SELECT  name, unit, purchasesprice, priceperunit, description FROM inventorytable');
    console.log('Inventory data fetched successfully!', results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching inventory data:', err);
    res.status(500).send({ message: `Error retrieving inventory data: ${err.message}` });
  }
});

app.delete('/inventory/:name', async (req, res) => {
  try {
    const {name } = req.params;
    console.log(`Deleting item with ID: ${name}`);

    const [results] = await pool.execute('DELETE FROM inventorytable WHERE name= ?', [name]);

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Item not found' });
    }

    console.log('Item deleted successfully!');
    res.send({ message: 'Item deleted successfully!' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).send({ message: `Error deleting item: ${err.message}` });
  }
});

//ADD ELEMENTS IN THE SALES PAGE

app.post('/sales', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { date, salesid, customerid,customername , amount} = req.body;

    if (!date) throw new Error('Missing required field: date');
    if (!salesid) throw new Error('Missing required field: salesid');
    if (!customerid) throw new Error('Missing required field: customerid');
    if (!customername) throw new Error('Missing required field:customername');
    if (!amount) throw new Error('Missing required field: amount');

    console.log('Executing query...');
    const results = await pool.execute(
      'INSERT INTO salestable (date, salesid, customerid, customername, amount) VALUES(?,?,?,?,?)',
      [date, salesid, customerid, customername, amount]
    );
    
    console.log('Query executed successfully!');
    res.json(results);

  } catch (err) {
    console.error('Error in /invents route:', err);
    res.status(500).send({ message: `Error retrieving items: ${err.message}` });
  }
});


// GET route to fetch sales data
app.get('/sales', async (req, res) => {
  try {
    console.log('Fetching sales data...');
    const [results] = await pool.execute('SELECT Date, salesid, customerid, customername, amount FROM salestable');
    console.log('Sales data fetched successfully!', results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching sales data:', err);
    res.status(500).send({ message: `Error retrieving sales data: ${err.message}` });
  }
});

app.delete('/sales/:salesid', async (req, res) => {
  try {
    const { salesid } = req.params;
    console.log(`Deleting sale with ID: ${salesid}`);
    await pool.execute('DELETE FROM salestable WHERE salesid = ?', [salesid]);
    console.log('Sale deleted successfully!');
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error deleting sale:', err);
    res.status(500).send({ message: `Error deleting sale: ${err.message}` });
  }
});




app.listen(6001, () => {
  console.log('Server listening on port 6001');
});
