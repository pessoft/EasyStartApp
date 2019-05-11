function generateUniqId() {
    return '_' + Math.random().toString(36).substr(2, 9);
};

function num2str(n, text_forms) {
    n = Math.abs(n) % 100; var n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}

function isInteger(num) {
    return (num ^ 0) === num;
}

function getPriceValid(num) {
    if (!isInteger(num)) {
        num = num.toFixed(2);
    }

    return num;
}

function getDateFormatted(date) {
    var date = new Date(date);
    return (date.getMonth() + 1) + '.' + date.getDate() + '.' + date.getFullYear();
}