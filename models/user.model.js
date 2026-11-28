const db = require('../data/database');
const bcrypt = require('bcryptjs');
class User {
  constructor(email, password, name, street, postalcode, city) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.address = {
      street: street,
      postalcode: postalcode,
      city: city,
    };
    this.id = null;
  }

  async signup() {
    const userData = {
      email: this.email,
      confirmemail: this.confirmemail,
      password: await bcrypt.hash(this.password, 12),
      name: this.name,
      address: this.address,
    };
    await db.getDb().collection("users").insertOne(userData);
  }
  async getUserWithSameEmail() {
    return await db.getDb().collection("users").findOne({ email: this.email });
  }
  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }
  async hasMatchingPassword(hashedpassword) {
    return await bcrypt.compare(this.password, hashedpassword);
  }
}
module.exports = User;