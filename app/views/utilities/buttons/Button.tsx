'use client';
/**
 * @type Component
 * Utility button which provides different buttons for the site.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof Utilities
 */

import { ButtonStyleSetting } from '../../settings/ButtonStyleSettings.config';

// Base types
export interface UtilityButton {
  width?: string;
  buttonStyle: ButtonStyleSetting;
}
