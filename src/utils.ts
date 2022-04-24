export const interpolate = (
  localizedString: string,
  referenceString: string
): string => {
  const tagsRegex = /<([\w\d]+)([^>]*)>/gi;

  const referenceTags = [];
  referenceString.match(tagsRegex).forEach((tagNode) => {
    const [, name, attributes] = tagsRegex.exec(tagNode) || [];
    referenceTags.push({ name, attributes });

    // reset regex state
    tagsRegex.exec("");
  });

  if (referenceTags === []) {
    console.warn(
      "WARNING(astro-i18next): The default slot does not include any html tag to interpolate!"
    );
    return localizedString;
  }

  let interpolatedString = localizedString;
  for (let index = 0; index < referenceTags.length; index++) {
    const referencedTag = referenceTags[index];
    interpolatedString = interpolatedString.replaceAll(
      `<${index}>`,
      `<${referencedTag.name}${referencedTag.attributes}>`
    );
    interpolatedString = interpolatedString.replaceAll(
      `</${index}>`,
      `</${referencedTag.name}>`
    );
  }

  return interpolatedString;
};
