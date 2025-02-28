/**
 * Utility function to create standardized HTTP responses.
 * @returns An object containing helper functions for creating specific HTTP responses.
 */
export const useResponse = () => {
  /**
   * Creates a generic response format.
   * @param status - The HTTP status code.
   * @param message - The message to include in the response.
   * @param error - Whether the response indicates an error.
   * @returns An object representing the HTTP response.
   */
  const createResponse = (status: number, message: string, error = false) => ({
    status,
    body: error ? { error: `Failed! ${message}` } : { message },
  });

  /**
   * Creates a 401 Unauthorized response.
   * @param message - The message to include in the response.
   * @returns An object representing the HTTP response.
   */
  const unauthorizedResponse = (message: string) => createResponse(401, message, true);

  /**
   * Creates a 403 Forbidden response.
   * @param message - The message to include in the response.
   * @returns An object representing the HTTP response.
   */
  const forbiddenResponse = (message: string) => createResponse(403, message, true);

  /**
   * Creates a 200 OK success response.
   * @param message - The message to include in the response.
   * @returns An object representing the HTTP response.
   */
  const successResponse = (message: string) => createResponse(200, message);

  /**
   * Creates a 201 Created success response.
   * @param message - The message to include in the response.
   * @returns An object representing the HTTP response.
   */
  const createdResponse = (message: string) => createResponse(201, message);

  /**
   * Creates a 500 Internal Server Error response.
   * @returns An object representing the HTTP response.
   */
  const internalServerError = () => createResponse(500, "Internal server error", true);

  return {
    unauthorizedResponse,
    forbiddenResponse,
    successResponse,
    createdResponse,
    internalServerError,
  };
};
