// encrypt.js
import crypto from 'crypto';

export default (text) => {
  const hash = crypto.createHmac('sha512', 'salt'); // 'salt' should match across your app
  hash.update(text);
  return hash.digest('hex');
};
