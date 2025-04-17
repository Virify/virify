// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

// Setup global mocks
vi.stubGlobal("defineEventHandler", (fn: any) => fn);
vi.stubGlobal("defineNitroPlugin", (fn: any) => fn);
vi.stubGlobal("getUserSession", vi.fn() as Mock);

vi.mock("#layers/database/server/utils/owner", () => ({
  deleteOwner: vi.fn(),
}));

vi.mock("./shared/utils/use-response", () => ({
  useResponse: vi.fn(() => ({
    successResponse: vi.fn((message) => ({ status: 200, message })),
    errorResponse: vi.fn((error) => ({ status: error.statusCode || 500, message: error.statusMessage })),
  })),
}));

const mockEvent = {} as any;

describe("DELETE /auth/delete", () => {
  let deleteHandler: any;
  let deleteOwner: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    deleteOwner = (await import("#layers/database/server/utils/owner")).deleteOwner;
    deleteHandler = (await import("../server/routes/auth/delete.delete")).default;
  });

  it("should delete the user successfully", async () => {
    (getUserSession as Mock).mockResolvedValue({ user: { id: 1 } });
    deleteOwner.mockResolvedValue(true);

    const response = await deleteHandler(mockEvent);

    expect(getUserSession).toHaveBeenCalledWith(mockEvent);
    expect(deleteOwner).toHaveBeenCalledWith(1);
    expect(response.statusCode).toEqual(200);
  });

  it("should return 401 if the user is not authorized", async () => {
    (getUserSession as Mock).mockResolvedValue(null);

    const response = await deleteHandler(mockEvent);

    expect(response.statusCode).toEqual(401);
    expect(response.statusMessage).toEqual("Unauthorized");
  });

  it("should return 400 if deletion fails", async () => {
    (getUserSession as Mock).mockResolvedValue({ user: { id: 1 } });
    deleteOwner.mockResolvedValue(false);

    const response = await deleteHandler(mockEvent);

    expect(response.statusCode).toEqual(400);
    expect(response.statusMessage).toEqual("Failed to delete user. User may not exist");
  });
});
