const db = require('../data/database');
const bcrypt = require('bcryptjs');
class User {
  constructor(email, confirmemail, password, name, street, postalcode, city) {
    this.email = email;
    this.confirmemail = confirmemail;
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
}
module.exports = User;