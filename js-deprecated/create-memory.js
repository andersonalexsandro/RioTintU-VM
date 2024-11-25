const createMemory = sizeInBytes => {
    const ab = new ArrayBuffer(sizeInBytes);
    const dv = new DataView(ab);
    return dv;
};

const createMemoryAbDv = sizeInBytes => {
    const ab = new ArrayBuffer(sizeInBytes);
    const dv = new DataView(ab);
    return [ab, dv];
}

module.exports = {
    createMemory,
    createMemoryAbDv
};