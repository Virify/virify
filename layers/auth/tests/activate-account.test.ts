// @vitest-environment nuxt
import { describe, it, vi, expect, beforeAll } from "vitest";
import { defineEventHandler } from "h3";

vi.stubGlobal("useResponse", () => ({
  successResponse: vi.fn((message: string) => ({ status: "success", message })),
  errorResponse: vi.fn((error: any) => ({ status: "error", error })),
}));

vi.mock("#layers/database/server/utils/owner", () => ({
  findOwnerByActivationToken: vi.fn(),
  updateOwnerAndActivate: vi.fn(),
}));

vi.stubGlobal("defineEventHandler", (fn: any) => fn);
vi.stubGlobal("readValidatedBody", vi.fn());
vi.stubGlobal("hashPassword", vi.fn());
vi.stubGlobal("IsNuxtError", vi.fn());

let mockUser = {
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
  role: "USER",
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

let findOwnerByActivationToken: any;
let updateOwnerAndActivate: any;
let activateAccountHandler: any;

describe("Activate Account Tests", () => {
  beforeAll(async () => {
    vi.clearAllMocks();
    findOwnerByActivationToken = (await import("#layers/database/server/utils/owner")).findOwnerByActivationToken;
    updateOwnerAndActivate = (await import("#layers/database/server/utils/owner")).updateOwnerAndActivate;
    activateAccountHandler = (await import("../server/routes/auth/activate-account.post")).default;
  });
  it("should successfully activate an account", async () => {
    const mockEvent = { body: { password: "password123", token: "valid-token" } };

    vi.mocked(readValidatedBody).mockResolvedValueOnce(mockEvent.body);
    vi.mocked(findOwnerByActivationToken).mockResolvedValueOnce(mockUser);
    vi.mocked(hashPassword).mockResolvedValueOnce("hashed-password");

    const response = await activateAccountHandler(mockEvent as any);

    expect(readValidatedBody).toHaveBeenCalledWith(mockEvent, expect.any(Function));
    expect(findOwnerByActivationToken).toHaveBeenCalledWith("valid-token");
    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(updateOwnerAndActivate).toHaveBeenCalledWith(1, "hashed-password");
    expect(response.statusCode).toEqual(200);
  });

  it("should return an error for an invalid token", async () => {
    const mockEvent = { body: { password: "password123", token: "invalid-token" } };

    vi.mocked(readValidatedBody).mockResolvedValueOnce(mockEvent.body);
    vi.mocked(findOwnerByActivationToken).mockResolvedValueOnce(null);

    const response = await activateAccountHandler(mockEvent as any);

    expect(findOwnerByActivationToken).toHaveBeenCalledWith("invalid-token");
    expect(response.statusCode).toEqual(404);
  });

  it("should handle errors during password hashing", async () => {
    const mockEvent = { body: { password: "password123", token: "valid-token" } };
    const mockUser = { id: 1 };

    vi.mocked(readValidatedBody).mockResolvedValueOnce(mockEvent.body);
    vi.mocked(findOwnerByActivationToken).mockResolvedValueOnce(mockUser);
    vi.mocked(hashPassword).mockRejectedValueOnce(new Error("Hash failed"));

    const response = await activateAccountHandler(mockEvent as any);

    expect(response.statusCode).toEqual(500);

    expect(readValidatedBody).toHaveBeenCalledWith(mockEvent, expect.any(Function));
    expect(findOwnerByActivationToken).toHaveBeenCalledWith("valid-token");
  });

  it("should handle errors during user activation", async () => {
    const mockEvent = { body: { password: "password123", token: "valid-token" } };

    vi.mocked(readValidatedBody).mockResolvedValueOnce(mockEvent.body);
    vi.mocked(findOwnerByActivationToken).mockResolvedValueOnce(mockUser);
    vi.mocked(hashPassword).mockResolvedValueOnce("hashed-password");
    vi.mocked(updateOwnerAndActivate).mockRejectedValueOnce(new Error("Activation failed"));

    const response = await activateAccountHandler(mockEvent as any);
    expect(updateOwnerAndActivate).toHaveBeenCalledWith(1, "hashed-password");
    expect(response.statusCode).toEqual(500);
  });
});
