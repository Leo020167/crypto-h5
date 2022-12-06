export function format(msgs) {
  const results = {};
  for (const [id, msg] of Object.entries(msgs)) {
    results[id] = {
      context: msg.description,
      string: msg.defaultMessage,
    };
  }
  return results;
}
