const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }




    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }





    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('error saving products:', error);
        }
    }


    addsProduct(product) {
        const { title, descripcion, price, thumbnail, code, stock } = product;
        if (!title || !description || !price || !thumbnail || !code || !stock === undefined ) {
            throw new Error('All fields are required');
        }

        if (this.products.some(p => p.code === code)) {
            throw new Error('product code must be unique');
        };

        const newProduct = {
            id: this.products.length > 0 ?
            this.products[this.products.length - 1].id + 1 : 1, ...product
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error('Not found');
        }
        return product;
    }


    updateProduct(id, updatedProduct) {
         const productIndex = this.products.findIndex(p => p.id === id);
         if (productIndex === -1) {
             throw new Error('Not found');
         }


         this.products[productIndex] = 
         {...this.products[productIndex],...updatedProduct };
         this.saveProducts();
         return this.products[productIndex];


       }


       deleteProduct(id) {
        const productIndex = 
        this.products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            throw new Error('Not found');
        }

        const deletedProduct = 
        this.products.splice(productIndex, 1);
        this.saveProducts();
        return deletedProduct[0];
       }
}

module.exports = ProductManager;


const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const port = 3000;


const productManager = new ProductManager('./products.json');


app.use(express.json());

app.get('/products', async (req, res) => {
   const limit = req.query.limit;
   let products = await productManager.getProducts();
   if (limit) {
products = products.slice(0, Number(limit));
   
      }
      res.json(products);
});

app.get('/products/:pid', async (req, res) => {
const pid = parseInt(req.params.pid);
try {
    const product = await productManager.getProductById(pid);
    res.json(product);
} catch (error) {
    res.status(404).send(error.message);
}
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const exphbs = require('express-handlebars');
const path = require('path');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('newProduct', async (product) => {
      try {
        const newProduct = await productManager.addsProduct(product);
        io.emit('updateProducts', newProduct);
      }  catch (error) {
        console.log('error.message');
      }
    });


    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




