/**
 * Prisma Error Handler - Based on official Prisma error reference
 * https://www.prisma.io/docs/orm/reference/error-reference
 * 
 * Handles both backend logging and frontend user-friendly messages
 */

export interface PrismaError {
  code?: string;
  message?: string;
  meta?: {
    target?: string[];
    field_name?: string;
    table?: string;
    column?: string;
    constraint?: string;
    database_error?: string;
  };
  clientVersion?: string;
}

/**
 * Backend error logging - logs detailed technical information
 */
export function logPrismaError(error: PrismaError, context?: string): void {
  const logContext = context ? `[${context}]` : '[Prisma Error]';
  
  console.error(`${logContext} Prisma Error:`, {
    code: error.code,
    message: error.message,
    meta: error.meta,
    clientVersion: error.clientVersion,
    timestamp: new Date().toISOString()
  });
}

/**
 * Parse P2002 - Unique constraint failed
 */
function parseUniqueConstraintError(error: PrismaError): string {
  const target = error.meta?.target;
  
  if (!target || !Array.isArray(target)) {
    return 'This information already exists in our system.';
  }

  // Address unique constraint
  if (target.includes('number') && target.includes('street') && target.includes('city') && target.includes('postcode')) {
    return 'This address already exists. You may have already created a listing for this property.';
  }

  // Email unique constraint
  if (target.includes('email')) {
    return 'An account with this email address already exists.';
  }

  // Username unique constraint
  if (target.includes('username')) {
    return 'This username is already taken. Please choose a different one.';
  }

  // Phone unique constraint
  if (target.includes('phone')) {
    return 'This phone number is already registered.';
  }

  // Property reference unique constraint
  if (target.includes('propertyReference')) {
    return 'This property reference is already in use.';
  }

  // Generic unique constraint
  const fieldName = target.length === 1 ? target[0] : 'information';
  return `This ${fieldName} already exists. Please use different values.`;
}

/**
 * Parse P2003 - Foreign key constraint failed
 */
function parseForeignKeyError(error: PrismaError): string {
  return 'This action cannot be completed because it would affect related information. Please check your data and try again.';
}

/**
 * Parse P2025 - Record not found
 */
function parseRecordNotFoundError(error: PrismaError): string {
  return 'The requested information was not found. It may have been deleted or moved.';
}

/**
 * Parse P2014 - Required relation violation
 */
function parseRequiredRelationError(error: PrismaError): string {
  return 'Some required information is missing. Please fill in all required fields.';
}

/**
 * Parse P2011 - Null constraint violation
 */
function parseNullConstraintError(error: PrismaError): string {
  const field = error.meta?.field_name || 'field';
  return `The ${field} field is required and cannot be empty.`;
}

/**
 * Parse P2012 - Missing required value
 */
function parseMissingRequiredValueError(error: PrismaError): string {
  return 'Some required information is missing. Please check all required fields.';
}

/**
 * Parse P2000 - Value too long
 */
function parseValueTooLongError(error: PrismaError): string {
  const column = error.meta?.column || 'field';
  return `The ${column} value is too long. Please use a shorter value.`;
}

/**
 * Parse P2006 - Invalid value
 */
function parseInvalidValueError(error: PrismaError): string {
  const field = error.meta?.field_name || 'field';
  return `Invalid value provided for ${field}. Please check your input.`;
}

/**
 * Parse P2021 - Table does not exist
 */
function parseTableNotExistError(error: PrismaError): string {
  return 'A system error occurred. Please try again later or contact support.';
}

/**
 * Parse P2022 - Column does not exist
 */
function parseColumnNotExistError(error: PrismaError): string {
  return 'A system error occurred. Please try again later or contact support.';
}

/**
 * Main function to get user-friendly error message
 */
export function getUserFriendlyPrismaError(error: any, fallbackMessage: string = 'An unexpected error occurred. Please try again.'): string {
  // If it's not a Prisma error, return the original message or fallback
  if (!error?.code || !error.code.startsWith('P')) {
    return error?.message || fallbackMessage;
  }

  const prismaError = error as PrismaError;

  switch (prismaError.code) {
    case 'P2000':
      return parseValueTooLongError(prismaError);
    
    case 'P2001':
      return 'The requested record was not found.';
    
    case 'P2002':
      return parseUniqueConstraintError(prismaError);
    
    case 'P2003':
      return parseForeignKeyError(prismaError);
    
    case 'P2004':
      return 'A constraint was violated. Please check your input data.';
    
    case 'P2005':
      return 'Invalid data type provided. Please check your input.';
    
    case 'P2006':
      return parseInvalidValueError(prismaError);
    
    case 'P2007':
      return 'Data validation failed. Please check your input.';
    
    case 'P2008':
      return 'Failed to parse the request. Please check your input.';
    
    case 'P2009':
      return 'Failed to validate the request. Please check your input.';
    
    case 'P2010':
      return 'A database error occurred. Please try again.';
    
    case 'P2011':
      return parseNullConstraintError(prismaError);
    
    case 'P2012':
      return parseMissingRequiredValueError(prismaError);
    
    case 'P2013':
      return 'Missing required information. Please check all required fields.';
    
    case 'P2014':
      return parseRequiredRelationError(prismaError);
    
    case 'P2015':
      return 'Related information was not found. Please check your data.';
    
    case 'P2016':
      return 'Failed to interpret the request. Please try again.';
    
    case 'P2017':
      return 'Records are not properly connected. Please check your data.';
    
    case 'P2018':
      return 'Required connected information was not found.';
    
    case 'P2019':
      return 'Input error occurred. Please check your data.';
    
    case 'P2020':
      return 'Value is out of acceptable range. Please adjust your input.';
    
    case 'P2021':
      return parseTableNotExistError(prismaError);
    
    case 'P2022':
      return parseColumnNotExistError(prismaError);
    
    case 'P2023':
      return 'Inconsistent data detected. Please check your input.';
    
    case 'P2024':
      return 'Connection timeout occurred. Please try again.';
    
    case 'P2025':
      return parseRecordNotFoundError(prismaError);
    
    case 'P2026':
      return 'This feature is not supported. Please try a different approach.';
    
    case 'P2027':
      return 'Multiple errors occurred during the operation. Please check your data.';
    
    case 'P2028':
      return 'Transaction API error occurred. Please try again.';
    
    case 'P2030':
      return 'Search index not found. Please contact support.';
    
    case 'P2031':
      return 'MongoDB replica set is required for transactions.';
    
    case 'P2033':
      return 'A number used in the query does not fit into a 64 bit signed integer.';
    
    case 'P2034':
      return 'Transaction failed due to a write conflict or deadlock.';
    
    default:
      return fallbackMessage;
  }
}

/**
 * Complete Prisma error handler - logs on backend and returns user message
 */
export function handlePrismaError(
  error: any, 
  context?: string, 
  fallbackMessage: string = 'An unexpected error occurred. Please try again.'
): string {
  // Log the error for backend debugging
  if (error?.code?.startsWith('P')) {
    logPrismaError(error as PrismaError, context);
  }
  
  // Return user-friendly message for frontend
  return getUserFriendlyPrismaError(error, fallbackMessage);
}