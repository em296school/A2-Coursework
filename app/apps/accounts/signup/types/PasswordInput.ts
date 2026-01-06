/**
 * @type PasswordInput
 * Types associated with the PasswordInput component.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */
import { Property } from 'csstype';

// This is a simple interface defining the props for PasswordInput component
// We implement the css properties for width, maxWidth, and minWidth for standardization of components
export default interface PasswordInputProps {
  width?: Property.Width<string | number> | undefined;
  maxWidth?: Property.MaxWidth<string | number> | undefined;
  minWidth?: Property.MinWidth<string | number> | undefined;
  textShadow?: Property.TextShadow | undefined;

  children?: React.ReactNode;
}
