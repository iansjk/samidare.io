import baseSlugify from "slugify";

function slugify(toSlug: string): string {
  return baseSlugify(toSlug, { lower: true, replacement: "-", remove: /-/g });
}
export default slugify;

export const getOperatorImagePublicId = (
  name: string,
  eliteLevel?: number
): string => {
  let slug = `${slugify(name)}`;
  if (name === "Amiya" && eliteLevel === 1) {
    slug = `${slugify(`${name} elite 1`)}`;
  }
  if (eliteLevel === 2) {
    slug = `${slugify(`${name} elite 2`)}`;
  }
  return `/arknights/operators/${slug}`;
};
