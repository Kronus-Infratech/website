/**
 * Client-side form validation utilities.
 * Mirrors the backend Zod schemas for immediate feedback.
 */

export function validateName(name: string): string | null {
    const trimmed = name.trim();
    if (!trimmed) return "Name is required";
    if (trimmed.length < 2) return "Name must be at least 2 characters";
    return null;
}

export function validatePhone(phone: string): string | null {
    const digits = phone.replace(/[\s\-\+\(\)]/g, "");
    if (!digits) return "Phone number is required";
    if (digits.length < 10) return "Phone number must be at least 10 digits";
    if (!/^\d+$/.test(digits)) return "Phone number must contain only digits";
    return null;
}

export function validateEmail(email: string, required = false): string | null {
    const trimmed = email.trim();
    if (!trimmed) return required ? "Email is required" : null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Invalid email address";
    return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
    if (!value.trim()) return `${fieldName} is required`;
    return null;
}

export function validateMessage(message: string, maxLength = 2000): string | null {
    if (message.length > maxLength) return `Message must be under ${maxLength} characters`;
    return null;
}

export interface ContactFormData {
    name: string;
    phone: string;
    email: string;
    interest: string;
    message: string;
}

export function validateContactForm(data: ContactFormData): string | null {
    return (
        validateName(data.name) ??
        validatePhone(data.phone) ??
        validateEmail(data.email) ??
        validateRequired(data.interest, "Property interest") ??
        validateMessage(data.message) ??
        null
    );
}

export interface EnquiryFormData {
    name: string;
    phone: string;
    email: string;
    message: string;
}

export function validateEnquiryForm(data: EnquiryFormData): string | null {
    return (
        validateName(data.name) ??
        validatePhone(data.phone) ??
        validateEmail(data.email) ??
        validateMessage(data.message) ??
        null
    );
}

export function validateNewsletterEmail(email: string): string | null {
    return validateEmail(email, true);
}
