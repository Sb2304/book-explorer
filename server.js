const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const MONGO_URI = 'mongodb://127.0.0.1:27017/book-explorer-db';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:',err));


const bookSchema = new mongoose.Schema({
    title:{type:String,unique:true},
    price:Number,
    stockAvailability:String,
    rating:Number,
    detailPageUrl:String,
    imageUrl:String
});

const Book= mongoose.model('Book',bookSchema);


app.get('/api/books',async(req, res) => {
    try {
        const {page = 1, limit = 20, search, rating, minPrice, maxPrice, inStock}=req.query;

        const query={};

        if (search){
            query.title = {$regex:search, $options: 'i'};
        }

        if (rating){
            query.rating = {$lte:parseInt(rating)};
        }

       const priceQuery = {};
        if (minPrice && parseFloat(minPrice) > 0) {
            priceQuery.$gte = parseFloat(minPrice);
        }
        if (maxPrice && parseFloat(maxPrice) > 0) {
            priceQuery.$lte = parseFloat(maxPrice);
        }
        if (Object.keys(priceQuery).length > 0) {
            query.price = priceQuery;
        }

        if (inStock){
            if (inStock === 'true'){
                query.stockAvailability = 'In stock';
            }else if (inStock === 'false'){
                query.stockAvailability = {$ne: 'In stock'};
            }
        }

        const books = await Book.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page)-1)*parseInt(limit));
        
        const totalBooks = await Book.countDocuments(query);

        res.status(200).json({
            books,
            totalPages:Math.ceil(totalBooks / parseInt(limit)),
            currentPage:parseInt(page),
            totalBooks
        });
    }catch (error){
        console.error('Error fetching books:',error);
        res.status(500).json({message:'Server Error'});
    }
});

app.get('api/books/:id', async (req,res)=>{
    try{
        const book = await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({message: 'Book not found'});
        }
        res.status(200).json(book);
    }catch (error) {
        console.error('Error fetching book by ID:', error);

        if (error.kind === 'ObjectId'){
            return res.status(404).json({message:'Book not found'});
        }
        res.status(500).json({message:'Server Error'});
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})