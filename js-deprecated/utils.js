const concat4bits = (A, B) => {
    if (A < 0 || A > 0b1111 || B < 0 || B > 0b1111) {
        throw new Error('Os valores devem ser de 4 bits (0 a 15): A: ' + A + " B: " + B);
    }
    return (A << 4) | B;
}

module.exports = concat4bits;