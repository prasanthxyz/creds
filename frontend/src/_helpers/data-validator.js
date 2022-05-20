export const _dataValidator = {
  isValidSection,
  removeInvalidEntries,
};

/**
 * Checks if a sectionInfo is valid
 * Should contain 'name': Section name as a string
 * Should contain 'creds': a list of lists, each list containing two non-empty strings [key, value]
 * Checking the validity of creds' contents is optional, controlled by dontCheckCreds param
 * @param {Object} sectionInfo: object to validate
 * @param {Boolean} dontCheckCreds: whether to check creds or not
 * @returns {Boolean} whether the sectionInfo is valid or not
 */
function isValidSection(sectionInfo, dontCheckCreds = false) {
  if (!sectionInfo["name"]) {
    console.log("name issue", sectionInfo);
    return false;
  }

  if (
    Object.prototype.toString.call(sectionInfo["creds"]) !== "[object Array]"
  ) {
    console.log("creds issue");
    return false;
  }

  if (dontCheckCreds) {
    return true;
  }

  for (const cred of sectionInfo["creds"]) {
    if (!isValidEntry(cred)) {
      console.log("entry issue", cred);
      return false;
    }
  }

  return true;
}

/**
 * Removes invalid creds from the given sectionInfo
 * Assumes the sectionInfo is valid other than creds' contents
 * @param {Object} sectionInfo: object to remove invalid creds from
 * @returns {Object} sectionInfo with only valid creds
 */
function removeInvalidEntries(sectionInfo) {
  return {
    name: sectionInfo["name"],
    creds: sectionInfo["creds"].filter((entry) => isValidEntry(entry)),
  };
}

/**
 * Checks if a cred entry is valid
 * Should be a list
 * Should contain exactly two non-empty strings
 * @param {Array} entryData: cred entry to validate
 * @returns {Boolean} whether the entryData is valid or not
 */
function isValidEntry(entryData) {
  if (Object.prototype.toString.call(entryData) !== "[object Array]") {
    return false;
  }
  if (!entryData || entryData.length != 2) {
    return false;
  }
  if (!entryData[0] || !entryData[1]) {
    return false;
  }

  return true;
}
