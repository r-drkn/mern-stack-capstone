const sample = (array) => {
  const length = array.length;
  random = Math.floor(Math.random() * length);
  return array[random];
};

module.exports = { sample };
