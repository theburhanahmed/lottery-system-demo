// Stripe Payment Integration
class StripePayment {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.publicKey = null;
        this.initializeStripe();
    }

    async initializeStripe() {
        // Get Stripe public key from backend config
        try {
            // Try to get from window first (for manual config)
            this.publicKey = window.STRIPE_PUBLIC_KEY || '';
            
            // If not set, fetch from backend
            if (!this.publicKey) {
                try {
                    const response = await fetch(`${API_BASE_URL}/payments/config/`);
                    if (response.ok) {
                        const data = await response.json();
                        this.publicKey = data.public_key || '';
                    }
                } catch (error) {
                    console.warn('Could not fetch Stripe config from backend:', error);
                }
            }
            
            if (!this.publicKey) {
                console.error('Stripe public key not configured');
                return;
            }

            // Load Stripe.js
            if (typeof Stripe === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://js.stripe.com/v3/';
                script.onload = () => this.setupStripe();
                document.head.appendChild(script);
            } else {
                this.setupStripe();
            }
        } catch (error) {
            console.error('Error initializing Stripe:', error);
        }
    }

    setupStripe() {
        try {
            this.stripe = Stripe(this.publicKey);
            this.elements = this.stripe.elements();
            this.setupCardElement();
        } catch (error) {
            console.error('Error setting up Stripe:', error);
        }
    }

    setupCardElement() {
        if (!this.elements) return;

        const style = {
            base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        };

        this.cardElement = this.elements.create('card', { style });
    }

    mountCardElement(containerId) {
        if (!this.cardElement) {
            this.setupCardElement();
        }
        
        const container = document.getElementById(containerId);
        if (container && this.cardElement) {
            this.cardElement.mount(container);
            return true;
        }
        return false;
    }

    unmountCardElement() {
        if (this.cardElement) {
            this.cardElement.unmount();
        }
    }

    async createPaymentIntent(amount, savePaymentMethod = false) {
        try {
            const response = await API.request('/payments/payment-intents/create_intent/', {
                method: 'POST',
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    save_payment_method: savePaymentMethod
                })
            });

            return response;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }

    async confirmPayment(paymentIntentId, paymentMethodId = null) {
        try {
            const response = await API.request('/payments/payment-intents/confirm/', {
                method: 'POST',
                body: JSON.stringify({
                    payment_intent_id: paymentIntentId,
                    payment_method_id: paymentMethodId
                })
            });

            return response;
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw error;
        }
    }

    async handlePayment(amount, savePaymentMethod = false) {
        try {
            // Create payment intent
            const paymentIntent = await this.createPaymentIntent(amount, savePaymentMethod);

            if (!paymentIntent.client_secret) {
                throw new Error('No client secret received');
            }

            // If card element is mounted, use it
            if (this.cardElement) {
                const { error, paymentIntent: confirmedIntent } = await this.stripe.confirmCardPayment(
                    paymentIntent.client_secret,
                    {
                        payment_method: {
                            card: this.cardElement,
                        }
                    }
                );

                if (error) {
                    throw new Error(error.message);
                }

                return {
                    success: true,
                    paymentIntent: confirmedIntent,
                    message: 'Payment successful!'
                };
            } else {
                // Return client secret for frontend to handle
                return {
                    success: true,
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.payment_intent_id,
                    message: 'Payment intent created. Please confirm payment.'
                };
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            return {
                success: false,
                error: error.message || 'Payment failed. Please try again.'
            };
        }
    }

    async savePaymentMethod(paymentMethodId, setAsPrimary = false) {
        try {
            const response = await API.request('/payments/payment-methods/save_method/', {
                method: 'POST',
                body: JSON.stringify({
                    payment_method_id: paymentMethodId,
                    set_as_primary: setAsPrimary
                })
            });

            return response;
        } catch (error) {
            console.error('Error saving payment method:', error);
            throw error;
        }
    }

    async getPaymentMethods() {
        try {
            const response = await API.request('/payments/payment-methods/list/');
            return response;
        } catch (error) {
            console.error('Error getting payment methods:', error);
            throw error;
        }
    }

    async deletePaymentMethod(paymentMethodId) {
        try {
            const response = await API.request(`/payments/payment-methods/${paymentMethodId}/delete/`, {
                method: 'DELETE'
            });

            return response;
        } catch (error) {
            console.error('Error deleting payment method:', error);
            throw error;
        }
    }
}

// Initialize global StripePayment instance
let stripePayment = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        stripePayment = new StripePayment();
    });
} else {
    stripePayment = new StripePayment();
}

