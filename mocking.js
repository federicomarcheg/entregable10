const falker = require('falker');

app.get('/mockingproducts', (req, res) => {
    const mockProduct = [];
    for (let i = 0; i < 100; i++) {
        mockProduct.push({
            id: falker.commerce.productName(),
            title: falker.commerce.productName(),
            description: falker.lorem.paragraph(),
            price: falker.commerce.price(),
            thumbnail: falker.image.imageUrl(),
            code: falker.datatype.uuid(),
            stock: falker.datatype.number({ min: 1, max: 100 }),
        });
    }
    res.json(mockProduct);
});


class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// Uso de error CustomError

app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
         res.status(err.status).send({ msg: err.message });
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});


const express = require('express');
const app = express();
const generateMockProduct = require('/mocking');

app.get('/mockingproducts',  (req, res, next) => {
    const mockProducts = generateMockProduct(100);
    res.json(mockProducts);
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Server running at http://localhost:${port}`);
});