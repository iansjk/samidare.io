import baseSlugify from "slugify";

function slugify(toSlug: string): string {
  return baseSlugify(toSlug, { lower: true, replacement: "-", remove: /-/g });
}
export default slugify;

export const getOperatorImagePath = (
  name: string,
  eliteLevel?: number
): string => {
  let filename = `${slugify(name)}.png`;
  if (name === "Amiya" && eliteLevel === 1) {
    filename = `${slugify(`${name} elite 1`)}.png`;
  }
  if (eliteLevel === 2) {
    filename = `${slugify(`${name} elite 2`)}.png`;
  }
  return `/arknights/images/operators/${filename}`;
};
