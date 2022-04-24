const { interpolate } = require("./utils");

test("interpolates the localized string", () => {
  const referenceString = "This is a <strong>super cool</strong> sentence!";
  const localizedString = "Ceci est une phrase <0>super cool</0> !";
  const interpolatedString =
    "Ceci est une phrase <strong>super cool</strong> !";

  expect(interpolate(localizedString, referenceString)).toBe(
    interpolatedString
  );
});
