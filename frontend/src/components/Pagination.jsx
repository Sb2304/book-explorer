import React from 'react'

const Pagination = ({pagination, onPageChange}) => {
    const {currentPage, totalPages}=pagination;

    const handlePrevious = () =>{
        if (currentPage > 1){
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = ()=>{
        if (currentPage < totalPages){
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1){
        return null;
    }
  return (
    <div className='pagination-container'>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        &laquo; Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Next &raquo;
      </button>
    </div>
  )
}

export default Pagination;
