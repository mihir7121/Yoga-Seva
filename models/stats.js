var mongoose = require("mongoose");
var statsSchema = new mongoose.Schema({
    username: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    date: {
        type: Date, 
        default: Date.now()
    },
    accuracy_mountain: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    accuracy_tree: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    accuracy_goddess: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    accuracy_warrior_2: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    accuracy: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    description: String 
});

module.exports = mongoose.model("Stats", statsSchema);

