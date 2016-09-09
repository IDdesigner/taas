module.exports = function toSplit(text) {
    var origText = text;
    var textNoSpaces = origText.replace(/ /g, ' ');
    var ingredients = textNoSpaces.split(",");
    return ingredients;
};