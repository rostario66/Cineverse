export const validators = {
    username: (value: string): string | null => {
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value))
            return 'Username can only contain letters, numbers and underscores';
        return null;
    },

    email: (value: string): string | null => {
        if (!value.includes('@')) return 'Email must contain @';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return 'Invalid email format';
        return null;
    },

    password: (value: string): string | null => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        return null;
    },
};