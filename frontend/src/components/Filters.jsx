import React from 'react';

const Filters = ({filters,setFilters}) => {
    const handleInputChange = (e) =>{
        const {name, value} = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]:value
        }));
    };

  return (
    <div className='filters-container'>
        <input type="text" name="search" placeholder="Search by title..." value={filters.search} onChange={handleInputChange} className="filter-input" />
        <select name="rating" value={filters.rating} onChange={handleInputChange} className="filter-select">
            <option value="">All Ratings</option>    
            <option value="5">5 Stars & Below</option>    
            <option value="4">4 Stars & Below</option>    
            <option value="3">3 Stars & Below</option>    
            <option value="2">2 Stars & Below</option>    
            <option value="1">1 Star</option>    
        </select>
        <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleInputChange} className="filter-input" />
        <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleInputChange} className="filter-input" />      
    </div>
  )
}

export default Filters;
