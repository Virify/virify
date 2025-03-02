import { H3Event, createError } from "h3";

/**
 * Utility function to create standardized HTTP responses.
 * @returns An object containing helper functions for creating specific HTTP responses.
 */
export const useResponse = () => {
  /**
   * Creates a generic response format.
   * @param status - The HTTP status code.
   * @param message - The message to include in the response.
   * @param error - Whether the response indicates an error or an Error object.
   * @returns An object representing the HTTP response.
   */
  const createResponse = (status: number, message: string, error: boolean | Error = false) => ({
    status,
    body: error ? { error: `Failed! ${message}`, details: error instanceof Error ? error.message : undefined } : { message },
  });

  /**
   * Sets the response on the event object.
   * @param event - The H3 event object.
   * @param response - The response object to set.
   */
  const setResponse = (event: H3Event, response: { status: number; body: any }) => {
    event.node.res.statusCode = response.status;
    event.node.res.end(JSON.stringify(response.body));
  };

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
   * @param error - The error object to include in the response.
   * @returns An object representing the HTTP response.
   */
  const internalServerError = (error: any) => {
    const statusCode = error.statusCode || 500;
    const statusMessage = error.statusMessage || "Internal Server Error";
    return createResponse(statusCode, statusMessage, error);
  };

  return {
    createResponse,
    setResponse,
    unauthorizedResponse,
    forbiddenResponse,
    successResponse,
    createdResponse,
    internalServerError,
  };
};