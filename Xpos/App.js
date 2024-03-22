const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Configure the application to use JSON
app.use(express.json());

// Serve static files from the public directory
const publicDirectoryPath = path.join(__dirname,);
app.use(express.static(publicDirectoryPath));

// Define a POST route to receive cart data
app.post('/cart-data', (req, res) => {
    const cartData = req.body;
    const cartDataString = JSON.stringify(cartData, null, 2);

    fs.writeFile('cart-data.json', cartDataString, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('There was an error saving the cart data.');
        } else {
            res.send('Cart data was saved successfully.');
        }
    });
});

// Define a GET route to send cart data
app.get('/cart-data', (req, res) => {
    fs.readFile('cart-data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('There was an error reading the cart data.');
        } else {
            res.send(data);
        }
    });
});

// Define a DELETE route to delete an item from the cart
app.delete('/cart-data/:item', (req, res) => {
    const itemToDelete = req.params.item;

    fs.readFile('cart-data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('There was an error reading the cart data.');
        } else {
            const cartData = JSON.parse(data);
            const cart = cartData.cart;

            const index = cart.indexOf(itemToDelete);
            if (index !== -1) {
                cart.splice(index, 1);
            }

            const cartDataString = JSON.stringify(cartData, null, 2);

            fs.writeFile('cart-data.json', cartDataString, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('There was an error saving the cart data.');
                } else {
                    res.send('Item deleted successfully.');
                }
            });
        }
    });
});

// Handling 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(publicDirectoryPath, '404.html'));
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
