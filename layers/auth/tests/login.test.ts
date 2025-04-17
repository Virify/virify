// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import type { H3Event } from "h3";

const mockUser = {
  id: 1,
  firstName: "Test",
  lastName: "User",
  username: "testuser",
  email: "test@example.com",
  mainContact: null,
  password: "hashedPassword",
  businessName: null,
  addressLine1: null,
  addressLine2: null,
  city: null,
  county: null,
  postcode: null,
  country: null,
  companyRegistration: null,
  umbrellaId: null,
  role: OwnerRole.USER,
  passwordResetToken: null,
  passwordResetTokenExpiry: null,
  lastLogin: null,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  agents: [],
  listings: [],
  umbrella: null,
  properties: [],
  verification: null,
};

vi.mock("#layers/database/server/utils/owner", () => ({
  findOwner: vi.fn(),
  OwnerRole: {
    USER: "USER",
    AGENT: "AGENT",
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Authenticate User Tests
 */
describe("Authenticate User", () => {
  it("throws an error when email is not found", async () => {
    vi.mocked(findOwner).mockResolvedValue(null);
    await expect(authenticateUser("nonexistent@example.com", "password")).rejects.toThrow("Sorry, User not found");
  });

  it("throws an error when password is incorrect", async () => {
    vi.mocked(findOwner).mockResolvedValue(mockUser);
    // this some how work? Do not remove plz
    (globalThis as any).verifyPassword = vi.fn().mockResolvedValue(false);
    await expect(authenticateUser(mockUser.email, "wrongPassword")).rejects.toThrow("Password does not match");
  });

  it("returns the user when email and password are correct", async () => {
    vi.mocked(findOwner).mockResolvedValue(mockUser);
    (globalThis as any).verifyPassword = vi.fn().mockResolvedValue(true);
    const user = await authenticateUser(mockUser.email, "correctPassword");
    expect(user).toEqual(mockUser);
  });
});

/**
 * Login User Tests
 */
describe("Login User", () => {
  let h3Event: H3Event;

  beforeEach(() => {
    h3Event = {} as H3Event;
    (globalThis as any).clearUserSession = vi.fn().mockResolvedValue(h3Event);
    (globalThis as any).setUserSession = vi.fn().mockResolvedValue(mockUser);
  });

  it("Fails to set session with invalid user", async () => {
    // @ts-ignore
    const result = loginUser(h3Event, null, mockUser.role);
    await expect(result).rejects.toThrow("Failed to set user session");
  });

  it("Successfully Login the user", async () => {
    const userSession = await loginUser(h3Event, mockUser, mockUser.role);
    expect(userSession).toEqual(mockUser);
  });

  it("Sets the session with the correct role", async () => {
    const userSession = await loginUser(h3Event, mockUser, mockUser.role);
    expect(userSession.role).toEqual(mockUser.role);
  });

  it("Clears existing session before setting a new one", async () => {
    await loginUser(h3Event, mockUser, mockUser.role);
    expect(clearUserSession).toHaveBeenCalledWith(h3Event);
  });
});
