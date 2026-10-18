let counter = 0;

/**
 * Dependency-free unique id generator that works in Hermes and Node.
 * Not cryptographic; used for demo-domain records only.
 */
export function createId(prefix = 'id'): string {
  counter += 1;
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${time}${counter.toString(36)}${rand}`;
}
