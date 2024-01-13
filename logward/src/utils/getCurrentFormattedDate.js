export const formattedDate = () => {
  const timeStamp = new Date();
  const formattedDate = timeStamp
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, " ");

  return formattedDate;
};
