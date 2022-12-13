import { getFirstName, isValidPassword } from "../src/utilities/user";

// test("description", function)
test("Should return first name when given both first name and last name separated by a space as a single string", () => {
	const firstName = getFirstName("Matt McGee");

	expect(firstName).toBe("Matt");
});

test("Should return first name when provided only the first name as a string", () => {
  const firstName = getFirstName("Matt")

  expect(firstName).toBe("Matt")
});

test("Should reject password if shorter than 8 characters", ()=> {
  const isValid = isValidPassword("123abc")

  expect(isValid).toBe(false)
})

test("Should reject password that contains the word 'password'", ()=> {
  const isValid = isValidPassword("123Password")

  expect(isValid).toBe(false)
})

test("Should pass a password that meets both length and content requirements", ()=> {
  const isValid = isValidPassword("123GoTouchGrass")

  expect(isValid).toBe(true)
})
