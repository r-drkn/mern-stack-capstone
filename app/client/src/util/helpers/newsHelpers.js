export const getDate = (date) => {
  if (date) {
    const formattedDate = date.slice(0, 10).split("-").reverse().join("-");
    return formattedDate;
  } else {
    return null;
  }
};
