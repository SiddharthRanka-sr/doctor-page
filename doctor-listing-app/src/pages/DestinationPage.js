import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import FilterPanel from '../components/Filters';
import DoctorCard from '../components/DoctorCard';

const DestinationPage = () => {
    const [filters, setFilters] = useState({});
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState(''); // Track sorting option

    // Fetch doctors based on filters and sort
    const fetchDoctors = async (filters, sortBy) => {
        setLoading(true);
        try {
            const params = {};

            // Adding filters to params
            if (filters.specializations && filters.specializations.length === 1) {
                params.specialization = filters.specializations[0];
            }

            if (filters.modeOfConsults && filters.modeOfConsults.length === 1) {
                params.modeOfConsult = filters.modeOfConsults[0];
            }

            if (filters.feeRanges && filters.feeRanges.length === 1) {
                params.feeRange = filters.feeRanges[0];
            }

            if (filters.ratingRanges && filters.ratingRanges.length === 1) {
                const minRatingMatch = filters.ratingRanges[0].match(/(\d+)/);
                if (minRatingMatch) {
                    params.minRating = parseInt(minRatingMatch[1], 10);
                }
            }

            // Adding sorting to params
            if (sortBy) {
                params.sortBy = sortBy; // Sort by the selected option
            }

            const response = await axios.get('http://localhost:5000/api/v1/doctors', { params });
            console.log('Doctors API response:', response.data);
            setDoctors(response.data.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced filter change handler
    const debouncedFilterChange = useCallback(
        debounce((selectedFilters) => {
            console.log('Filters changed:', selectedFilters);
            setFilters(selectedFilters);
        }, 300),
        []
    );

    // Fetch doctors when filters or sort change
    useEffect(() => {
        if (
            filters.specializations ||
            filters.modeOfConsults ||
            filters.feeRanges ||
            filters.ratingRanges ||
            sortBy // Add sortBy as a dependency
        ) {
            fetchDoctors(filters, sortBy);
        }
    }, [filters, sortBy]); // Re-run when either filters or sortBy changes

    return (
        <div className="destination-page" style={{ display: 'flex', padding: '20px', gap: '20px' }}>
            {/* Filter panel on the left */}
            <div style={{ flex: 1, paddingRight: '20px' }}>
                <FilterPanel onFilterChange={debouncedFilterChange} />
            </div>

            {/* Sorting dropdown on the right */}
            <div style={{ width: '200px', textAlign: 'right' }}>
                <label htmlFor="sortBy">Sort by:</label>
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                        padding: '10px',
                        fontSize: '14px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        cursor: 'pointer'
                    }}
                >
                    <option value="">Select...</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="experience-asc">Experience: Low to High</option>
                    <option value="experience-desc">Experience: High to Low</option>
                </select>
            </div>

            {/* Doctors list */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '20px', color: '#004085' }}>
                        Loading doctors...
                    </div>
                ) : doctors.length > 0 ? (
                    doctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} />)
                ) : (
                    filters && Object.keys(filters).length > 0 ? (
                        <div style={{ width: '100%', textAlign: 'center', fontSize: '20px', color: '#004085' }}>
                            No doctors found.
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
};

export default DestinationPage;
