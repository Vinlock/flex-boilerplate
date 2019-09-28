import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

class UserClass extends Model {
  static async _generateDiscriminator (username) {
    let good = false;

    let discriminator = Math.floor(1000 + Math.random() * 9000);
    do {
      const numFound = await this.countDocuments({
        username,
        discriminator,
      });
      if (numFound === 0) {
        good = true;
      } else {
        discriminator = Math.floor(1000 + Math.random() * 9000);
      }
    } while (!good);

    return discriminator;
  }

  static async createAccount (username, password, email) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return this.create({
      password: hash,
      username,
      email,
      discriminator: await this._generateDiscriminator(),
    });
  }
}

export default UserClass;
