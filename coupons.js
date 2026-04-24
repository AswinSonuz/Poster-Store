/**
 * COUPON CODES CONFIGURATION
 * 
 * Add your coupon codes here.
 * type: 'percent' (percentage discount) or 'fixed' (fixed amount discount in INR)
 * value: The numerical value of the discount
 */

const COUPONS = {
    'FRAMD10': { type: 'percent', value: 10, description: '10% off on your first order' },
    'LAUNCH20': { type: 'percent', value: 20, description: 'Special launch discount of 20%' },
    'FREESHIP': { type: 'fixed', value: 0, description: 'Free shipping applied' }, // Could be used to negate shipping if I add it
    'SAVE50': { type: 'fixed', value: 50, description: 'Flat ₹50 off' }
};
