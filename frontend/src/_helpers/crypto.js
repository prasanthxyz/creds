import CryptoJS from "crypto-js";
import { _dataValidator } from ".";

export const _crypto = {
  decryptDataToSectionsList,
  encryptSectionInfoToContent,
};

/**
 * Decrypts data and returns a list of valid sections from it.
 * Each section will have 'id', 'name' and 'creds'.
 * 'id' is the section ID in DB.
 * 'name' will be an encrypted string.
 * 'creds' will be a list of lists, each list has two encrypted string each.
 * @param {Object} data: JSON object from backend; list of sections with id and encrypted content
 * @returns {Array} array of sectionInfo objects
 */
function decryptDataToSectionsList(data) {
  const sections = [];
  data.forEach((sectionData) => {
    try {
      // Decrypt sectionData.content and parse it into sectionInfo object
      const sectionInfo = JSON.parse(
        decrypt(
          sectionData["content"],
          document.getElementById("secretKey").value
        )
      );
      if (_dataValidator.isValidSection(sectionInfo)) {
        sectionInfo["id"] = sectionData["id"];
        sections.push(sectionInfo);
      }
    } catch (_error) {
      // ignore decryption errors.
    }
  });
  return sections;
}

/**
 * Encrypts a sectionInfo object and returns the backend-compatible content string.
 * Should contain 'name': Section name as a string.
 * Should contain 'creds': a list of lists, each list containing two strings [key, value].
 * @param {Object} sectionInfo: JSON object from backend with 'name' and key-value pairs in 'creds'
 * @returns {String} encrypted json string
 */
function encryptSectionInfoToContent(sectionInfo) {
  if (!_dataValidator.isValidSection(sectionInfo, true)) {
    throw new Error(
      "Encryption error: invalid section. Please validate all fields."
    );
  }

  sectionInfo = _dataValidator.removeInvalidEntries(sectionInfo);
  return encrypt(
    JSON.stringify(sectionInfo),
    document.getElementById("secretKey").value
  );
}

/**
 * Encrypts given plainText with the given secretKey and returns the cipherText.
 * @param {String} plainText: plain text
 * @param {String} secretKey: secret key
 * @returns {String} cipher text
 */
function encrypt(plainText, secretKey) {
  if (!secretKey) {
    throw new Error("Invalid Secret Key.");
  }
  return CryptoJS.AES.encrypt(plainText, secretKey).toString();
}

/**
 * Decrypts given cipherText with the given secretKey and returns the plainText.
 * @param {String} cipherText: cipher text
 * @param {String} secretKey: secret key
 * @returns {String} plain text
 */
function decrypt(cipherText, secretKey) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
