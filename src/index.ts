import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Options for file traversal
 */
export interface TraverseOptions {
    directory: string;
    filter: (filePath: string) => boolean;
}

/**
 * Traverses a directory recursively and returns an array of file paths matching the filter
 * @param options TraverseOptions object containing directory path and filter function
 * @returns Promise<string[]> Array of matching file paths
 */
export async function traverseFiles({ directory, filter }: TraverseOptions): Promise<string[]> {
    const results: string[] = [];

    try {
        const entries = await readdir(directory, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(directory, entry.name);

            if (entry.isDirectory()) {
                // Recursively traverse subdirectories
                const subResults = await traverseFiles({ directory: fullPath, filter });
                results.push(...subResults);
            } else if (entry.isFile() && filter(fullPath)) {
                // Add file if it matches the filter
                results.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error traversing directory ${directory}:`, error);
    }

    return results;
}

