function validateCorrectUser(tokenId, databaseUserId) {
    if (tokenId === databaseUserId) {
      return true;
    }
    return false;
  }

module.exports = validateCorrectUser;