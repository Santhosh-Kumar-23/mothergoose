import * as yup from "yup";
import _ from "lodash";

/**
 * Test if name includes only letters and spaces
 */
export const legalNameRegex = /^(?![ .]+$)[a-zA-Z .]*$/;
/**
 * Test if name includes only letters and hyphens
 */
export const nameWithHyphensRegex = /^[a-zA-Z]+(-[a-zA-Z]*)?$/;

export const zipCodeRegex = /^\d{4,5}(?:[-\s]\d{4})?$/;
export const canadianPostalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Test if date of birth matches the format MM/DD/YYYY
 */
export const dobMDYRegex =
  /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

/**
 * Validation for checking if one of two fields exists.
 * @param {*} ref - Reference of another field in form
 * @param {*} msg - Error message
 */
function eitherExists(ref, msg) {
  return this.test({
    name: "pregnancyFields",
    exclusive: false,
    message: msg || "${path} must be the same as ${reference}",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      if (value && !dobMDYRegex.test(value)) return false;
      return (
        true === !_.isEmpty(this.resolve(ref)) || !_.isEmpty(value) === true
      );
    },
  });
}

/** Add custom method to yup */
yup.addMethod(yup.string, "eitherExists", eitherExists);

/** Validation Schema for Pregnancy Details */
export const pregnancy_details_validation = yup.object().shape({
  menstrual_period: yup
    .string()
    .default("")
    .eitherExists(yup.ref("estimated_delivery_date"), ""),
  estimated_delivery_date: yup
    .string()
    .default("")
    .eitherExists(yup.ref("menstrual_period"), ""),
});
