const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{type:String,unique:true},
    price:Number,
    stockAvailability:String,
    rating:Number,
    detailPageUrl:String,
    imageUrl:String
});

const Book= mongoose.model('Book',bookSchema)

async function scrapeAllPages() {
    const baseUrl = 'https://books.toscrape.com/';
    let currentPageUrl = baseUrl + 'catalogue/page-1.html'
    let pageNumber = 1;
    let booksScraped = 0;

    console.log('Scraping...');

    while (currentPageUrl){
        try{
            console.log(`Scraping page ${pageNumber}: ${currentPageUrl}`);
            const response = await axios.get(currentPageUrl);
            const $ = cheerio.load(response.data);

            const booksOnPage = $('article.product_pod');
            if (booksOnPage === 0){
                console.log('No more books found. Ending Scraping.');
                break;   
            }

            for(const ele of booksOnPage){
                const bookElement = $(ele);

                const parseRating = (ratingClass)=>{
                    const ratings = {'One':1,'Two':2,'Three':3,'Four':4,'Five':5}
                    return ratings[ratingClass] || 0;
                };

                const title = bookElement.find('h3 a').attr('title');
                const priceText = bookElement.find('.price_color').text().trim();
                const stockAvailability = bookElement.find('.availability').text().trim();
                const ratingClass = bookElement.find('.star-rating').attr('class').split(' ')[1];
                const detailPageUrl = new URL(bookElement.find('h3 a').attr('href'),baseUrl).href;
                const imageUrl = new URL(bookElement.find('.thumbnail').attr('src'),baseUrl).href;

                const bookData = {
                    title:title,
                    price:parseFloat(priceText.replace('£','')),
                    stockAvailability:stockAvailability,
                    rating:parseRating(ratingClass),
                    detailPageUrl:detailPageUrl,
                    imageUrl:imageUrl
                };

                await Book.findOneAndUpdate({title:bookData.title},bookData,{upsert:true});
                booksScraped++;
            }
            const nextPagePath = $('.next a').attr('href');
            if(nextPagePath){
                currentPageUrl = new URL(nextPagePath,baseUrl + 'catalogue/').href;
                pageNumber++;
            }else{
                currentPageUrl = null;
            }
            
        }catch(error){
            console.error(`Error scraping ${currentPageUrl}:`,error.message);
            currentPageUrl=null;
        }
    }

    console.log(`Scraping finished. Total books processed: ${booksScraped}.`);    
}


async function main(){
    const mongoURI = 'mongodb://127.0.0.1:27017/book-explorer-db'
    console.log('connecting to MongoDB...');
    try{
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected succesfully');
        await scrapeAllPages();
    }catch (error){
        console.error('Failed to connect to MongoDB or run scraper:',error);
    }finally{
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');   
    }
}

main();