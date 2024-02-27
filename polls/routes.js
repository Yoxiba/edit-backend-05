const express = require("express");
const router = express.Router();
const services = require("./services");
const { string } = require("joi");
const { createPollSchema, voteSchema } = require("./schemas");

router.get("/", async (req, res) => {
  const polls = await services.getAllPolls();
  res.status(200).json(polls);
});

router.get("/:id", async (req, res) => {
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);

  if (poll) {
    return res.status(200).json(poll);
  }
  return res.status(404).json({ error: "poll not found" });
});

router.delete("/:id", async (req, res) => {
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }

  const deleted = await services.deletePollById(pollId);
  if (!deleted) {
    return res.status(500).json({ error: "failed to delete poll" });
  }

  res.status(200).json({ message: "poll deleted successfully" });
});

router.post("/", async (req, res) => {
  const { error, value } = createPollSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  const created = await services.createPoll(value);

  res.status(201).json(created);
});

router.post("/:id/vote", async (req, res) => {
  const pollId = req.params.id;

  const { error, value } = voteSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }
  const poll = await services.createVote(value, pollId);
  res.status(201).json(poll);
});

module.exports = router;
