export function getRatingColor(percentage) {
  if (percentage > 70) return "#63ad6c";
  if (percentage > 50) return "#bdb564";
  return "#e04146";
}

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatReleaseDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`;
}
