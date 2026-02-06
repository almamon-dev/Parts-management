# System Numbering Formats

This document defines the standardized numbering formats used across the Lee Parts Management System.

## Number Formats

### 1. Quote Number

**Format:** `QT` + 4 digits  
**Example:** `QT2001`  
**Usage:** Quotation requests from customers  
**Starting Number:** 2001

### 2. Return Number

**Format:** `RT` + 4 digits  
**Example:** `RT1001`  
**Usage:** Product return requests  
**Starting Number:** 1001

### 3. Order Number

**Format:** `OR` + 5 digits  
**Example:** `OR21001`  
**Usage:** Customer orders  
**Starting Number:** 21001

### 4. Invoice Number

**Format:** `INV` + 6 digits  
**Example:** `INV100001`  
**Usage:** Sales invoices  
**Starting Number:** 100001

### 5. Lead Number

**Format:** `LD-` + 5 digits  
**Example:** `LD-10001`  
**Usage:** Sales leads tracking  
**Starting Number:** 10001  
**Note:** Uses hyphen separator

### 6. Parts Panel ID (PP ID)

**Format:** `PP` + 6 digits  
**Example:** `PP110001`  
**Usage:** Parts panel identification  
**Starting Number:** 110001

### 7. B2B Customer Number

**Format:** `CT` + 4 digits  
**Example:** `CT5101`  
**Usage:** B2B customer identification and login username  
**Starting Number:** 5101  
**Note:** This is used as the username when B2B customers log in

## Implementation Notes

### Current Implementation Status

1. **Order Number** ✅ - Already implemented in `Order` model
    - Uses format: `OR` + 5 digits
    - Auto-generated on order creation

2. **Quote Number** - Needs verification
    - Check if implemented in Quote model

3. **Return Number** - Needs verification
    - Check if implemented in Return model

4. **Invoice Number** - Needs implementation
    - Should be generated when order is fulfilled

5. **Lead Number** - Needs verification
    - Check if implemented in Lead model

6. **Parts Panel ID** - Needs verification
    - Check if implemented in Product/Part model

7. **B2B Customer Number** - Needs implementation
    - Should be auto-generated on B2B customer registration
    - Used as username for login

### Database Considerations

Each numbering system should have:

- Unique index on the number column
- Auto-increment logic in model boot method or observer
- Validation to ensure format consistency

### Example Implementation (Order Model)

```php
protected static function boot()
{
    parent::boot();

    static::creating(function ($order) {
        if (!$order->order_number) {
            $lastOrder = static::orderBy('id', 'desc')->first();
            $nextNumber = $lastOrder ? intval(substr($lastOrder->order_number, 2)) + 1 : 21001;
            $order->order_number = 'OR' . $nextNumber;
        }
    });
}
```

## Future Enhancements

1. Add settings table to configure starting numbers
2. Add ability to reset counters (with admin permission)
3. Add number format validation in form requests
4. Add search functionality by number across all modules
5. Add number history/audit trail

## Related Files

- `app/Models/Order.php` - Order numbering
- `app/Models/Quote.php` - Quote numbering
- `app/Models/Return.php` - Return numbering
- `app/Models/Lead.php` - Lead numbering
- `app/Models/User.php` - B2B customer numbering
- `database/migrations/*` - Number column definitions
