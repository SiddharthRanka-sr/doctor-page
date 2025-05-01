import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Filters.css';

const FilterPanel = ({ onFilterChange }) => {
    const [filters, setFilters] = useState(null);
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);
    const [selectedModeOfConsults, setSelectedModeOfConsults] = useState([]);
    const [selectedFeeRanges, setSelectedFeeRanges] = useState([]);
    const [selectedExperienceRanges, setSelectedExperienceRanges] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCount, setShowCount] = useState({
        specializations: 100,
        modeOfConsults: 100,
        feeRanges: 100,
        experienceRanges: 100,
    });

    const [expandedSections, setExpandedSections] = useState({
        specializations: false,
        modeOfConsults: false,
        feeRanges: false,
        experienceRanges: false,
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/filters')
            .then(response => {
                setFilters(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching filters:', err);
                setLoading(false);
            });
    }, []);

    const handleCheckboxChange = (value, selectedArray, setSelectedArray) => {
        if (selectedArray.includes(value)) {
            setSelectedArray(selectedArray.filter(item => item !== value));
        } else {
            setSelectedArray([...selectedArray, value]);
        }
    };

    useEffect(() => {
        onFilterChange({
            specializations: selectedSpecializations,
            modeOfConsults: selectedModeOfConsults,
            feeRanges: selectedFeeRanges,
            experienceRanges: selectedExperienceRanges
        });
    }, [
        selectedSpecializations,
        selectedModeOfConsults,
        selectedFeeRanges,
        selectedExperienceRanges,
        onFilterChange
    ]);

    const handleSeeMore = (section) => {
        setShowCount(prev => ({
            ...prev,
            [section]: prev[section] + 2
        }));
        setExpandedSections(prev => ({
            ...prev,
            [section]: true
        }));
    };

    const handleSeeLess = (section) => {
        setShowCount(prev => ({
            ...prev,
            [section]: 3
        }));
        setExpandedSections(prev => ({
            ...prev,
            [section]: false
        }));
    };

    if (loading) return <div>Loading...</div>;

    const renderFilterItems = (items, selectedArray, setSelectedArray, sectionKey) => {
        const count = showCount[sectionKey] || 3;
        const visibleItems = items.slice(0, count);
        const hasMore = items.length > 3;

        return (
            <>
                {visibleItems.map((item, index) => {
                    const value = typeof item === 'string' ? item : item.range;
                    return (
                        <li key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={value}
                                    checked={selectedArray.includes(value)}
                                    onChange={() => handleCheckboxChange(value, selectedArray, setSelectedArray)}
                                />
                                {value}
                            </label>
                        </li>
                    );
                })}
                {hasMore && (
                    <li>
                        {expandedSections[sectionKey] ? (
                            <button className="see-more-btn" onClick={() => handleSeeLess(sectionKey)}>
                                See Less
                            </button>
                        ) : (
                            <button className="see-more-btn" onClick={() => handleSeeMore(sectionKey)}>
                                See More
                            </button>
                        )}
                    </li>
                )}
            </>
        );
    };

    return (
        <div className="filter-panel">
            <h3>Filters</h3>

            {/* Specializations */}
            <div className="filter-section">
                <h4>Specializations</h4>
                <ul className="filter-options">
                    {renderFilterItems(filters?.specializations || [], selectedSpecializations, setSelectedSpecializations, 'specializations')}
                </ul>
            </div>

            {/* Mode of Consultation */}
            <div className="filter-section">
                <h4>Mode of Consultation</h4>
                <ul className="filter-options">
                    {renderFilterItems(filters?.modeOfConsults || [], selectedModeOfConsults, setSelectedModeOfConsults, 'modeOfConsults')}
                </ul>
            </div>

            {/* Experience */}
            <div className="filter-section">
                <h4>Experience</h4>
                <ul className="filter-options">
                    {renderFilterItems(filters?.experienceRanges || [], selectedExperienceRanges, setSelectedExperienceRanges, 'experienceRanges')}
                </ul>
            </div>

            {/* Fees */}
            <div className="filter-section">
                <h4>Fees</h4>
                <ul className="filter-options">
                    {renderFilterItems(filters?.feeRanges || [], selectedFeeRanges, setSelectedFeeRanges, 'feeRanges')}
                </ul>
            </div>

            {/* Clear All */}
            <div className="filter-actions">
                <button className="clear-all-btn" onClick={() => {
                    setSelectedSpecializations([]);
                    setSelectedModeOfConsults([]);
                    setSelectedFeeRanges([]);
                    setSelectedExperienceRanges([]);
                }}>
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default FilterPanel;
