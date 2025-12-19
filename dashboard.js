
const express = require("express");
const fs = require('fs-extra');
const authenticateToken = require("./middleware/auth");
const { errorMonitor } = require("events");

const router = express.Router();
const CARDS_FILE = "./data/cards.json";

async function readCards() {
    return await fs.readJson(CARDS_FILE);
}

 async function writeCards(cards) {
    await fs.writeJson(CARDS_FILE, cards, { spaces: 2 });
}

/* GET /cards (with filtering) */
router.get("/cards", async (req, res, next) => {
  try {
    let cards = await readCards();

    for (let key in req.query) {
      cards = cards.filter(card => card[key] == req.query[key]);
    }

    res.json({
        successMessage: "Cards retrieved successfully",
        cards
      });
    } catch (err) {
      next(err);
    }
  });


/* Get /sets - retrieve all unique  card set */
router.get("/sets", async (req, res, next) => {
    try {
      const cards = await readCards();
  
      // extract unique sets
      const sets = [...new Set(
        cards
          .map(card => card.set)
          .filter(set => set && set.trim() !== "")
      )];
  
      res.json({
        successMessage: "Sets retrieved successfully",
        sets
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/types", async (req, res, next) => {
    try {
      const cards = await readCards();
  
      const types = [...new Set(
        cards
          .map(card => card.type)
          .filter(type => type && type.trim() !== "")
      )];
  
      res.json({
        successMessage: "Types retrieved successfully",
        types
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/rarities", async (req, res, next) => {
    try {
        const cards = await readCards();

        const rarities = [...new Set(
            cards
            .map(card => card.rarity)
            .filter(rarity => rarity && rarity.trim() !== "")
        )];

        res.json({
            successMessage: "Rarities retrived successfully",
            rarities
        });
    } catch (err) {
        next(err);
    }
  });


  router.get("/cards/count", async (req, res, next) => {
    try {
        const cards = await readCards();

        res.json({
            successMessage: "Card count retrieved successfully",
            count: cards.length
        });
    } catch (err) {
        next(err);
    }
  });


  router.get("/cards/random", async (req, res, next) => {
    try {
        const cards = await readCards();

        if (!cards.length) {
            return res.status(404).json({
                errorMessage: "No cards available"
            });
        }

        const randomIndex = Math.floor(Math.random() * cards.length);
        const randomCard = cards[randomIndex];

        res.json({
            successMessage: "Random card retrived successfully",
            card: randomCard
        });
    } catch (err) {
        next(err);
    }
  });


/*   create card (protected) */
router.post("/cards/create", authenticateToken, async (req, res, next) => {
    try {
      const cards = await readCards();
      const newCard = req.body;
  
      if (!newCard.cardId) {
        return res.status(400).json({
          errorMessage: "cardId is required"
        });
      }
  
      if (cards.some(c => c.cardId === newCard.cardId)) {
        return res.status(400).json({
          errorMessage: "cardId must be unique"
        });
      }
  
      cards.push(newCard);
      await writeCards(cards);
  
      res.json({
        successMessage: "Card created successfully",
        card: newCard
      });
    } catch (err) {
      next(err);
    }
  });



/* update card  (protected) */
router.put("/cards/:id", authenticateToken, async (req, res, next) => {
  try {
    const cards = await readCards();
    const cardIndex = cards.findIndex(c => c.cardId === req.params.id);

    if (cardIndex === -1) {
        return res.status(404).json({
            errorMessage: "Card not found"
        });
    }

    if (
        req.body.cardId &&
      req.body.cardId !== req.params.id &&
      cards.some(c => c.cardId === req.body.cardId)
    ) {
      return res.status(400).json({
        errorMessage: "cardId must be unique"
      });
    }

    cards[cardIndex] = { ...cards[cardIndex], ...req.body };
    await writeCards(cards);

    res.json({
      successMessage: "Card updated successfully",
      card: cards[cardIndex]
    });
  } catch (err) {
    next(err);
  }
});

/* delete card (protected) */
router.delete("/cards/:id", authenticateToken, async (req, res, next) => {
    try {
      const cards = await readCards();
      const cardIndex = cards.findIndex(c => c.cardId === req.params.id);
  
      if (cardIndex === -1) {
        return res.status(404).json({
          errorMessage: "Card not found"
        });
      }
  
      const deletedCard = cards.splice(cardIndex, 1)[0];
      await writeCards(cards);
  
      res.json({
        successMessage: "Card deleted successfully",
        card: deletedCard
      });
    } catch (err) {
      next(err);
    }
  });
  
  module.exports = router;