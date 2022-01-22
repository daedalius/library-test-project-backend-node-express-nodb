export function includesSomeOf(arr1: any[], arr2: any[]) {
  let isIncludes = false
  arr1.forEach((a1) => {
    if (arr2.includes(a1)) isIncludes = true
  })

  return isIncludes
}
