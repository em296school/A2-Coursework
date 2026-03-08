import ValidateAccountParams from './ValidateAccountParams';
import ValidateAccountPassword from './ValidateAccountPassword';
import ValidateAccountUpdate from './ValidateAccountUpdate';
import ValidateFlightCreation from './ValidateFlightCreation';
import ValidateFlightEdits from './ValidateFlightEdits';
import ValidateFlightFilterOptions from './ValidateFlightFilterOptions';
import ValidateFlightSearchParams from './ValidateFlightSearchParams';
import ValidateInboxMessage from './ValidateInboxMessage';
import ValidateLogIn from './ValidateLogIn';
import ValidateSendMessage from './ValidateSendMessage';
import ValidateSignUp from './ValidateSignUp';
import ValidateStarRating from './ValidateStarRating';
import ValidateSupportQuery from './ValidateSupportQuery';

export default class Validator {
  data = {};
  constructor(data: any) {
    this.data = data;
  }

  public validateFlightSearchParams(): boolean {
    return ValidateFlightSearchParams(this.data);
  }

  public validateAccountParams(): boolean {
    return ValidateAccountParams(this.data);
  }

  public validateAccountPassword(): boolean {
    return ValidateAccountPassword(this.data);
  }

  public validateSignUp(): boolean {
    return ValidateSignUp(this.data);
  }

  public validateLogIn(): boolean {
    return ValidateLogIn(this.data);
  }

  public validateStarRating(): boolean {
    return ValidateStarRating(this.data);
  }

  public validateFlightFilterOptions(): boolean {
    return ValidateFlightFilterOptions(this.data);
  }

  public validateFlightEdits(): boolean {
    return ValidateFlightEdits(this.data);
  }

  public validateFlightCreation(): boolean {
    return ValidateFlightCreation(this.data);
  }

  public validateInboxMessage(): boolean {
    return ValidateInboxMessage(this.data);
  }

  public validateSendMessage(): boolean {
    return ValidateSendMessage(this.data);
  }

  public validateAccountUpdate(): boolean {
    return ValidateAccountUpdate(this.data);
  }

  public validateSupportQuery(): boolean {
    return ValidateSupportQuery(this.data);
  }
}
