import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from './Filters';
import Pagination from './Pagination';

const BookCard = ({ book }) => {
    return (
        <div className='book-card'>
            <img src={book.imageUrl} alt={book.title} />
            <h3>{book.title}</h3>
            <p className="price">£{book.price}</p>
            <p>Rating: {book.rating} / 5</p>
            <p className="stock">{book.stockAvailability}</p>
        </div>
    );
};

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        rating: '',
        minPrice: '',
        maxPrice: ''
    });

    const [pagination, setPagination] = useState({
        currentPage:1,
        totalPages:1,
        totalBooks:0
    });

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    useEffect(()=>{
        setPagination(prev =>({ ...prev, currentPage:1}));
    },[filters]);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('page',pagination.currentPage);
                if (filters.search) params.append('search', filters.search);
                if (filters.rating) params.append('rating', filters.rating);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                const response = await axios.get(`http://localhost:5000/api/books?${params.toString()}`);

                if (response.data && Array.isArray(response.data.books)) {
                    setBooks(response.data.books);

                    setPagination({
                        currentPage:response.data.currentPage,
                        totalPages:response.data.totalPages,
                        totalBooks:response.data.totalBooks
                    });
                } else {
                    setError('Received invalid data format from server.');
                }
            } catch (err) {
                setError('Failed to fetch books. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timerId = setTimeout(() => {
            fetchBooks();
        }, 500);

        return () => clearTimeout(timerId);
    }, [filters, pagination.currentPage]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="book-list=container">
            <Filters filters={filters} setFilters={setFilters} />
            <p className="results-count">{pagination.totalBooks} books found.</p>
            {loading ? (
                <p>Loading books...</p>
            ) : (<>
                    <div className="book-grid">
                        {books.length > 0 ? (
                            books.map((book) =>
                                <BookCard key={book._id} book={book} />)
                        ) : (
                            <p>No books match your search.</p>
                        )}
                    </div>
                    <Pagination pagination={pagination} onPageChange={handlePageChange}/>
                </>
            )}
        </div>
    );
};

export default BookList;
