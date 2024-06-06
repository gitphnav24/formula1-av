export function getFlagCode(flags, value) {

    const flag = flags.filter(item => ((item.nationality === value) || (item.en_short_name === value)));
    if (flag.length) {
        return flag[0].alpha_2_code;
    } else {
        if ((value === "British") || (value === "UK")) {
            return "GB";
        } else if (value === "Korea") {
            return "KR";
        } else if (value === "UAE") {
            return "AE";
        } else if (value === "Dutch") {
            return "NL";
        } else if (value === "Russia") {
            return "RU";
        } else if (value === "New Zealander") {
            return "NZ";
        } else if (value === "Monegasque") {
            return "MC";
        } else if ((value === "American") || (value === "USA") || (value === "United States")) {
            return "US";
        } else return "RS";
    };
}

export function getAllYears() {
    let yearsList = [];
    for (let i = 2000; i < 2024; i++) {
        yearsList.push(i);
    };
    return yearsList;
};

export function getCellColorCoded(value) {
    const colorCodes = ['white', 'linear-gradient(to right, #fffdb8, #fffed6)',
        'linear-gradient(to right, rgba(231, 234, 237, .3), #eef2f6)',
        'linear-gradient(to right, #ffe7cf, #feebd8)',
        'linear-gradient(to right, #d2fcd3, #e9faea)',
        'linear-gradient(to right, #e9f8fa, #f3fcfe)',
        'linear-gradient(to right, #fee9e9, #fcefef)',
        'linear-gradient(to right, #dcfcce, #e4f7db)',
        'linear-gradient(to right, #ffebfb, #fef1fb)',
        'linear-gradient(to right, #f1f1fe, #f6f6fc)',
        'linear-gradient(to right, #e6f7ed, #e6f7ed)',
        'linear-gradient(to bottom right, #fcfce9 0%, #ffffff 100%)'];
    if (value < 11) {
        return colorCodes[value];
    } else {
        return ('linear-gradient(to right,  #A6A5A5, #cfcfcf)');
    }
};

export function getThreeCellColorCoded(rank, points) {
    if (rank == 1) return ('linear-gradient(to right, #fffdb8, #fffed6)')
    else if (rank == 2) return ('linear-gradient(to right, rgba(231, 234, 237, .3), #eef2f6)')
    else if (rank == 3) return ('linear-gradient(to right, #ffe7cf, #feebd8)')
    else if (points > 0) return ('linear-gradient(to right, #d2fcd3, #e9faea)')
    else if (points == 0) return ('linear-gradient(to right, #e9f8fa, #f3fcfe)');
};



