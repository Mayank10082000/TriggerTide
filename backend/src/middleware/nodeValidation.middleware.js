// This middleware validates Flow nodes based on their types
export const validateFlowNodes = function (next) {
  // Validate each node based on its type
  if (this.nodes) {
    for (const node of this.nodes) {
      if (node.type === "coldEmail") {
        // Validate cold email nodes
        if (!node.data || !node.data.subject || !node.data.body) {
          return next(
            new Error(`Cold email node requires subject and body: ${node.id}`)
          );
        }
      } else if (node.type === "waitDelay") {
        // Validate wait/delay nodes
        if (!node.data || typeof node.data.delayTime !== "number") {
          return next(
            new Error(
              `Wait/delay node requires a numeric delayTime: ${node.id}`
            )
          );
        }
        // Validate delayUnit if provided
        if (
          node.data.delayUnit &&
          !["minutes", "hours", "days"].includes(node.data.delayUnit)
        ) {
          return next(new Error(`Invalid delay unit in node: ${node.id}`));
        }
      } else if (node.type === "leadSource") {
        // Validate lead source nodes
        if (!node.data || !node.data.sourceName) {
          return next(
            new Error(`Lead source node requires a sourceName: ${node.id}`)
          );
        }
      }
    }
  }
  next();
};
