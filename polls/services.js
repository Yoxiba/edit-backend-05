const { ObjectId } = require("mongodb");
const db = require("../db/mongodb");

async function getPollById(pollId) {
  try {
    return await db
      .getDB()
      .collection(db.pollsCollection)
      .findOne({ _id: db.toMongoID(pollId) });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAllPolls() {
  try {
    return await db.getDB().collection(db.pollsCollection).find({}).toArray();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function deletePollById(pollId) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .deleteOne({ _id: db.toMongoID(pollId) });

    return result.deletedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function createPoll(value) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .insertOne({
        ...value,
        createdAt: new Date().getTime(),
      });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function createVote(vote, pollId) {
  try {
    const poll = await db
      .getDB()
      .collection(db.pollsCollection)
      .findOne({ _id: db.toMongoID(pollId) });

    if (!poll) {
      return false;
    }

    const currentTime = new Date();
    console.log(poll.dateLimit);
    if (currentTime > poll.dateLimit) {
      return false;
    }

    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .findOneAndUpdate(
        { _id: db.toMongoID(pollId) },
        { $set: { vote: vote.option } }, //returnDocument: "after" é para retornar o valor inserido.
        { upsert: true, returnDocument: "after" }
      );
    console.log(vote, pollId);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getPollById,
  getAllPolls,
  deletePollById,
  createPoll,
  createVote,
};
