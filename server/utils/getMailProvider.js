function getMailProvider(email) {
  const domain = email.split("@")[1];
  if (domain) {
    return domain.split(".")[0];
  }
  return null;
}

module.exports = getMailProvider;