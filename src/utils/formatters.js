// Format date for Thai display
export const formatDate = (date) => {
  // Format as dd/mm/yyyy (Buddhist era)
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear() + 543; // Convert to Buddhist era

  return `${day}/${month}/${year}`;
};

// Format time for Thai display
export const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} น.`;
};
