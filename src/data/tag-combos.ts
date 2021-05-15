import recruitment from "./recruitment.json";

[1, 4, 5].forEach((rarity) => {
  console.log(`${rarity}-star guaranteed combos:`);
  console.table(
    recruitment
      .filter((tagSet) => tagSet.guarantees.includes(rarity))
      .map((tagSet) => ({
        tags: tagSet.tags,
        operators: tagSet.operators.map((operator) => operator.name).join(", "),
      }))
  );
});
