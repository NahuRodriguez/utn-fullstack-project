const generarId = (array) => {
    if (array.length === 0) return 1;
    return array[array.length - 1].id + 1;
};

module.exports = generarId;