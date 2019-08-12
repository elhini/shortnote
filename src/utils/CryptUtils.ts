import * as bcrypt from 'bcrypt';

export default class CryptUtils {
  static cryptPassword(password: string, callback: (err: Error, hash?: string) => void) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) 
        return callback(err);
      bcrypt.hash(password, salt, (err, hash) => {
        return callback(err, hash);
      });
    });
  }

  static comparePassword(plainPass: string, hashword: string, callback: (err: Error, isPasswordMatch: boolean) => void) {
    bcrypt.compare(plainPass, hashword, (err, isPasswordMatch) => {   
      return callback(err, isPasswordMatch);
    });
  }
}