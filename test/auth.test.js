require('dotenv').config();
const mongoose = require('mongoose');
const assert = require('assert');

const User = require('./../models/user');

describe('Auth tests', () => {
  before(() => {
    mongoose
      .connect(process.env.TESTDB_URI)
      .then(() => {
        console.log('Database connected');
      })
      .catch((error) => console.error(error));
      });

  after(async () => {
    try {
      await mongoose.connection.close()
    } catch (err) {
      console.log(err);
    }
  });
  
  beforeEach(async () => {
    await User.deleteMany();
    const user = new User({
      email: 'test@test.com',
      password: 'password'
    });
    await user.save();
  });

  describe('User', () => {
    describe('Register', () => {
      it('should create a new user', () => {
        return User.findOne({ email: 'test@test.com' })
          .then((user) => {
            assert(user);
          });
      });
    });
  });
});