"use strict";

const {
  db,
  models: { User, Message, Contact },
} = require("../server/db");

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  // Creating Users
  const users = await Promise.all([
    User.create({
      username: "ethan",
      password: "123",
      phoneNumber: 987654321,
      contacts: [123456789],
    }),
    User.create({
      username: "helen",
      password: "123",
      phoneNumber: 123456789,
      contacts: [987654321],
    }),
  ]);

  // Creating Messages
  const messages = await Promise.all([
    Message.create({
      sender: 987654321,
      receiver: 123456789,
      content: "hi",
    }),
    Message.create({
      sender: 123456789,
      receiver: 987654321,
      content: "hi",
    }),
  ]);

  // Creating Contacts
  const contacts = await Promise.all([
    Contact.create({
      contactHolder: 987654321,
      contactName: "helen",
      phoneNumber: 123456789,
    }),
    Contact.create({
      contactHolder: 123456789,
      contactName: "ethan",
      phoneNumber: 987654321,
    }),
  ]);

  const ethan = users[0];
  const helen = users[1];
  const message1 = messages[0];
  const message2 = messages[1];
  await helen.addMessage(message1);
  await ethan.addMessage(message1);
  await helen.addMessage(message2);
  await ethan.addMessage(message2);
  const ethanContactList = contacts[0];
  const helenContactList = contacts[1];
  await ethan.addContact(ethanContactList);
  await helen.addContact(helenContactList);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
  return {
    users: {
      ethan: users[0],
      helen: users[1],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
