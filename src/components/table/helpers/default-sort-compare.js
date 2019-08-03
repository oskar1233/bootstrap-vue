import get from '../../../utils/get'
import { isDate, isFunction, isNumber, isUndefinedOrNull } from '../../../utils/inspect'
import stringifyObjectValues from './stringify-object-values'

// Default sort compare routine
//
// TODO: Add option to sort by multiple columns (tri-state per column,
//       plus order of columns in sort)  where sortBy could be an array
//       of objects `[ {key: 'foo', sortDir: 'asc'}, {key:'bar', sortDir: 'desc'} ...]`
//       or an array of arrays `[ ['foo','asc'], ['bar','desc'] ]`
//       Multisort will most likely be handled in mixin-sort.js by
//       calling this method for each sortBy
const defaultSortCompare = (a, b, sortBy, formatter, localeOpts, locale, nullLast) => {
  let aa = get(a, sortBy, '')
  let bb = get(b, sortBy, '')
  if (isFunction(formatter)) {
    aa = formatter(aa, sortBy, a)
    bb = formatter(bb, sortBy, b)
  }
  // Special handling when null/undefined sorted last
  if (nullLast && (isUndefinedOrNull(aa) || isUndefinedOrNull(bb))) {
    return isUndefinedOrNull(aa) ? 1 : -1
  }
  aa = isUndefinedOrNull(aa) ? '' : aa
  bb = isUndefinedOrNull(bb) ? '' : bb
  if ((isDate(aa) && isDate(bb)) || (isNumber(aa) && isNumber(bb))) {
    // Special case for comparing dates and numbers
    // Internally dates are compared via their epoch number values
    return aa < bb ? -1 : aa > bb ? 1 : 0
  } else {
    // Do localized string comparison
    return stringifyObjectValues(aa).localeCompare(stringifyObjectValues(bb), locale, localeOpts)
  }
}

export default defaultSortCompare
