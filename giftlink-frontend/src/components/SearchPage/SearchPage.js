import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [selectedCondition, setSelectedCondition] = useState('');
const [ageYears, setAgeYears] = useState(10);
const [searchResults, setSearchResults] = useState([]);

function SearchPage() {

    //Task 1: Define state variables for the search query, age range, and search results.
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const performSearch = async () => {
    try {
        let url = `${urlConfig.backendUrl}/api/gifts?name=${searchQuery}&category=${selectedCategory}&condition=${selectedCondition}&age_years=${ageYears}`;
        const response = await fetch(url);
        const data = await response.json();
        setSearchResults(data);
    } catch (error) {
        console.error('Search error:', error);
    }
};

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        const goToDetailsPage = (productId) => {
            navigate(`/app/product/${productId}`);
        };
        




    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                            <select className="form-select mb-2" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
    <option value="">All Categories</option>
    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
</select>

<select className="form-select mb-2" value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)}>
    <option value="">All Conditions</option>
    {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
</select>

                            {/* Task 4: Implement an age range slider and display the selected value. */}
                            <label>Max Age (Years): {ageYears}</label>
<input type="range" className="form-range" min="0" max="10" value={ageYears} onChange={e => setAgeYears(e.target.value)} />

                        </div>
                    </div>
                    {/* Task 7: Add text input field for search criteria*/}
                    <input type="text" className="form-control mb-2" placeholder="Search by name"
       value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />

                    {/* Task 8: Implement search button with onClick event to trigger search:*/}
                    <button className="btn btn-primary" onClick={performSearch}>Search</button>

                    {/*Task 5: Display search results and handle empty results with a message. */}
                    <div className="mt-4">
    <h5>Search Results</h5>
    {searchResults.length === 0 ? (
        <p>No results found</p>
    ) : (
        searchResults.map((gift) => (
            <div key={gift.id} className="card mb-2 p-2" onClick={() => goToDetailsPage(gift.id)}>
                <h6>{gift.name}</h6>
                <p>Category: {gift.category} | Condition: {gift.condition}</p>
            </div>
        ))
    )}
</div>

                </div>
            </div>
        </div>
    );
}

export default SearchPage;
