import { useState } from 'react';

const Linechartsearchform = ({ onSearch }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    }
    return(
        <form onSubmit={handleSubmit} className="mb-5">
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">Search</button>
        </form>
    );
      
};
export default Linechartsearchform;