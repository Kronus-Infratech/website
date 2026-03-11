/**
 * Custom hook for form submissions with validation, loading, and error states.
 * Handles API errors and maps field-level errors back to the form.
 */

"use client";

import { useState, useCallback } from "react";
import { ApiError } from "@/lib/api";

export interface FormState {
    loading: boolean;
    success: boolean;
    error: string | null;
    fieldErrors: Record<string, string>;
}

interface UseFormSubmitOptions<T> {
    /** The async function that performs the API call */
    onSubmit: (data: T) => Promise<unknown>;
    /** Optional callback on success */
    onSuccess?: () => void;
    /** Optional validation before submission — return error string or null */
    validate?: (data: T) => string | null;
}

export function useFormSubmit<T>({ onSubmit, onSuccess, validate }: UseFormSubmitOptions<T>) {
    const [state, setState] = useState<FormState>({
        loading: false,
        success: false,
        error: null,
        fieldErrors: {},
    });

    const submit = useCallback(
        async (data: T) => {
            // Client-side validation
            if (validate) {
                const validationError = validate(data);
                if (validationError) {
                    setState({ loading: false, success: false, error: validationError, fieldErrors: {} });
                    return;
                }
            }

            setState({ loading: true, success: false, error: null, fieldErrors: {} });

            try {
                await onSubmit(data);
                setState({ loading: false, success: true, error: null, fieldErrors: {} });
                onSuccess?.();
            } catch (err) {
                if (err instanceof ApiError) {
                    const fieldErrors: Record<string, string> = {};
                    if (err.errors) {
                        for (const e of err.errors) {
                            fieldErrors[e.field] = e.message;
                        }
                    }
                    setState({ loading: false, success: false, error: err.message, fieldErrors });
                } else {
                    setState({
                        loading: false,
                        success: false,
                        error: "Something went wrong. Please try again.",
                        fieldErrors: {},
                    });
                }
            }
        },
        [onSubmit, onSuccess, validate],
    );

    const reset = useCallback(() => {
        setState({ loading: false, success: false, error: null, fieldErrors: {} });
    }, []);

    return { ...state, submit, reset };
}
