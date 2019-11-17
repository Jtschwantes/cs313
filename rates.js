const conversions = {
    ls: {
        name: "Letters (Stamped)",
        1: 0.55, 2: 0.70, 3: 0.85, 3.5: 1.00
    },
    lm: {
        name: "Letters (Metered)",
        1: 0.50, 2: 0.65, 3: 0.80, 3.5: 0.95
    },
    le: {
        name: "Large Envelopes (Flats)",
        1: 1.00, 2: 1.15, 3: 1.30, 4: 1.45,
        5: 1.60, 6: 1.75, 7: 1.90, 8: 2.05,
        9: 2.20, 10: 2.35, 11: 2.50, 12: 2.65,
        13: 2.80
    },
    fc: {
        name: "First-Class Package Service--Retail",
        1: 3.70, 2: 3.70, 3: 3.70, 4: 3.70,
        5: 4.53, 6: 4.53, 7: 4.53, 8: 4.53,
        9: 5.35, 10: 5.35, 11: 5.35, 12: 5.35,
        13: 5.93
    }
};

module.exports = conversions;