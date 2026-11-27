const db = require('../data/database');
const bcrypt = require('bcryptjs');
class User {
    constructor(email,password,name,street,postalcode,city){
        this.email=email;
        this.password=password;
        this.name=name;
        this.address= {
            street:street,
            postalcode:postalcode,
            city:city
        };
        this.id=null;

    }
    async signup(){

        const userData =
        {
            email:this.email,
            password:await bcrypt.hash(this.password, 12),
            name:this.fullname,
            address:this.address,

        }
        await db.getDb().collection('users').insertOne(userData)

    }

}
module.exports={User};