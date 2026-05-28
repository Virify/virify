import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useDraftListingShare } from "../app/composables/useDraftListingShare";

// ─────────────────────────────────────────────────────────────────────────────
// Stub $fetch globally before any imports — mirrors how useMyListings.test.ts
// works. Without this, useRequestFetch falls back to the real ofetch instance
// even when #imports is mocked.
// ─────────────────────────────────────────────────────────────────────────────

const fetchMock = vi.fn();
vi.stubGlobal("$fetch", fetchMock);

vi.mock("#imports", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useRequestFetch: () => fetchMock,
    ref,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const alice = {
  id: 1,
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@example.com",
  avatar: null,
};

const bob = {
  id: 2,
  firstName: null,
  lastName: null,
  email: "bob@example.com",
  avatar: null,
};

const carol = {
  id: 3,
  firstName: "Carol",
  lastName: null,
  email: "carol@example.com",
  avatar: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("useDraftListingShare", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Initial state
  // ───────────────────────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("populates sharedUsers from initialSharedUsers", async () => {
      const { sharedUsers } = useDraftListingShare(1, [alice, bob]);
      expect(sharedUsers.value).toHaveLength(2);
      expect(sharedUsers.value[0].email).toBe("alice@example.com");
      expect(sharedUsers.value[1].email).toBe("bob@example.com");
    });

    it("starts with an empty sharedUsers when none provided", async () => {
      const { sharedUsers } = useDraftListingShare(1, []);
      expect(sharedUsers.value).toEqual([]);
    });

    it("starts with emailError as empty string", async () => {
      const { emailError } = useDraftListingShare(1, []);
      expect(emailError.value).toBe("");
    });

    it("starts with isSubmitting as false", async () => {
      const { isSubmitting } = useDraftListingShare(1, []);
      expect(isSubmitting.value).toBe(false);
    });

    it("starts with an empty removingIds Set", async () => {
      const { removingIds } = useDraftListingShare(1, []);
      expect(removingIds.value.size).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // addUser
  // ───────────────────────────────────────────────────────────────────────────

  describe("addUser", () => {
    it("returns false and does not fetch when draftListingId is undefined", async () => {
      const { addUser } = useDraftListingShare(undefined, []);
      const result = await addUser("test@example.com");
      expect(result).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("POSTs to the correct endpoint with the email", async () => {
      fetchMock.mockResolvedValue({
        success: true,
        sharedUsers: [alice, carol],
      });
      const { addUser } = useDraftListingShare(42, [alice]);
      await addUser("carol@example.com");
      expect(fetchMock).toHaveBeenCalledWith("/api/draft-listings/42/share", {
        method: "POST",
        body: { email: "carol@example.com" },
      });
    });

    it("updates sharedUsers from the server response on success", async () => {
      fetchMock.mockResolvedValue({
        success: true,
        sharedUsers: [alice, carol],
      });
      const { addUser, sharedUsers } = useDraftListingShare(1, [alice]);
      const result = await addUser("carol@example.com");
      expect(result).toBe(true);
      expect(sharedUsers.value).toHaveLength(2);
      expect(sharedUsers.value[1].email).toBe("carol@example.com");
    });

    it("sets emailError from the server message on failure", async () => {
      fetchMock.mockRejectedValue({
        data: { message: "No Virify account found with that email address" },
      });
      const { addUser, emailError } = useDraftListingShare(1, []);
      const result = await addUser("notfound@example.com");
      expect(result).toBe(false);
      expect(emailError.value).toBe(
        "No Virify account found with that email address",
      );
    });

    it("uses a fallback error message when the error has no message", async () => {
      fetchMock.mockRejectedValue({});
      const { addUser, emailError } = useDraftListingShare(1, []);
      await addUser("error@example.com");
      expect(emailError.value).toBe("Something went wrong. Please try again.");
    });

    it("clears emailError before each new attempt", async () => {
      fetchMock
        .mockRejectedValueOnce({ data: { message: "Not found" } })
        .mockResolvedValueOnce({ success: true, sharedUsers: [] });
      const { addUser, emailError } = useDraftListingShare(1, []);
      await addUser("bad@example.com");
      expect(emailError.value).toBe("Not found");
      await addUser("good@example.com");
      expect(emailError.value).toBe("");
    });

    it("resets isSubmitting to false after success", async () => {
      fetchMock.mockResolvedValue({ success: true, sharedUsers: [] });
      const { addUser, isSubmitting } = useDraftListingShare(1, []);
      await addUser("test@example.com");
      expect(isSubmitting.value).toBe(false);
    });

    it("resets isSubmitting to false after failure", async () => {
      fetchMock.mockRejectedValue({ data: { message: "Error" } });
      const { addUser, isSubmitting } = useDraftListingShare(1, []);
      await addUser("test@example.com");
      expect(isSubmitting.value).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // removeUser
  // ───────────────────────────────────────────────────────────────────────────

  describe("removeUser", () => {
    it("does nothing when draftListingId is undefined", async () => {
      const { removeUser } = useDraftListingShare(undefined, [alice, bob]);
      await removeUser(1);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("DELETEs to the correct endpoint with the userId", async () => {
      fetchMock.mockResolvedValue({
        success: true,
        sharedUsers: [bob],
      });
      const { removeUser } = useDraftListingShare(42, [alice, bob]);
      await removeUser(1);
      expect(fetchMock).toHaveBeenCalledWith("/api/draft-listings/42/share", {
        method: "DELETE",
        body: { userId: 1 },
      });
    });

    it("updates sharedUsers with the server response on success", async () => {
      fetchMock.mockResolvedValue({
        success: true,
        sharedUsers: [bob],
      });
      const { removeUser, sharedUsers } = useDraftListingShare(1, [alice, bob]);
      await removeUser(alice.id);
      expect(sharedUsers.value).toHaveLength(1);
      expect(sharedUsers.value[0].email).toBe("bob@example.com");
    });

    it("tracks the userId in removingIds during the request", async () => {
      let removingSnapshot = false;
      fetchMock.mockImplementation(async () => {
        // Capture removingIds state mid-flight (inside the try block)
        removingSnapshot = true;
        return { success: true, sharedUsers: [] };
      });
      const { removeUser, removingIds } = useDraftListingShare(1, [alice]);
      const promise = removeUser(alice.id);
      // removingIds is set synchronously before the await
      expect(removingIds.value.has(alice.id)).toBe(true);
      await promise;
      expect(removingSnapshot).toBe(true);
    });

    it("removes userId from removingIds after success", async () => {
      fetchMock.mockResolvedValue({ success: true, sharedUsers: [] });
      const { removeUser, removingIds } = useDraftListingShare(1, [alice]);
      await removeUser(alice.id);
      expect(removingIds.value.has(alice.id)).toBe(false);
    });

    it("removes userId from removingIds even after a failed request", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"));
      const { removeUser, removingIds } = useDraftListingShare(1, [alice]);
      try {
        await removeUser(alice.id);
      } catch {}
      expect(removingIds.value.has(alice.id)).toBe(false);
    });

    it("does not affect other removingIds entries when one completes", async () => {
      fetchMock.mockResolvedValue({ success: true, sharedUsers: [] });
      const { removeUser, removingIds } = useDraftListingShare(1, [alice, bob]);
      // Simulate bob still being removed when alice's request completes
      removingIds.value = new Set([alice.id, bob.id]);
      await removeUser(alice.id);
      expect(removingIds.value.has(alice.id)).toBe(false);
      expect(removingIds.value.has(bob.id)).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // displayName logic (mirrors the component helper)
  // ───────────────────────────────────────────────────────────────────────────

  describe("displayName logic", () => {
    function displayName(user: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    }): string {
      if (user.firstName || user.lastName) {
        return [user.firstName, user.lastName].filter(Boolean).join(" ");
      }
      return user.email;
    }

    it("returns full name when firstName and lastName are set", () => {
      expect(displayName(alice)).toBe("Alice Smith");
    });

    it("returns firstName only when lastName is null", () => {
      expect(displayName(carol)).toBe("Carol");
    });

    it("falls back to email when both names are null", () => {
      expect(displayName(bob)).toBe("bob@example.com");
    });

    it("handles lastName only when firstName is null", () => {
      expect(
        displayName({
          firstName: null,
          lastName: "Jones",
          email: "j@example.com",
        }),
      ).toBe("Jones");
    });
  });
});
