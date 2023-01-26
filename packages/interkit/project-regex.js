
/* Should we run into incompatible browsers, the Unicode property escapes
 * can be expanded. See https://stackoverflow.com/a/37668315/629238
 * Affected: interkit admin on Safari <11.1, Chrome <64, FF <78
 * See https://caniuse.com/mdn-javascript_builtins_regexp_property_escapes
 */
const idRE = '[\\p{L}\\p{Nd} -]+'
// for slugification
const negIdRE = '[^\\p{L}\\p{Nd} -]'

export {
  idRE,
  negIdRE
}