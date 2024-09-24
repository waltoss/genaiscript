// Import the CSV parsing function from the csv-parse library
import { parse } from "csv-parse/sync"
// Import the TraceOptions interface for logging trace information
import { TraceOptions } from "./trace"

/**
 * Parses a CSV string into an array of objects.
 *
 * @param text - The CSV string to parse.
 * @param options - Optional parsing configuration.
 * @param options.delimiter - Delimiter used in the CSV, defaults to comma.
 * @param options.headers - Array of headers for the CSV columns.
 * @returns An array of objects representing the CSV data.
 */
export function CSVParse(
    text: string,
    options?: {
        delimiter?: string
        headers?: string[]
    }
): object[] {
    // Destructure options or provide defaults
    const { delimiter, headers } = options || {}
    // Parse the CSV string based on the provided options
    return parse(text, {
        autoParse: true, // Automatically parse values to appropriate types
        castDate: false, // Do not cast strings to dates
        comment: "#", // Ignore comments starting with '#'
        columns: headers || true, // Use provided headers or infer from the first line
        skipEmptyLines: true, // Skip empty lines in the CSV
        skipRecordsWithError: true, // Skip records that cause errors
        delimiter, // Use the provided delimiter
    })
}

/**
 * Attempts to parse a CSV string into an array of objects, with error handling.
 *
 * @param text - The CSV string to parse.
 * @param options - Optional parsing configuration and tracing options.
 * @param options.delimiter - Delimiter used in the CSV, defaults to comma.
 * @param options.headers - Array of headers for the CSV columns.
 * @param options.trace - Trace function for logging errors.
 * @returns An array of objects representing the CSV data, or undefined if parsing fails.
 */
export function CSVTryParse(
    text: string,
    options?: {
        delimiter?: string
        headers?: string[]
    } & TraceOptions
): object[] | undefined {
    const { trace } = options || {}
    try {
        // Attempt to parse the CSV
        return CSVParse(text, options)
    } catch (e) {
        // Log error using trace function if provided
        trace?.error("reading csv", e)
        return undefined
    }
}

/**
 * Converts an array of objects into a Markdown table format.
 *
 * @param csv - The array of objects representing CSV data.
 * @param options - Options for formatting the table.
 * @param options.headers - Array of headers for the table columns.
 * @returns A string representing the CSV data in Markdown table format.
 */
export function CSVToMarkdown(csv: object[], options?: { headers?: string[] }) {
    if (!csv?.length) return ""

    const { headers = Object.keys(csv[0]) } = options || {}
    const res: string[] = [
        `|${headers.join("|")}|`, // Create Markdown header row
        `|${headers.map(() => "-").join("|")}|`, // Create Markdown separator row
        ...csv.map(
            (row) =>
                `|${headers
                    .map((key) => {
                        const v = (row as any)[key]
                        const s = v === undefined || v === null ? "" : String(v)
                        // Escape special Markdown characters and format cell content
                        return s
                            .replace(/\s+$/, "")
                            .replace(/[\\`*_{}[\]()#+\-.!]/g, (m) => "\\" + m)
                            .replace(/</g, "lt;")
                            .replace(/>/g, "gt;")
                            .replace(/\r?\n/g, "<br>")
                    })
                    .join("|")}|` // Join columns with '|'
        ),
    ]
    return res.join("\n") // Join rows with newline
}
