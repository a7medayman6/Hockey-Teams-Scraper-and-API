const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        year: { type: String },
        wins: { type: String },
        losses: { type: String },
        win_percentage: { type: String },
        goals_for: { type: String },
        goals_against: { type: String },
        diff: { type: String },
    },
    { 
        timestamps: true,
        collation:  {
                        locale: 'en_US',
                        caseLevel: true,
                        strength: 2
                    }
    },
        
)

const COLLECTION_NAME = process.env.COLLECTION_NAME || 'teams'; 

const Topic = mongoose.model('teams', teamsSchema);


module.exports = Topic;