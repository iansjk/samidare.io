import baseSlugify from "slugify";

function slugify(toSlug: string): string {
  return baseSlugify(toSlug, { lower: true, replacement: "-", remove: /-/g });
}
export default slugify;
