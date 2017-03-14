/**
 * Creates a Queue implementation using array properties.
 * @param  {Array}  queue - starting queue
 * @constructs Queue
 */
export function createQueue(queue = []) {
  return {
    forEach: queue.forEach,
    
    /**
     * Adds a list of items to to the queue
     * @example
     *  [4, 3, 2] to [3, 2]
     */
    add(...args) {
      for (let i in args) {
        queue.push(args[i]) // add to the end
      }
      return this
    },

    /**
     * Removes X number items from the queue
     * @param {Number} num - number of items to remove; defaults to 1 item
     * @returns {Array} of items in the order that they were removed
     * @example
     *  [4, 3, 2, 1] to [2, 1] returns [4, 3]
     */
    remove(num = 1) {
      let removed = [],
          amount = num <= this.size ? num : this.size

      while (amount > 0) {
        let item = queue.shift() // remove from beginning
        removed.push(item)
        amount--
      }
      return removed
    },

    /**
     * Extracts items from array based on predicate.
     * @param {Function} pred - predicate function that determines extracted items
     * @returns {Array} of removed items
     * @example
     *  [1, 'string'].extract((item) => typeof item == 'number') -> ['string']
     */
    extract(pred) {
      let extracted = []
      for (let i = queue.length - 1; i >= 0; i--) {
        if (pred(this.peek(i))) {
          let removed = queue.splice(i, 1)
          extracted.unshift(...removed)
        }
      }
      return extracted
    },

    /**
     * Empties out entire array.
     * @param {Boolean} Keep - whether to keep reference to original array
     */
    clear(keep = false) {
      keep ? queue = [] : queue.length = 0
    },

    /**
     * Returns a shallow copy of value inside array.
     * @param {Number} index - location of value inside array
     */
    peek(index = 0) {
      return queue.slice(index, index + 1).pop()
    },

    /**
     * Return a shallow copy of entire array.
     */
    peekAll() {
      return queue.slice()
    },

    get alias() {
      return queue
    },

    get size() {
      return queue.length
    },

    get isActive() {
      return this.size > 0
    }
  }
}

export default createQueue
