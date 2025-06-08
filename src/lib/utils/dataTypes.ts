import { z } from 'zod';
import { parseISO } from 'date-fns';
import { isValid } from 'date-fns';

export const numberSchema = z.number();
export const stringSchema = z.string();
export const booleanSchema = z.boolean();
export const dateSchema = z.date();
export const date_isoSchema = z
	.string()
	.refine(
		(v, ctx?: any) => {
			const parsed = parseISO(v);
			const isValidDate = isValid(parsed);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: "Expected a date in format 'YYYY-MM-DDTHH:mm:ss.sssZ'"
				});
				return isValidDate;
			}

			return true;
		},
		{ message: "Expected a date in format 'YYYY-MM-DDTHH:mm:ss.sssZ'" }
	)
	.transform((v) => parseISO(v));

export const date_onlySchema = z
	.string()
	.refine(
		(v, ctx?: any) => {
			const parsed = parseISO(v);
			const isValidDate = isValid(parsed);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: "Expected a date in format 'YYYY-MM-DD'"
				});
				return isValidDate;
			}

			return true;
		},
		{ message: "Expected a date in format 'YYYY-MM-DD'" }
	)
	.transform((v) => parseISO(v));

export const date_timeSchema = z
	.string()
	.refine(
		(v, ctx?: any) => {
			const parsed = parseISO(v);
			const isValidDate = isValid(parsed);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: "Expected a date in format 'YYYY-MM-DD 00:00:00'"
				});
				return isValidDate;
			}

			return true;
		},
		{ message: "Expected a date in format 'YYYY-MM-DD 00:00:00'" }
	)
	.transform((v) => parseISO(v));

export const date_unix_sSchema = z
	.number()
	.refine(
		(v, ctx?: any) => {
			const date = new Date(v * 1000);
			const isValidDate = isValid(date);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: 'Expected a valid unix timestamp in seconds'
				});
				return isValidDate;
			}

			return true;
		},
		{ message: 'Expected a valid unix timestamp in seconds' }
	)
	.transform((v) => new Date(v * 1000));

export const date_unix_msSchema = z
	.number()
	.refine(
		(v, ctx?: any) => {
			const date = new Date(v);
			const isValidDate = isValid(date);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: 'Expected a valid unix timestamp in milliseconds'
				});
				return isValidDate;
			}

			return true;
		},
		{ message: 'Expected a valid unix timestamp in milliseconds' }
	)
	.transform((v) => new Date(v));
export type NumberSchema = z.infer<typeof numberSchema>;
export type StringSchema = z.infer<typeof stringSchema>;
export type BooleanSchema = z.infer<typeof booleanSchema>;
export type DateSchema = z.infer<typeof dateSchema>;
export type DateIsoSchema = z.infer<typeof date_isoSchema>;
export type DateOnlySchema = z.infer<typeof date_onlySchema>;
export type DateTimeSchema = z.infer<typeof date_timeSchema>;
export type DateUnixSSchema = z.infer<typeof date_unix_sSchema>;
export type DateUnixMSchema = z.infer<typeof date_unix_msSchema>;

export const supported_type_list = [
	'any',
	// basics
	'number',
	'string',
	'boolean',
	// date
	'date', // "Mon May 06 2025 14:42:10 GMT+0100 (British Summer Time)"
	'date_iso', // "2025-05-06T14:35:00Z"
	'date_only', // "2025-05-06"
	'date_time', // "2025-05-06T14:35:00"
	'date_unix_s', // 1715066100
	'date_unix_ms' // 1715066100000
];
export const SupportedTypeSchema = z
	.enum(supported_type_list)
	.transform((v) => (v.toString().startsWith('date_') ? 'date' : v));

export type SupportedType = z.infer<typeof SupportedTypeSchema>;

export const DataTypeSchema = z.union([
	// basics
	numberSchema,
	stringSchema,
	booleanSchema,
	// date
	dateSchema,
	date_isoSchema,
	date_onlySchema,
	date_timeSchema,
	date_unix_sSchema,
	date_unix_msSchema
]);
// .transform((v) => (v.toString().startsWith('date_') ? 'date' : v));

export const SupportedTypeMap = {
	any: DataTypeSchema,
	// basics
	number: numberSchema,
	string: stringSchema,
	boolean: booleanSchema,
	// date
	date: dateSchema,
	date_iso: date_isoSchema,
	date_only: date_onlySchema,
	date_time: date_timeSchema,
	date_unix_s: date_unix_sSchema,
	date_unix_ms: date_unix_msSchema
};
export type DataType = z.infer<typeof DataTypeSchema>;
