function generateRandomNumbers(length) {
  const charset = "0123456789";
  let number = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    number += charset[randomIndex];
  }

  return number;
}

module.exports = generateRandomNumbers;
