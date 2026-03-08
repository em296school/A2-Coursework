export interface RegistrationFormProps {
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  password: string;
}

export interface LogInFormProps {
  email: string;
  password: string;
}

export interface FoundUserProps {
  first_name: string;
  last_name: string;
  is_staff: boolean;
  requires_assistance: boolean;
  wheelchair: boolean;
  user_id: number;
}

export interface AccountUpdateProps {
  email: string;
  password: string;
  wheelchair: boolean;
  requires_assistance: boolean;
  isSelfSubmit: boolean;
  targetId: number;
}
