/* function  which covert number to string */
const converToString = value => {
  if (typeof value == 'number') {
    return String(value);
  } else {
    return value;
  }
};

export default converToString;
