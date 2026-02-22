export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialFormState: FormState = {
  success: false,
  message: "",
  errors: {},
};
