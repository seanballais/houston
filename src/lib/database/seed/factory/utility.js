/**
 * lib/database/seed/factory/utility.js
 * Some useful functions for fake data.
 * @flow
 */

/**
 * Returns a random number with given length
 *
 * @param {Number} len - Length of the number
 * @return {Number}
 */
export function randomNumber (len: number = 12) {
  if (len === 0) {
    return 0
  }

  let output = ''

  for (let i = 0; i < len; i++) {
    output += Math.floor(Math.random() * 11)
  }

  return Number(output)
}

/**
 * Returns a random semver string
 *
 * @return {String}
 */
export function randomSemver () {
  return `${randomNumber(1)}.${randomNumber(1)}.${randomNumber(2)}`
}

/**
 * Exports a random string
 *
 * @param {Number} len - Length of the string
 * @return {String}
 */
export function randomString (len: number = 12) {
  if (len === 0) {
    return ''
  }

  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let output = ''

  for (let i = 0; i < len; i++) {
    output += chars[Math.floor(Math.random() * chars.length)]
  }

  return output
}

/**
 * Returns a random hash of numbers and characters
 *
 * @param {Number} len - Length of the hash
 * @return {String}
 */
export function randomHash (len: number = 32) {
  if (len === 0) {
    return ''
  }

  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let output = ''

  for (let i = 0; i < len; i++) {
    output += chars[Math.floor(Math.random() * chars.length)]
  }

  return output
}

/**
 * Picks a random choice from an array
 *
 * @param {Array} arr - An array of choices to pick
 * @return {Mixed}
 */
export function randomChoice (arr: any[] = []) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Returns a random boolean value
 *
 * @return {Boolean}
 */
export function randomBoolean () {
  return (Math.random() * 2 > 1)
}

/**
 * Returns a random length array of choices
 *
 * @param {Number} min - Min length of array
 * @param {Number} max - Max length of array
 * @param {Function} fn - Generator function for array values
 * @return {Array}
 */
export function randomArray (min: number = 0, max: number = 3, fn: Function = randomBoolean) {
  const output = []

  const len = Math.floor(Math.random() * (max - min)) + min

  for (let i = 0; i < len; i++) {
    output.push(fn())
  }

  return output
}
