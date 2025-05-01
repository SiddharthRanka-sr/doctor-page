const Doctor = require('../model/doctor');

// Add a new doctor
exports.addDoctor = async (req, res) => {
    try {
        const { name, specialization, modeOfConsult, fees, experience } = req.body;

        const imagePath = req.file ? req.file.path : ''; // get image path from multer

        const newDoctor = new Doctor({
            name,
            specialization,
            modeOfConsult,
            fees,
            experience,
            image: imagePath // set image path
        });

        await newDoctor.save();
        res.status(200).json(newDoctor);
    } catch (error) {
        res.status(400).json({ message: "Server error", error: error.message });
    }
};

// Get doctors with filters and pagination
exports.getDoctors = async (req, res) => {
    try {
        const {
            specialization,
            modeOfConsult,
            minFees,
            maxFees,
            feeRange,
            experienceRange,
            page = 1,
            limit = 10,
            sortBy
        } = req.query;

        const query = {};
        
        // Specialization and Mode of Consult filters
        if (specialization) query.specialization = specialization;
        if (modeOfConsult) query.modeOfConsult = modeOfConsult;

        // Fees filter logic
        if (minFees && maxFees) {
            query.fees = { $gte: Number(minFees), $lte: Number(maxFees) };
        } else if (feeRange) {
            if (feeRange === '1500+') {
                // Special case for '1500+' range (greater than or equal to 1500)
                query.fees = { $gte: 1500 };
            } else {
                // Handling other ranges (e.g., '0-500', '500-1000')
                const [minFee, maxFee] = feeRange.split('-').map(Number);
                query.fees = { $gte: minFee, $lte: maxFee };
            }
        }

        // Experience filter logic
        if (experienceRange) {
            const [minExp, maxExp] = experienceRange.includes('+')
                ? [parseInt(experienceRange), 100]  // Special case for ranges like '16+ years'
                : experienceRange.split('-').map(Number);
            query.experience = { $gte: minExp, $lte: maxExp };
        }

        // Sorting logic
        let sort = {};
        if (sortBy === 'price-asc') {
            sort = { fees: 1 }; // Low to High
        } else if (sortBy === 'price-desc') {
            sort = { fees: -1 }; // High to Low
        } else if (sortBy === 'experience-asc') {
            sort = { experience: 1 }; // Low to High
        } else if (sortBy === 'experience-desc') {
            sort = { experience: -1 }; // High to Low
        } else {
            sort = { fees: 1 };  // Default sorting by name
        }

        // Fetch doctors
        const doctors = await Doctor.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Doctor.countDocuments(query);

        res.json({
            data: doctors,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getFilters = (req, res) => {
    try {
        // Fee Ranges from the model
        const feeRanges = Doctor.getFeeRanges();
        // Experience Ranges from the model
        const experienceRanges = Doctor.getExperienceRanges();

        // Possible specializations (hardcoded, you can modify this as per your requirement)
        const specializations = ['Cardiologist', 'Neurologist', 'Dentist', 'Dermatologist', 'Orthopedic', 'Pediatrician'];
        // Possible modes of consultation (hardcoded)
        const modeOfConsults = ['Online', 'Visit'];

        // Create the filter options
        const filterOptions = {
            specializations,
            modeOfConsults,
            feeRanges,
            experienceRanges
        };

        // Send the response with the filter options
        res.json(filterOptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};