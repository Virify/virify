# Mortgage Calculator Layer

The **Mortgage Calculator Layer** provides a self-contained mortgage calculator component that can be used anywhere in the application.

---

## 🎯 Features

- **Mortgage Calculator Component**: A full-featured form for calculating mortgage payments
- **Buyer Type Support**: First Time Buyer, Buy to Let, Home Mover, Remortgage
- **UK Rate Data**: Monthly updated average UK mortgage rates via GPT-4o-mini
- **Database Storage**: Rates stored in the main database (MortgageRate table)
- **Automatic Rate Fetching**: Nitro scheduled task runs monthly on the 1st at 9am UTC

---

## 📦 Components

### `MortgageCalculator`

A self-contained mortgage calculator component that includes:

- Property price input
- Deposit amount/percentage input
- Buyer type selection (FTB, BTL, Home Mover, Remortgage)
- Mortgage term selection
- Results display with monthly payments, total cost, and interest breakdown

```vue
<template>
  <MortgageCalculator />
</template>
```

---

## 🔧 API Endpoints

### `GET /api/mortgage/rates`

Returns the latest UK mortgage rates from the database.

### `POST /api/mortgage/calculate`

Calculates mortgage payments based on input parameters.

**Request Body:**
```json
{
  "propertyPrice": 250000,
  "deposit": 25000,
  "termYears": 25,
  "buyerType": "FIRST_TIME_BUYER",
  "rateType": "FIXED_2_YEAR"
}
```

---

## ⏰ Scheduled Tasks

### `mortgage:fetch-rates`

Runs monthly (1st of each month at 9am UTC) to fetch the latest average UK mortgage rates from GPT-4o-mini and stores them in the database.

To run manually:
```bash
npx nitro task run mortgage:fetch-rates
```

---

## 🗄️ Database Schema

### MortgageRate Model

Stores historical UK mortgage rates:
- Rate type (Fixed 2yr, Fixed 5yr, Variable, etc.)
- Buyer type (FTB, BTL, etc.)
- Average rate percentage
- LTV (Loan-to-Value) bracket
- Timestamp

---

## 🔗 Related Docs

- [Database Layer](../database/README.md)
- [UI Layer](../ui/README.md)
